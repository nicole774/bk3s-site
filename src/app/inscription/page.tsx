import Link from "next/link";

import { CandidateRegisterForm } from "@/components/auth-forms";

export const metadata = { title: "Créer un compte candidat" };

export default function InscriptionPage() {
  return (
    <div className="bg-cream">
      <div className="container-bk py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="eyebrow">Espace candidat</p>
            <h1 className="mt-2 text-3xl font-semibold">Créez votre compte candidat</h1>
            <p className="mt-2 text-sm text-ink-soft">
              Déposez votre CV, postulez aux offres et suivez vos candidatures. C&apos;est gratuit.
            </p>
          </div>
          <div className="card">
            <CandidateRegisterForm />
          </div>
          <p className="mt-6 text-center text-sm text-ink-soft">
            Vous êtes une entreprise ?{" "}
            <Link href="/inscription-entreprise" className="font-semibold text-navy hover:text-gold">
              Créer un compte recruteur
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
