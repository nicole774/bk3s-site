import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { toggleMessageHandled } from "@/app/actions/admin";

export default async function AdminMessagesPage() {
  await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <DashboardTitle title="Messages de contact" description="Messages reçus via le formulaire de contact." />
      {messages.length === 0 ? (
        <EmptyState title="Aucun message" />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`card ${message.handled ? "opacity-70" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{message.name} {message.subject ? <span className="text-ink-soft">— {message.subject}</span> : null}</p>
                  <p className="text-xs text-ink-soft">
                    {message.email} {message.phone ? `· ${message.phone}` : ""} · {formatDateTime(message.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={message.handled ? "green" : "amber"}>{message.handled ? "Traité" : "À traiter"}</Badge>
                  <form action={toggleMessageHandled}>
                    <input type="hidden" name="id" value={message.id} />
                    <input type="hidden" name="handled" value={String(message.handled)} />
                    <button type="submit" className="btn btn-outline-navy btn-sm">
                      {message.handled ? "Rouvrir" : "Marquer traité"}
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-ink-soft">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
