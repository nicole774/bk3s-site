import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { OFFER_STATUS_LABELS, CONTRACT_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { updateOfferStatusByCompany } from "@/app/actions/company";

const STATUS_TONES: Record<string, "gray" | "amber" | "green" | "red" | "blue" | "navy"> = {
  DRAFT: "gray",
  PENDING_REVIEW: "amber",
  PUBLISHED: "green",
  SUSPENDED: "red",
  CLOSED: "blue",
  ARCHIVED: "navy",
};

export default async function MesOffresPage() {
  const user = await requireRole("COMPANY");
  const offers = await prisma.jobOffer.findMany({
    where: { companyId: user.companyId! },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <>
      <DashboardTitle
        title="Mes offres"
        description="Créez, modifiez, suspendez ou clôturez vos offres."
        action={
          <Link href="/entreprise/offres/nouvelle" className="btn btn-gold">Publier une offre</Link>
        }
      />
      <div className="card">
        {offers.length === 0 ? (
          <EmptyState title="Aucune offre pour le moment" description="Publiez votre première offre d'emploi.">
            <Link href="/entreprise/offres/nouvelle" className="btn btn-gold">Publier une offre</Link>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th">Poste</th>
                  <th className="th">Référence</th>
                  <th className="th">Contrat</th>
                  <th className="th">Date limite</th>
                  <th className="th">Candidatures</th>
                  <th className="th">Statut</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="border-b border-gray-100">
                    <td className="td">
                      <Link href={`/entreprise/offres/${offer.id}`} className="font-medium text-navy hover:text-gold">{offer.title}</Link>
                      <span className="block text-xs text-gray-400">{offer.location ?? "—"}</span>
                    </td>
                    <td className="td text-xs text-ink-soft">{offer.reference}</td>
                    <td className="td text-ink-soft">{CONTRACT_LABELS[offer.contractType]}</td>
                    <td className="td text-ink-soft">{offer.deadline ? formatDate(offer.deadline) : "—"}</td>
                    <td className="td text-ink-soft">{offer._count.applications}</td>
                    <td className="td"><Badge tone={STATUS_TONES[offer.status]}>{OFFER_STATUS_LABELS[offer.status]}</Badge></td>
                    <td className="td">
                      <div className="flex flex-wrap gap-1.5">
                        {offer.status === "DRAFT" ? (
                          <form action={updateOfferStatusByCompany}>
                            <input type="hidden" name="offerId" value={offer.id} />
                            <input type="hidden" name="action" value="submit" />
                            <button type="submit" className="btn btn-gold btn-sm">Soumettre</button>
                          </form>
                        ) : null}
                        {offer.status === "SUSPENDED" ? (
                          <form action={updateOfferStatusByCompany}>
                            <input type="hidden" name="offerId" value={offer.id} />
                            <input type="hidden" name="action" value="reactivate" />
                            <button type="submit" className="btn btn-gold btn-sm">Réactiver</button>
                          </form>
                        ) : null}
                        {["PUBLISHED", "PENDING_REVIEW"].includes(offer.status) ? (
                          <>
                            <form action={updateOfferStatusByCompany}>
                              <input type="hidden" name="offerId" value={offer.id} />
                              <input type="hidden" name="action" value="suspend" />
                              <button type="submit" className="btn btn-outline-navy btn-sm">Suspendre</button>
                            </form>
                            <form action={updateOfferStatusByCompany}>
                              <input type="hidden" name="offerId" value={offer.id} />
                              <input type="hidden" name="action" value="close" />
                              <button type="submit" className="btn btn-danger btn-sm">Clôturer</button>
                            </form>
                          </>
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
