import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Keep-alive : appelé chaque jour par le cron de Vercel (voir vercel.json).
 * Objectif : maintenir la base Supabase « active » (le plan gratuit met en pause
 * après ~1 semaine sans activité). Une simple requête suffit à remettre le
 * compteur d'inactivité à zéro.
 *
 * Sécurité : si la variable CRON_SECRET est définie, seuls les appels portant
 * l'en-tête « Authorization: Bearer <CRON_SECRET> » (envoyé automatiquement par
 * le planificateur Vercel) sont acceptés.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");

  if (secret && auth !== `Bearer ${secret}`) {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const users = await prisma.user.count();

  // Ménage quotidien : purge des tentatives de connexion de plus de 30 jours
  const purged = await prisma.loginAttempt.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
  });

  return NextResponse.json({ ok: true, users, purged: purged.count, at: new Date().toISOString() });
}
