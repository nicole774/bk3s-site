import { requireRole } from "@/lib/auth";
import { DashboardTitle } from "@/components/dashboard-shell";
import { OfferForm } from "@/components/company-forms";
import { EmptyState } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function NouvelleOffrePage() {
  const user = await requireRole("COMPANY");
  const company = await prisma.company.findUnique({ where: { id: user.companyId! }, select: { status: true } });

  return (
    <>
      <DashboardTitle title="Publier une offre" description="Décrivez le poste à pourvoir (§7.1)." />
      {company?.status !== "APPROVED" ? (
        <EmptyState
          title="Publication indisponible"
          description="Votre compte entreprise doit être validé par BK Dimension 3S Consulting avant de publier des offres."
        />
      ) : (
        <div className="card">
          <OfferForm
            data={{
              title: "",
              sector: "",
              location: "",
              contractType: "CDI",
              experienceLevel: "",
              educationLevel: "",
              skills: "",
              missions: "",
              profile: "",
              conditions: "",
              salary: "",
              positions: 1,
              deadline: "",
            }}
          />
        </div>
      )}
    </>
  );
}
