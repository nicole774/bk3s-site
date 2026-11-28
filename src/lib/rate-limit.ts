import "server-only";

import { createHash } from "crypto";
import { headers } from "next/headers";

import { prisma } from "./db";

/**
 * §25 — anti brute-force : limites de tentatives de connexion.
 *
 * Stockage en base de données (aucun service externe) : chaque échec est
 * enregistré, et le blocage s'applique sur deux plans :
 *  - par COMPTE : 5 échecs en 15 minutes → le compte est verrouillé temporairement
 *    (défense contre le devin de mot de passe ciblé) ;
 *  - par CONNEXION : 20 échecs en 60 minutes → l'adresse IP est bloquée
 *    (défense contre le test massif de mots de passe sur de nombreux comptes).
 *
 * Une connexion réussie remet le compteur du compte à zéro.
 */

const MAX_FAILED_PER_EMAIL = 5;
const EMAIL_WINDOW_MIN = 15;
const MAX_FAILED_PER_IP = 20;
const IP_WINDOW_MIN = 60;

/** Empreinte de l'adresse IP — jamais l'IP brute en base (§26, minimisation). */
export async function clientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "inconnu";
  return createHash("sha256").update(`${ip}:${process.env.AUTH_SECRET ?? ""}`).digest("hex").slice(0, 32);
}

/** Renvoie un message de blocage si les limites sont atteintes, sinon null. */
export async function loginBlocked(email: string, ipHash: string): Promise<string | null> {
  const now = Date.now();

  const failedForEmail = await prisma.loginAttempt.count({
    where: { email, createdAt: { gte: new Date(now - EMAIL_WINDOW_MIN * 60_000) } },
  });
  if (failedForEmail >= MAX_FAILED_PER_EMAIL) {
    return `Trop de tentatives pour ce compte. Réessayez dans ${EMAIL_WINDOW_MIN} minutes.`;
  }

  const failedForIp = await prisma.loginAttempt.count({
    where: { ipHash, createdAt: { gte: new Date(now - IP_WINDOW_MIN * 60_000) } },
  });
  if (failedForIp >= MAX_FAILED_PER_IP) {
    return "Trop de tentatives depuis votre connexion. Réessayez plus tard.";
  }

  return null;
}

export async function recordFailedLogin(email: string, ipHash: string) {
  await prisma.loginAttempt.create({ data: { email, ipHash } });
}

/** Remet le compteur du compte à zéro après une connexion réussie. */
export async function clearLoginFailures(email: string) {
  await prisma.loginAttempt.deleteMany({ where: { email } });
}
