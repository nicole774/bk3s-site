import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { deleteFormation } from "@/app/actions/admin";

const STATUS_TONES: Record<string, "gray" | "green" | "navy"> = { DRAFT: "gray", PUBLISHED: "green", ARCHIVED: "navy" };
const STATUS_LABELS: Record<string, string> = { DRAFT: "Brouillon", PUBLISHED: "Publiée", ARCHIVED: "Archivée" };

export default async function AdminFormationsPage() {
  await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const formations = await prisma.formation.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <DashboardTitle
        title="Formations"
        description="Gestion du catalogue des formations (§17)."
        action={<Link href="/admin/formations/nouvelle" className="btn btn-gold">Nouvelle formation</Link>}
      />
      <div className="card">
        {formations.length === 0 ? (
          <EmptyState title="Aucune formation" description="Créez la première formation du catalogue.">
            <Link href="/admin/formations/nouvelle" className="btn btn-gold">Nouvelle formation</Link>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-gray-100">
            {formations.map((formation) => (
              <li key={formation.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="flex items-center gap-2 font-medium text-ink">
                    {formation.title}
                    <Badge tone={STATUS_TONES[formation.status]}>{STATUS_LABELS[formation.status]}</Badge>
                  </p>
                  <p className="text-xs text-ink-soft">
                    {formation.startDate ? formatDate(formation.startDate) : "Date à définir"} {formation.location ? `· ${formation.location}` : ""} {formation.price ? `· ${formation.price}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/formations/${formation.id}`} className="btn btn-outline-navy btn-sm">Modifier</Link>
                  <form action={deleteFormation}>
                    <input type="hidden" name="id" value={formation.id} />
                    <button type="submit" className="btn btn-danger btn-sm">Supprimer</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
