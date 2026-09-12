import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Role, Prisma } from "@prisma/client";

import { prisma } from "./db";

const COOKIE_NAME = "bk3s_session";
const SESSION_DAYS = 7;

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, role: Role) {
  const token = await new SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  candidateProfileId?: string;
  companyId?: string;
};

/** Utilisateur courant (1 requête max par rendu, grâce à React cache). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, secret());
    userId = String(payload.sub ?? "");
  } catch {
    return null;
  }
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { candidateProfile: { select: { id: true } }, company: { select: { id: true } } },
  });
  if (!user || user.status !== "ACTIVE") return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    candidateProfileId: user.candidateProfile?.id,
    companyId: user.company?.id,
  };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/");
  return user;
}

/** Journalisation des opérations importantes (§25). */
export async function logAction(
  userId: string | null,
  action: string,
  entity?: string | null,
  entityId?: string | null,
  metadata?: Prisma.InputJsonValue,
) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entity: entity ?? undefined, entityId: entityId ?? undefined, metadata } });
  } catch {
    // la journalisation ne doit jamais bloquer une opération métier
  }
}

const ADMIN_ROLES: Role[] = ["ADMIN", "CONSULTANT"];
export const isAdminTeam = (role: Role) => ADMIN_ROLES.includes(role);
