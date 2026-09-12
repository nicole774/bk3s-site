"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { notifyAdminTeam } from "@/lib/notify";
import { str, optionalStr } from "@/lib/utils";

export type AuthState = { error?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_HOME: Record<string, string> = {
  CANDIDATE: "/candidat",
  COMPANY: "/entreprise",
  ADMIN: "/admin",
  CONSULTANT: "/admin",
  EDITOR: "/admin",
};

export async function registerCandidate(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const email = str(formData, "email").toLowerCase();
  const phone = str(formData, "phone");
  const city = optionalStr(formData, "city");
  const country = optionalStr(formData, "country") ?? "Burkina Faso";
  const password = str(formData, "password");
  const confirm = str(formData, "confirm");
  const terms = formData.get("terms") === "on";

  if (!firstName || !lastName || !email || !password) return { error: "Merci de remplir tous les champs obligatoires." };
  if (!EMAIL_RE.test(email)) return { error: "Adresse e-mail invalide." };
  if (password.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  if (password !== confirm) return { error: "Les deux mots de passe ne correspondent pas." };
  if (!terms) return { error: "Vous devez accepter les conditions d'utilisation et la politique de confidentialité." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Un compte existe déjà avec cette adresse e-mail." };

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
      phone: phone || null,
      role: "CANDIDATE",
      candidateProfile: { create: { city, country } },
    },
  });

  await notifyAdminTeam("Nouvelle inscription candidat", `${firstName} ${lastName} (${email})`, "/admin/utilisateurs");
  await createSession(user.id, user.role);
  redirect("/candidat");
}

export async function registerCompany(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const email = str(formData, "email").toLowerCase();
  const phone = str(formData, "phone");
  const password = str(formData, "password");
  const confirm = str(formData, "confirm");
  const terms = formData.get("terms") === "on";

  const name = str(formData, "name");
  const sector = str(formData, "sector");
  const city = optionalStr(formData, "city");
  const website = optionalStr(formData, "website");
  const description = optionalStr(formData, "description");

  if (!firstName || !lastName || !email || !password || !name || !sector) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }
  if (!EMAIL_RE.test(email)) return { error: "Adresse e-mail invalide." };
  if (password.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  if (password !== confirm) return { error: "Les deux mots de passe ne correspondent pas." };
  if (!terms) return { error: "Vous devez accepter les conditions d'utilisation et la politique de confidentialité." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Un compte existe déjà avec cette adresse e-mail." };

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
      phone: phone || null,
      role: "COMPANY",
      company: {
        create: { name, sector, city, website, description, contactName: `${firstName} ${lastName}`, email, status: "PENDING" },
      },
    },
  });

  await notifyAdminTeam("Nouvelle entreprise à valider", `${name} (${email})`, "/admin/entreprises");
  await createSession(user.id, user.role);
  redirect("/entreprise");
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");
  const next = str(formData, "next");

  if (!email || !password) return { error: "Merci de saisir votre e-mail et votre mot de passe." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-mail ou mot de passe incorrect." };
  }
  if (user.status === "SUSPENDED") {
    return { error: "Votre compte est suspendu. Contactez-nous à " + "contact@bk3sconsulting.com" + "." };
  }

  await createSession(user.id, user.role);

  if (next.startsWith("/") && !next.startsWith("//")) redirect(next);
  redirect(ROLE_HOME[user.role] ?? "/");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
