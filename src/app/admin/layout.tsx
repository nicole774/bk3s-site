import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { DashboardShell } from "@/components/dashboard-shell";

const NAV = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/utilisateurs", label: "Utilisateurs", adminOnly: true },
  { href: "/admin/entreprises", label: "Entreprises", adminOnly: true },
  { href: "/admin/offres", label: "Offres" },
  { href: "/admin/candidatures", label: "Candidatures" },
  { href: "/admin/cvtheque", label: "CVthèque" },
  { href: "/admin/formations", label: "Formations" },
  { href: "/admin/actualites", label: "Actualités" },
  { href: "/admin/devis", label: "Demandes de devis" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const unread = await prisma.notification.count({ where: { userId: user.id, read: false } });

  const nav = NAV.filter((item) => !("adminOnly" in item && item.adminOnly) || user.role === "ADMIN").map(({ href, label }) => ({ href, label }));

  return (
    <DashboardShell
      nav={nav}
      user={{ firstName: user.firstName, lastName: user.lastName, role: user.role }}
      badge={ROLE_LABELS[user.role]}
      unread={unread}
    >
      {children}
    </DashboardShell>
  );
}
