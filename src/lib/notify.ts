import "server-only";

import type { Role } from "@prisma/client";
import { prisma } from "./db";

/** Crée une notification interne pour un utilisateur. */
export async function notify(userId: string, title: string, body?: string, link?: string) {
  try {
    await prisma.notification.create({ data: { userId, title, body, link } });
  } catch {
    // jamais bloquant
  }
}

/** Notifie tous les membres de l'équipe BK3S (admins + consultants). */
export async function notifyAdminTeam(title: string, body?: string, link?: string) {
  const team = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "CONSULTANT"] as Role[] }, status: "ACTIVE" },
    select: { id: true },
  });
  if (team.length === 0) return;
  await prisma.notification.createMany({
    data: team.map((u) => ({ userId: u.id, title, body, link })),
  });
}
