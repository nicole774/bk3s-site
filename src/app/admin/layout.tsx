import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { DashboardShell } from "@/components/dashboard-shell";

type NavItem = { href: string; label: string; exact?: boolean; visibility?: "admin" | "commercial" };

// visibility "admin"      → visible uniquement par l'ADMIN
// visibility "commercial" → visible par ADMIN et CONSULTANT
// sans visibility         → visible par toute l'équipe (ADMIN, CONSULTANT, ÉDITEUR)
const NAV: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/utilisateurs", label: "Utilisateurs", visibility: "admin" },
  { href: "/admin/entreprises", label: "Entreprises", visibility: "commercial" },
  { href: "/admin/offres", label: "Offres", visibility: "commercial" },
  { href: "/admin/candidatures", label: "Candidatures", visibility: "commercial" },
  { href: "/admin/cvtheque", label: "CVthèque", visibility: "commercial" },
  { href: "/admin/formations", label: "Formations" },
  { href: "/admin/actualites", label: "Actualités" },
  { href: "/admin/devis", label: "Demandes de devis", visibility: "commercial" },
  { href: "/admin/messages", label: "Messages", visibility: "commercial" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const unread = await prisma.notification.count({ where: { userId: user.id, read: false } });

  const nav = NAV.filter((item) => {
    if (item.visibility === "admin") return user.role === "ADMIN";
    if (item.visibility === "commercial") return user.role === "ADMIN" || user.role === "CONSULTANT";
    return true;
  }).map(({ href, label }) => ({ href, label }));

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
