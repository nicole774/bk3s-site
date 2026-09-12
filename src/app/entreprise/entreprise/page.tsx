import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DashboardTitle } from "@/components/dashboard-shell";
import { CompanyInfoForm } from "@/components/company-forms";

export default async function MonEntreprisePage() {
  const user = await requireRole("COMPANY");
  const company = await prisma.company.findUnique({ where: { id: user.companyId! } });

  if (!company) return <p>Entreprise introuvable.</p>;

  return (
    <>
      <DashboardTitle title="Mon entreprise" description="Renseignez les informations de votre organisation (§13)." />
      <div className="card">
        <CompanyInfoForm
          data={{
            name: company.name,
            sector: company.sector,
            address: company.address,
            city: company.city,
            phone: company.phone,
            email: company.email,
            website: company.website,
            description: company.description,
            hasLogo: Boolean(company.logo),
          }}
        />
      </div>
    </>
  );
}
