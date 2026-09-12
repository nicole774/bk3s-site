import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS_LABELS, CONTRACT_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, StatCard, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { OfferCard } from "@/components/offer-card";

export default async function CandidatDashboard() {
  const user = await requireRole("CANDIDATE");
  const profileId = user.candidateProfileId!;

  const [profile, applications, favorites, latestNotifications] = await Promise.all([
    prisma.candidateProfile.findUnique({ where: { id: profileId } }),
    prisma.application.findMany({
      where: { candidateId: profileId },
      orderBy: { createdAt: "desc" },
      include: { offer: { include: { company: { select: { name: true, logo: true, logoMime: true } } } } },
    }),
    prisma.favorite.count({ where: { candidateId: profileId } }),
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  const open = applications.filter((a) => !["REJECTED", "CLOSED", "HIRED"].includes(a.status)).length;
  const closed = applications.length - open;

  // Complétude du profil (§12)
  const checks = [
    Boolean(profile?.title),
    Boolean(profile?.summary),
    (profile?.skills.length ?? 0) > 0,
    (profile?.languages.length ?? 0) > 0,
    Boolean(profile?.city),
    (profile?.experiences as unknown[] | null)?.length,
    (profile?.educations as unknown[] | null)?.length,
    (await prisma.document.count({ where: { candidateId: profileId, type: "CV" } })) > 0,
  ];
  const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  // Recommandations d'offres (§12) : compétences ou secteur du profil
  const appliedOfferIds = applications.map((a) => a.offerId);
  const recommended = await prisma.jobOffer.findMany({
    where: {
      status: "PUBLISHED",
      OR: [{ deadline: null }, { deadline: { gte: new Date() } }],
      id: { notIn: appliedOfferIds },
      ...(profile?.skills.length || profile?.sector
        ? {
            OR: [
              ...(profile.skills.length ? [{ skills: { hasSome: profile.skills.slice(0, 10) } }] : []),
              ...(profile.sector ? [{ sector: { equals: profile.sector } }] : []),
            ],
          }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { company: { select: { name: true, logo: true, logoMime: true } } },
  });

  const cvCount = await prisma.document.count({ where: { candidateId: profileId, type: "CV" } });

  return (
    <>
      <DashboardTitle title={`Bonjour ${user.firstName} 👋`} description="Voici l&apos;état de votre espace candidat." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Candidatures envoyées" value={applications.length} />
        <StatCard label="En cours" value={open} />
        <StatCard label="Clôturées" value={closed} />
        <StatCard label="Offres favorites" value={favorites} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <p className="eyebrow">Profil</p>
          <p className="mt-2 text-sm text-ink-soft">Profil complété à</p>
          <div className="mt-1 flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${completeness}%` }} />
            </div>
            <span className="font-display text-xl font-semibold text-navy">{completeness}%</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/candidat/profil" className="btn btn-outline-navy btn-sm">Compléter mon profil</Link>
            <Link href="/candidat/cv" className="btn btn-gold btn-sm">{cvCount > 0 ? "Gérer mon CV" : "Déposer mon CV"}</Link>
          </div>
          {profile?.visibleInCvtheque ? (
            <p className="mt-3 text-xs text-emerald-700">✓ Votre profil est visible dans la CVthèque par les recruteurs validés.</p>
          ) : (
            <p className="mt-3 text-xs text-amber-700">Votre profil est masqué dans la CVthèque. Activez la visibilité depuis « Mon profil » pour être repéré.</p>
          )}
        </div>

        <div className="card">
          <p className="eyebrow">Dernières notifications</p>
          {latestNotifications.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">Aucune notification pour le moment.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {latestNotifications.map((n) => (
                <li key={n.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  {n.body ? <p className="text-xs text-ink-soft">{n.body}</p> : null}
                </li>
              ))}
            </ul>
          )}
          <Link href="/candidat/notifications" className="mt-3 inline-block text-sm font-medium text-navy hover:text-gold">Tout voir →</Link>
        </div>
      </div>

      <div className="card mt-6">
        <p className="eyebrow">Mes candidatures récentes</p>
        {applications.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Aucune candidature pour l'instant" description="Parcourez les offres et postulez en un clic.">
              <Link href="/offres" className="btn btn-gold">Voir les offres d&apos;emploi</Link>
            </EmptyState>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th">Offre</th>
                  <th className="th">Entreprise</th>
                  <th className="th">Date</th>
                  <th className="th">Statut</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((a) => (
                  <tr key={a.id} className="border-b border-gray-100">
                    <td className="td">
                      <Link href={`/offres/${a.offer.id}`} className="font-medium text-navy hover:text-gold">{a.offer.title}</Link>
                      <span className="block text-xs text-gray-400">{CONTRACT_LABELS[a.offer.contractType]}</span>
                    </td>
                    <td className="td text-ink-soft">{a.offer.company.name}</td>
                    <td className="td text-ink-soft">{formatDate(a.createdAt)}</td>
                    <td className="td">
                      <Badge tone={a.status === "HIRED" ? "green" : a.status === "REJECTED" ? "red" : a.status === "CLOSED" ? "gray" : "amber"}>
                        {APPLICATION_STATUS_LABELS[a.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/candidat/candidatures" className="mt-3 inline-block text-sm font-medium text-navy hover:text-gold">Toutes mes candidatures →</Link>
          </div>
        )}
      </div>

      {recommended.length > 0 ? (
        <div className="mt-6">
          <p className="eyebrow mb-3">Offres recommandées pour votre profil</p>
          <div className="grid gap-4 md:grid-cols-3">
            {recommended.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
