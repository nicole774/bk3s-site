import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { OFFER_STATUS_LABELS, CONTRACT_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { moderateOffer } from "@/app/actions/admin";

type Search = { status?: string; q?: string };

const STATUS_TONES: Record<string, "gray" | "amber" | "green" | "red" | "blue" | "navy"> = {
  DRAFT: "gray",
  PENDING_REVIEW: "amber",
  PUBLISHED: "green",
  SUSPENDED: "red",
  CLOSED: "blue",
  ARCHIVED: "navy",
};

export default async function AdminOffersPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireRole("ADMIN", "CONSULTANT");
  const { status, q } = await searchParams;

  const offers = await prisma.jobOffer.findMany({
    where: {
      ...(status && Object.keys(OFFER_STATUS_LABELS).includes(status) ? { status: status as never } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { reference: { contains: q, mode: "insensitive" } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { company: { select: { name: true } }, _count: { select: { applications: true } } },
  });

  return (
    <>
      <DashboardTitle title="Offres d'emploi" description="Validation, suspension et clôture des offres (§15.2)." />

      <form className="mb-4 flex flex-wrap gap-2" action="/admin/offres" method="get">
        <input name="q" defaultValue={q ?? ""} className="input w-auto flex-1" placeholder="Titre ou référence…" />
        <select name="status" defaultValue={status ?? ""} className="input w-auto">
          <option value="">Tous les statuts</option>
          {Object.entries(OFFER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-outline-navy btn-sm">Filtrer</button>
      </form>

      <div className="card">
        {offers.length === 0 ? (
          <EmptyState title="Aucune offre trouvée" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th">Offre</th>
                  <th className="th">Entreprise</th>
                  <th className="th">Contrat</th>
                  <th className="th">Publiée le</th>
                  <th className="th">Candid.</th>
                  <th className="th">Statut</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="border-b border-gray-100">
                    <td className="td">
                      <Link href={`/offres/${offer.id}`} className="font-medium text-navy hover:text-gold">{offer.title}</Link>
                      <span className="block text-xs text-gray-400">{offer.reference}</span>
                    </td>
                    <td className="td text-ink-soft">{offer.company.name}</td>
                    <td className="td text-ink-soft">{CONTRACT_LABELS[offer.contractType]}</td>
                    <td className="td text-ink-soft">{offer.publishedAt ? formatDate(offer.publishedAt) : "—"}</td>
                    <td className="td text-ink-soft">{offer._count.applications}</td>
                    <td className="td"><Badge tone={STATUS_TONES[offer.status]}>{OFFER_STATUS_LABELS[offer.status]}</Badge></td>
                    <td className="td">
                      <div className="flex flex-wrap gap-1.5">
                        {offer.status === "PENDING_REVIEW" ? (
                          <>
                            <form action={moderateOffer}>
                              <input type="hidden" name="offerId" value={offer.id} />
                              <input type="hidden" name="action" value="publish" />
                              <button type="submit" className="btn btn-gold btn-sm">Valider &amp; publier</button>
                            </form>
                            <form action={moderateOffer}>
                              <input type="hidden" name="offerId" value={offer.id} />
                              <input type="hidden" name="action" value="reject" />
                              <button type="submit" className="btn btn-outline-navy btn-sm">Renvoyer</button>
                            </form>
                          </>
                        ) : null}
                        {offer.status === "PUBLISHED" ? (
                          <>
                            <form action={moderateOffer}>
                              <input type="hidden" name="offerId" value={offer.id} />
                              <input type="hidden" name="action" value="suspend" />
                              <button type="submit" className="btn btn-outline-navy btn-sm">Suspendre</button>
                            </form>
                            <form action={moderateOffer}>
                              <input type="hidden" name="offerId" value={offer.id} />
                              <input type="hidden" name="action" value="close" />
                              <button type="submit" className="btn btn-danger btn-sm">Clôturer</button>
                            </form>
                          </>
                        ) : null}
                        {!["ARCHIVED"].includes(offer.status) ? (
                          <form action={moderateOffer}>
                            <input type="hidden" name="offerId" value={offer.id} />
                            <input type="hidden" name="action" value="archive" />
                            <button type="submit" className="btn btn-outline-navy btn-sm">Archiver</button>
                          </form>
                        ) : null}
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
