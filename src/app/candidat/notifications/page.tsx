import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { DashboardTitle } from "@/components/dashboard-shell";
import { EmptyState } from "@/components/ui";
import { markAllNotificationsRead } from "@/app/actions/candidate";

export default async function NotificationsPage() {
  const user = await requireRole("CANDIDATE");
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <DashboardTitle
        title="Notifications"
        description={`${unread} notification${unread > 1 ? "s" : ""} non lue${unread > 1 ? "s" : ""}.`}
        action={
          unread > 0 ? (
            <form action={markAllNotificationsRead}>
              <button type="submit" className="btn btn-outline-navy btn-sm">Tout marquer comme lu</button>
            </form>
          ) : undefined
        }
      />
      <div className="card">
        {notifications.length === 0 ? (
          <EmptyState title="Aucune notification" description="Vous serez alerté ici en cas d'activité sur vos candidatures." />
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <li key={n.id} className={`py-4 ${n.read ? "" : "bg-gold/5"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    {n.body ? <p className="mt-0.5 text-sm text-ink-soft">{n.body}</p> : null}
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">{formatDateTime(n.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
