import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS_LABELS, CONTRACT_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { WithdrawButton } from "@/components/candidate-forms";

export default async function CandidaturesPage() {
  const user = await requireRole("CANDIDATE");
  const applications = await prisma.application.findMany({
    where: { candidateId: user.candidateProfileId! },
    orderBy: { createdAt: "desc" },
    include: {
      offer: { include: { company: { select: { name: true } } } },
      document: { select: { filename: true } },
    },
  });

  return (
    <>
      <DashboardTitle title="Mes candidatures" description="Suivez l'état d'avancement de chaque candidature." />
      <div className="card">
        {applications.length === 0 ? (
          <EmptyState title="Aucune candidature" description="Postulez à une offre pour la voir apparaître ici.">
            <Link href="/offres" className="btn btn-gold">Voir les offres</Link>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th">Offre</th>
                  <th className="th">Entreprise</th>
                  <th className="th">CV utilisé</th>
                  <th className="th">Date</th>
                  <th className="th">Statut</th>
                  <th className="th">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => {
                  const closed = a.status === "CLOSED" || a.status === "REJECTED" || a.status === "HIRED";
                  return (
                    <tr key={a.id} className="border-b border-gray-100">
                      <td className="td">
                        <Link href={`/offres/${a.offer.id}`} className="font-medium text-navy hover:text-gold">{a.offer.title}</Link>
                        <span className="block text-xs text-gray-400">{CONTRACT_LABELS[a.offer.contractType]}</span>
                      </td>
                      <td className="td text-ink-soft">{a.offer.company.name}</td>
                      <td className="td text-xs text-ink-soft">{a.document?.filename ?? "—"}</td>
                      <td className="td text-ink-soft">{formatDate(a.createdAt)}</td>
                      <td className="td">
                        <Badge tone={a.status === "HIRED" ? "green" : a.status === "REJECTED" ? "red" : a.status === "CLOSED" ? "gray" : "amber"}>
                          {APPLICATION_STATUS_LABELS[a.status]}
                        </Badge>
                      </td>
                      <td className="td">{closed ? <span className="text-xs text-gray-400">—</span> : <WithdrawButton applicationId={a.id} />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
