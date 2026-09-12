import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { updateServiceRequestStatus } from "@/app/actions/admin";

const STATUS_LABELS: Record<string, string> = { NEW: "Nouvelle", IN_PROGRESS: "En cours", COMPLETED: "Traitée" };
const STATUS_TONES: Record<string, "amber" | "blue" | "green"> = { NEW: "amber", IN_PROGRESS: "blue", COMPLETED: "green" };

export default async function AdminDevisPage() {
  await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const requests = await prisma.serviceRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <DashboardTitle title="Demandes de devis" description="Demandes de prestation reçues (§19)." />
      {requests.length === 0 ? (
        <EmptyState title="Aucune demande de devis" description="Les demandes soumises via la page Devis apparaîtront ici." />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    {request.name}{request.organization ? ` — ${request.organization}` : ""}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {request.email} {request.phone ? `· ${request.phone}` : ""} · {formatDateTime(request.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={STATUS_TONES[request.status]}>{STATUS_LABELS[request.status]}</Badge>
                  <form action={updateServiceRequestStatus} className="flex gap-1">
                    <input type="hidden" name="id" value={request.id} />
                    <select name="status" defaultValue={request.status} className="input w-auto py-1 text-xs">
                      <option value="NEW">Nouvelle</option>
                      <option value="IN_PROGRESS">En cours</option>
                      <option value="COMPLETED">Traitée</option>
                    </select>
                    <button type="submit" className="btn btn-outline-navy btn-sm">OK</button>
                  </form>
                </div>
              </div>
              <p className="mt-3 text-sm"><strong className="text-navy">Prestation demandée :</strong> {request.service}{request.deadline ? ` · Délai : ${request.deadline}` : ""}</p>
              <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{request.description}</p>
              {request.attachmentData ? (
                <a href={`/api/attachments/${request.id}`} target="_blank" className="mt-3 inline-block text-sm font-medium text-navy underline hover:text-gold">
                  Pièce jointe : {request.attachmentName}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
