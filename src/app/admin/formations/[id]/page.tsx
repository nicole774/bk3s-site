import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DashboardTitle } from "@/components/dashboard-shell";
import { FormationForm } from "@/components/admin-forms";

type Props = { params: Promise<{ id: string }> };

export default async function AdminFormationEditPage({ params }: Props) {
  await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const { id } = await params;

  if (id === "nouvelle") {
    return (
      <>
        <DashboardTitle
          title="Nouvelle formation"
          action={<Link href="/admin/formations" className="btn btn-outline-navy btn-sm">← Formations</Link>}
        />
        <div className="card">
          <FormationForm
            data={{ title: "", theme: "", description: "", objectives: "", program: "", audience: "", trainer: "", duration: "", location: "", price: "", startDate: "", status: "DRAFT" }}
          />
        </div>
      </>
    );
  }

  const formation = await prisma.formation.findUnique({ where: { id } });
  if (!formation) notFound();

  return (
    <>
      <DashboardTitle
        title={`Modifier : ${formation.title}`}
        action={<Link href="/admin/formations" className="btn btn-outline-navy btn-sm">← Formations</Link>}
      />
      <div className="card">
        <FormationForm
          data={{
            id: formation.id,
            title: formation.title,
            theme: formation.theme,
            description: formation.description,
            objectives: formation.objectives,
            program: formation.program,
            audience: formation.audience,
            trainer: formation.trainer,
            duration: formation.duration,
            location: formation.location,
            price: formation.price,
            startDate: formation.startDate ? formation.startDate.toISOString().slice(0, 10) : "",
            status: formation.status,
          }}
        />
      </div>
    </>
  );
}
