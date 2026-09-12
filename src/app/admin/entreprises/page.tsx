import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { COMPANY_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { moderateCompany } from "@/app/actions/admin";

type Search = { status?: string };

const STATUS_TONES: Record<string, "amber" | "green" | "red"> = { PENDING: "amber", APPROVED: "green", SUSPENDED: "red" };

export default async function AdminCompaniesPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireRole("ADMIN", "CONSULTANT");
  const { status } = await searchParams;

  const companies = await prisma.company.findMany({
    where: status && Object.keys(COMPANY_STATUS_LABELS).includes(status) ? { status: status as never } : {},
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { firstName: true, lastName: true, email: true } }, _count: { select: { offers: true } } },
  });

  return (
    <>
      <DashboardTitle title="Entreprises" description="Validation, suspension et historique (§15.4)." />

      <form className="mb-4 flex gap-2" action="/admin/entreprises" method="get">
        <select name="status" defaultValue={status ?? ""} className="input w-auto">
          <option value="">Tous les statuts</option>
          {Object.entries(COMPANY_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-outline-navy btn-sm">Filtrer</button>
      </form>

      <div className="card">
        {companies.length === 0 ? (
          <EmptyState title="Aucune entreprise" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th">Entreprise</th>
                  <th className="th">Responsable</th>
                  <th className="th">Offres</th>
                  <th className="th">Inscrite le</th>
                  <th className="th">Statut</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b border-gray-100">
                    <td className="td">
                      <p className="font-medium text-ink">{company.name}</p>
                      <p className="text-xs text-ink-soft">{company.sector}{company.city ? ` · ${company.city}` : ""}</p>
                    </td>
                    <td className="td">
                      <p className="text-ink">{company.owner.firstName} {company.owner.lastName}</p>
                      <p className="text-xs text-ink-soft">{company.owner.email}</p>
                    </td>
                    <td className="td text-ink-soft">{company._count.offers}</td>
                    <td className="td text-ink-soft">{formatDate(company.createdAt)}</td>
                    <td className="td"><Badge tone={STATUS_TONES[company.status]}>{COMPANY_STATUS_LABELS[company.status]}</Badge></td>
                    <td className="td">
                      <div className="flex flex-wrap gap-1.5">
                        {company.status !== "APPROVED" ? (
                          <form action={moderateCompany}>
                            <input type="hidden" name="companyId" value={company.id} />
                            <input type="hidden" name="action" value="approve" />
                            <button type="submit" className="btn btn-gold btn-sm">Valider</button>
                          </form>
                        ) : (
                          <form action={moderateCompany}>
                            <input type="hidden" name="companyId" value={company.id} />
                            <input type="hidden" name="action" value="suspend" />
                            <button type="submit" className="btn btn-danger btn-sm">Suspendre</button>
                          </form>
                        )}
                      </div>
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
