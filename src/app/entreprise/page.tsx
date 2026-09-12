import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, StatCard, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";

export default async function EntrepriseDashboard() {
  const user = await requireRole("COMPANY");
  const companyId = user.companyId!;

  const [offers, applications, counts, recent] = await Promise.all([
    prisma.jobOffer.findMany({ where: { companyId }, select: { status: true } }),
    prisma.application.findMany({ where: { offer: { companyId } }, select: { status: true } }),
    prisma.company.findUnique({ where: { id: companyId }, select: { name: true, status: true } }),
    prisma.application.findMany({
      where: { offer: { companyId } },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        offer: { select: { id: true, title: true } },
        candidate: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    }),
  ]);

  const activeOffers = offers.filter((o) => o.status === "PUBLISHED").length;
  const closedOffers = offers.filter((o) => ["CLOSED", "ARCHIVED"].includes(o.status)).length;
  const shortlisted = applications.filter((a) => ["SHORTLISTED", "INTERVIEW"].includes(a.status)).length;
  const hired = applications.filter((a) => a.status === "HIRED").length;

  return (
    <>
      <DashboardTitle
        title="Tableau de bord entreprise"
        description="Vue d'ensemble de vos recrutements."
        action={
          counts?.status === "APPROVED" ? (
            <Link href="/entreprise/offres/nouvelle" className="btn btn-gold">Publier une offre</Link>
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Offres actives" value={activeOffers} />
        <StatCard label="Offres clôturées" value={closedOffers} />
        <StatCard label="Candidatures reçues" value={applications.length} />
        <StatCard label="Présélection / entretiens" value={shortlisted} />
        <StatCard label="Recrutements réalisés" value={hired} />
      </div>

      <div className="card mt-6">
        <p className="eyebrow">Dernières candidatures</p>
        {recent.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Aucune candidature pour l'instant" description="Publiez une offre pour recevoir des candidatures." />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100">
            {recent.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {a.candidate.user.firstName} {a.candidate.user.lastName}
                  </p>
                  <p className="text-xs text-ink-soft">
                    <Link href={`/entreprise/offres/${a.offer.id}`} className="hover:text-navy">{a.offer.title}</Link> · {formatDate(a.createdAt)}
                  </p>
                </div>
                <Badge tone={a.status === "HIRED" ? "green" : a.status === "REJECTED" ? "red" : "amber"}>
                  {APPLICATION_STATUS_LABELS[a.status]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
        <Link href="/entreprise/candidatures" className="mt-3 inline-block text-sm font-medium text-navy hover:text-gold">Toutes les candidatures →</Link>
      </div>
    </>
  );
}
