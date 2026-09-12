import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { AVAILABILITY_LABELS } from "@/lib/constants";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { initials } from "@/lib/utils";

type Search = { q?: string; ville?: string };

/** CVthèque administrateur : gestion du vivier (§15.3), y compris profils masqués. */
export default async function AdminCvthequePage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireRole("ADMIN", "CONSULTANT");
  const { q, ville } = await searchParams;

  const where = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { summary: { contains: q, mode: "insensitive" as const } },
              { skills: { has: q } },
            ],
          }
        : {},
      ville ? { city: { contains: ville, mode: "insensitive" as const } } : {},
    ],
  };

  const [profiles, visibleCount] = await Promise.all([
    prisma.candidateProfile.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 60,
      include: { user: { select: { firstName: true, lastName: true, status: true } } },
    }),
    prisma.candidateProfile.count({ where: { visibleInCvtheque: true } }),
  ]);

  return (
    <>
      <DashboardTitle
        title="CVthèque — vivier de talents"
        description={`${profiles.length} profil(s) affiché(s) · ${visibleCount} visible(s) dans la CVthèque publique.`}
      />

      <form className="card mb-6 grid gap-3 sm:grid-cols-3" action="/admin/cvtheque" method="get">
        <input name="q" defaultValue={q ?? ""} className="input sm:col-span-2" placeholder="Métier, compétence…" />
        <input name="ville" defaultValue={ville ?? ""} className="input" placeholder="Ville" />
        <div className="flex gap-2 sm:col-span-3">
          <button type="submit" className="btn btn-navy">Rechercher</button>
          <Link href="/admin/cvtheque" className="btn btn-outline-navy">Réinitialiser</Link>
        </div>
      </form>

      {profiles.length === 0 ? (
        <EmptyState title="Aucun profil trouvé" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {profiles.map((profile) => (
            <div key={profile.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display font-semibold text-gold-light">
                    {initials(profile.user.firstName, profile.user.lastName)}
                  </span>
                  <div>
                    <p className="font-medium text-navy">{profile.title ?? "Profil à compléter"}</p>
                    <p className="text-xs text-ink-soft">
                      {profile.user.firstName} {profile.user.lastName} · {profile.city ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {profile.visibleInCvtheque ? <Badge tone="gold">Visible</Badge> : <Badge tone="gray">Masqué</Badge>}
                  {profile.user.status !== "ACTIVE" ? <Badge tone="red">Compte suspendu</Badge> : null}
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{profile.summary ?? ""}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-full bg-cream px-2 py-0.5 text-xs text-ink-soft">{skill}</span>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">{AVAILABILITY_LABELS[profile.availability]} · {profile.experienceYears} an(s)</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
