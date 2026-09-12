import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { adminUpdateApplicationStatus } from "@/app/actions/admin";

type Search = { status?: string };

export default async function AdminApplicationsPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireRole("ADMIN", "CONSULTANT");
  const { status } = await searchParams;

  const applications = await prisma.application.findMany({
    where: status && Object.keys(APPLICATION_STATUS_LABELS).includes(status) ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      offer: { select: { id: true, title: true, company: { select: { name: true } } } },
      candidate: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
  });

  return (
    <>
      <DashboardTitle title="Candidatures" description="Suivi global des candidatures (§15.3)." />

      <form className="mb-4 flex gap-2" action="/admin/candidatures" method="get">
        <select name="status" defaultValue={status ?? ""} className="input w-auto">
          <option value="">Tous les statuts</option>
          {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-outline-navy btn-sm">Filtrer</button>
      </form>

      <div className="card">
        {applications.length === 0 ? (
          <EmptyState title="Aucune candidature" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th">Candidat</th>
                  <th className="th">Offre</th>
                  <th className="th">Entreprise</th>
                  <th className="th">Date</th>
                  <th className="th">CV</th>
                  <th className="th">Statut</th>
                  <th className="th">Changer</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100">
                    <td className="td font-medium text-ink">
                      {a.candidate.user.firstName} {a.candidate.user.lastName}
                    </td>
                    <td className="td">
                      <Link href={`/offres/${a.offer.id}`} className="text-navy hover:text-gold">{a.offer.title}</Link>
                    </td>
                    <td className="td text-ink-soft">{a.offer.company.name}</td>
                    <td className="td text-ink-soft">{formatDate(a.createdAt)}</td>
                    <td className="td">
                      {a.documentId ? (
                        <a href={`/api/documents/${a.documentId}`} target="_blank" className="text-navy underline hover:text-gold">CV</a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="td">
                      <Badge tone={a.status === "HIRED" ? "green" : a.status === "REJECTED" ? "red" : "amber"}>
                        {APPLICATION_STATUS_LABELS[a.status]}
                      </Badge>
                    </td>
                    <td className="td">
                      <form action={adminUpdateApplicationStatus} className="flex gap-2">
                        <input type="hidden" name="applicationId" value={a.id} />
                        <select name="status" defaultValue={a.status} className="input w-auto py-1.5 text-xs">
                          {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <button type="submit" className="btn btn-gold btn-sm">OK</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
