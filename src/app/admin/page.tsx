import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { StatCard } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";

export default async function AdminDashboard() {
  await requireRole("ADMIN", "CONSULTANT", "EDITOR");

  const [users, candidates, companies, offers, publishedOffers, applications, cvtheque, pendingOffers, pendingCompanies, newRequests, newMessages, audit] =
    await Promise.all([
      prisma.user.count(),
      prisma.candidateProfile.count(),
      prisma.company.count(),
      prisma.jobOffer.count(),
      prisma.jobOffer.count({ where: { status: "PUBLISHED" } }),
      prisma.application.count(),
      prisma.candidateProfile.count({ where: { visibleInCvtheque: true } }),
      prisma.jobOffer.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.company.count({ where: { status: "PENDING" } }),
      prisma.serviceRequest.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count({ where: { handled: false } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: { select: { firstName: true, lastName: true } } } }),
    ]);

  return (
    <>
      <DashboardTitle title="Tableau de bord" description="Indicateurs clés de la plateforme (§24)." />

      {(pendingOffers > 0 || pendingCompanies > 0) ? (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          À traiter :{" "}
          {pendingOffers > 0 ? (
            <Link href="/admin/offres?status=PENDING_REVIEW" className="font-semibold underline">{pendingOffers} offre(s) à valider</Link>
          ) : null}
          {pendingOffers > 0 && pendingCompanies > 0 ? " · " : null}
          {pendingCompanies > 0 ? (
            <Link href="/admin/entreprises?status=PENDING" className="font-semibold underline">{pendingCompanies} entreprise(s) à valider</Link>
          ) : null}
        </div>
      ) : null}

      <p className="eyebrow mb-3">Recrutement</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Offres totales" value={offers} hint={`${publishedOffers} publiées`} />
        <StatCard label="Candidatures" value={applications} />
        <StatCard label="Candidats inscrits" value={candidates} />
        <StatCard label="Entreprises" value={companies} />
      </div>

      <p className="eyebrow mb-3 mt-6">CVthèque</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Profils visibles" value={cvtheque} hint={`sur ${candidates} profils`} />
        <StatCard label="Utilisateurs" value={users} />
        <StatCard label="Demandes de devis" value={newRequests} hint="non traitées" />
        <StatCard label="Messages contact" value={newMessages} hint="non traités" />
      </div>

      <div className="card mt-6">
        <p className="eyebrow">Dernières opérations (journal d&apos;audit)</p>
        {audit.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Aucune opération journalisée.</p>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100 text-sm">
            {audit.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <span>
                  <strong className="text-ink">{entry.action}</strong>
                  {entry.entity ? <span className="text-ink-soft"> · {entry.entity}</span> : null}
                  {entry.user ? <span className="text-ink-soft"> — {entry.user.firstName} {entry.user.lastName}</span> : null}
                </span>
                <span className="text-xs text-gray-400">{formatDateTime(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
