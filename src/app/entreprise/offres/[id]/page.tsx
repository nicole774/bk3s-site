import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_LABELS as ALL_STATUS, CONTRACT_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { OfferForm } from "@/components/company-forms";
import { updateApplicationStatusByCompany } from "@/app/actions/company";

type Props = { params: Promise<{ id: string }> };

export default async function EditOfferPage({ params }: Props) {
  const user = await requireRole("COMPANY");
  const { id } = await params;

  const offer = await prisma.jobOffer.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
        include: {
          candidate: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
      },
    },
  });

  if (!offer || offer.companyId !== user.companyId) notFound();

  return (
    <>
      <DashboardTitle
        title={`Modifier : ${offer.title}`}
        description={`Réf. ${offer.reference} · ${CONTRACT_LABELS[offer.contractType]} · ${offer.applications.length} candidature(s)`}
        action={<Link href="/entreprise/offres" className="btn btn-outline-navy btn-sm">← Mes offres</Link>}
      />

      <div className="card">
        <OfferForm
          data={{
            id: offer.id,
            title: offer.title,
            sector: offer.sector,
            location: offer.location,
            contractType: offer.contractType,
            experienceLevel: offer.experienceLevel,
            educationLevel: offer.educationLevel,
            skills: offer.skills.join(", "),
            missions: offer.missions,
            profile: offer.profile,
            conditions: offer.conditions,
            salary: offer.salary,
            positions: offer.positions,
            deadline: offer.deadline ? offer.deadline.toISOString().slice(0, 10) : "",
          }}
        />
      </div>

      <div className="card mt-6">
        <p className="eyebrow">Candidatures reçues pour cette offre</p>
        {offer.applications.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Aucune candidature pour le moment.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th">Candidat</th>
                  <th className="th">Date</th>
                  <th className="th">CV</th>
                  <th className="th">Statut</th>
                  <th className="th">Changer le statut</th>
                </tr>
              </thead>
              <tbody>
                {offer.applications.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100">
                    <td className="td">
                      <p className="font-medium text-ink">
                        {a.candidate.user.firstName} {a.candidate.user.lastName}
                      </p>
                      <p className="text-xs text-ink-soft">{a.candidate.title ?? "Profil à compléter"}</p>
                    </td>
                    <td className="td text-ink-soft">{formatDate(a.createdAt)}</td>
                    <td className="td">
                      {a.documentId ? (
                        <a href={`/api/documents/${a.documentId}`} target="_blank" className="text-navy underline hover:text-gold">Voir le CV</a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="td"><Badge tone="amber">{APPLICATION_STATUS_LABELS[a.status]}</Badge></td>
                    <td className="td">
                      <form action={updateApplicationStatusByCompany} className="flex gap-2">
                        <input type="hidden" name="applicationId" value={a.id} />
                        <select name="status" defaultValue={a.status} className="input w-auto py-1.5 text-xs">
                          {Object.entries(ALL_STATUS).map(([value, label]) => (
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
