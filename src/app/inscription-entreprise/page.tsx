import Link from "next/link";

import { CompanyRegisterForm } from "@/components/auth-forms";

export const metadata = { title: "Créer un compte entreprise" };

export default function InscriptionEntreprisePage() {
  return (
    <div className="bg-cream">
      <div className="container-bk py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="eyebrow">Espace entreprise</p>
            <h1 className="mt-2 text-3xl font-semibold">Créez votre compte recruteur</h1>
            <p className="mt-2 text-sm text-ink-soft">
              Publiez vos offres, gérez vos candidatures et accédez à la CVthèque. Votre compte est vérifié par notre équipe.
            </p>
          </div>
          <div className="card">
            <CompanyRegisterForm />
          </div>
          <p className="mt-6 text-center text-sm text-ink-soft">
            Vous êtes un candidat ?{" "}
            <Link href="/inscription" className="font-semibold text-navy hover:text-gold">
              Créer un compte candidat
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
