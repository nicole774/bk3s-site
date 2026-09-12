import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { DashboardShell } from "@/components/dashboard-shell";

const NAV = [
  { href: "/entreprise", label: "Tableau de bord", exact: true },
  { href: "/entreprise/entreprise", label: "Mon entreprise" },
  { href: "/entreprise/offres", label: "Mes offres" },
  { href: "/entreprise/offres/nouvelle", label: "Publier une offre" },
  { href: "/entreprise/candidatures", label: "Candidatures" },
  { href: "/entreprise/cvtheque", label: "CVthèque" },
  { href: "/entreprise/notifications", label: "Notifications" },
];

export default async function EntrepriseLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("COMPANY");
  const [company, unread] = await Promise.all([
    prisma.company.findUnique({ where: { id: user.companyId! }, select: { name: true, status: true } }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ]);

  return (
    <>
      {company?.status === "PENDING" ? (
        <div className="bg-amber-100 px-4 py-3 text-center text-sm text-amber-900">
          Votre compte entreprise est en attente de validation par BK Dimension 3S Consulting. Vous ne pourrez publier
          d&apos;offres ni consulter la CVthèque qu&apos;après validation.
        </div>
      ) : null}
      {company?.status === "SUSPENDED" ? (
        <div className="bg-red-100 px-4 py-3 text-center text-sm text-red-800">
          Votre compte entreprise est suspendu. Contactez contact@bk3sconsulting.com.
        </div>
      ) : null}
      <DashboardShell
        nav={NAV}
        user={{ firstName: user.firstName, lastName: user.lastName, role: user.role }}
        badge={company?.name ?? ROLE_LABELS.COMPANY}
        unread={unread}
      >
        {children}
      </DashboardShell>
    </>
  );
}
