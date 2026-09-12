import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { AVAILABILITY_LABELS, SECTORS, EXPERIENCE_LEVELS } from "@/lib/constants";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { initials } from "@/lib/utils";
import type { Availability } from "@prisma/client";

type Search = { q?: string; ville?: string; secteur?: string; langue?: string; disponibilite?: string; experience?: string };

export default async function CvthequePage({ searchParams }: { searchParams: Promise<Search> }) {
  const user = await requireRole("COMPANY");
  const sp = await searchParams;

  const company = await prisma.company.findUnique({ where: { id: user.companyId! }, select: { status: true } });
  const approved = company?.status === "APPROVED";

  const where = {
    visibleInCvtheque: true,
    user: { status: "ACTIVE" as const },
    AND: [
      sp.q
        ? {
            OR: [
              { title: { contains: sp.q, mode: "insensitive" as const } },
              { summary: { contains: sp.q, mode: "insensitive" as const } },
              { skills: { has: sp.q } },
              { sector: { contains: sp.q, mode: "insensitive" as const } },
            ],
          }
        : {},
      sp.ville ? { city: { contains: sp.ville, mode: "insensitive" as const } } : {},
      sp.secteur ? { sector: { equals: sp.secteur } } : {},
      sp.langue ? { languages: { has: sp.langue } } : {},
      sp.disponibilite ? { availability: { equals: sp.disponibilite as Availability } } : {},
      sp.experience ? { experienceYears: { gte: parseInt(sp.experience, 10) || 0 } } : {},
    ],
  };

  const [profiles, total] = approved
    ? await Promise.all([
        prisma.candidateProfile.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          take: 30,
          include: { user: { select: { firstName: true, lastName: true } }, documents: { where: { type: "CV", isPrimary: true }, select: { id: true } } },
        }),
        prisma.candidateProfile.count({ where }),
      ])
    : [null, 0];

  return (
    <>
      <DashboardTitle
        title="CVthèque"
        description={`${total} profil${total > 1 ? "s" : ""} visible${total > 1 ? "s" : ""} — recherchez des talents selon vos critères (§10).`}
      />

      {!approved ? (
        <EmptyState
          title="Accès réservé aux entreprises validées"
          description="Votre compte doit être validé par BK Dimension 3S Consulting pour consulter la CVthèque."
        />
      ) : (
        <>
          <form action="/entreprise/cvtheque" method="get" className="card grid gap-3 sm:grid-cols-3">
            <input name="q" defaultValue={sp.q ?? ""} className="input sm:col-span-2" placeholder="Métier, compétence, mot-clé…" aria-label="Recherche" />
            <input name="ville" defaultValue={sp.ville ?? ""} className="input" placeholder="Ville" aria-label="Ville" />
            <select name="secteur" defaultValue={sp.secteur ?? ""} className="input" aria-label="Secteur">
              <option value="">Tous les domaines</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select name="disponibilite" defaultValue={sp.disponibilite ?? ""} className="input" aria-label="Disponibilité">
              <option value="">Toute disponibilité</option>
              {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select name="experience" defaultValue={sp.experience ?? ""} className="input" aria-label="Expérience minimale">
              <option value="">Expérience minimale</option>
              {EXPERIENCE_LEVELS.map((e, i) => (
                <option key={e} value={i === 0 ? 0 : i}>{i === 0 ? "Débutant accepté" : e}</option>
              ))}
            </select>
            <div className="flex gap-2 sm:col-span-3">
              <button type="submit" className="btn btn-navy">Rechercher</button>
              <Link href="/entreprise/cvtheque" className="btn btn-outline-navy">Réinitialiser</Link>
            </div>
          </form>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {profiles!.length === 0 ? (
              <div className="md:col-span-2">
                <EmptyState title="Aucun profil trouvé" description="Essayez d'élargir vos critères de recherche." />
              </div>
            ) : (
              profiles!.map((profile) => (
                <Link key={profile.id} href={`/entreprise/cvtheque/${profile.id}`} className="card flex items-start gap-4 transition-shadow hover:border-gold/60 hover:shadow-md">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy font-display font-semibold text-gold-light">
                    {initials(profile.user.firstName, profile.user.lastName)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-navy">{profile.title ?? "Profil en cours de complétion"}</p>
                    <p className="truncate text-sm text-ink-soft">{profile.summary ?? ""}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {profile.city ? <Badge tone="navy">{profile.city}</Badge> : null}
                      {profile.sector ? <Badge tone="gray">{profile.sector}</Badge> : null}
                      {profile.experienceYears > 0 ? <Badge tone="gray">{profile.experienceYears} an(s)</Badge> : null}
                      {profile.documents.length > 0 ? <Badge tone="gold">CV disponible</Badge> : null}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}
