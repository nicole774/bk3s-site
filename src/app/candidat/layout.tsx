import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { DashboardShell } from "@/components/dashboard-shell";

const NAV = [
  { href: "/candidat", label: "Tableau de bord", exact: true },
  { href: "/candidat/profil", label: "Mon profil" },
  { href: "/candidat/cv", label: "Mon CV" },
  { href: "/candidat/candidatures", label: "Mes candidatures" },
  { href: "/candidat/favoris", label: "Mes favoris" },
  { href: "/candidat/notifications", label: "Notifications" },
  { href: "/candidat/compte", label: "Mon compte" },
];

export default async function CandidatLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("CANDIDATE");
  const unread = await prisma.notification.count({ where: { userId: user.id, read: false } });

  return (
    <DashboardShell nav={NAV} user={{ firstName: user.firstName, lastName: user.lastName, role: user.role }} badge={ROLE_LABELS.CANDIDATE} unread={unread}>
      {children}
    </DashboardShell>
  );
}
