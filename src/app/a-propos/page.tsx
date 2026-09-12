import Link from "next/link";

import { SITE } from "@/lib/constants";

export const metadata = {
  title: "À propos",
  description: "Découvrez BK Dimension 3S Consulting : notre mission, nos valeurs et notre approche Savoir, Savoir-faire, Savoir-être.",
};

export default function AProposPage() {
  return (
    <>
      <section className="bg-navy-deep py-16 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accueil / À propos</p>
          <h1 className="mt-3 text-4xl font-semibold">Qui sommes-nous</h1>
          <p className="mt-3 max-w-xl text-white/75">
            Un cabinet de conseil basé à Ouagadougou, au service du capital humain des entreprises burkinabè.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-bk grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="eyebrow">Notre mission</p>
            <h2 className="section-title mt-2">Propulser vos projets grâce aux bonnes compétences</h2>
            <p className="mt-4 text-ink-soft">
              BK Dimension 3S Consulting accompagne les entreprises, institutions et organisations dans la gestion de
              leur capital humain. Du recrutement au conseil stratégique, en passant par la formation et le montage de
              dossiers, nous construisons avec vous des solutions durables et sur mesure.
            </p>
            <p className="mt-3 text-ink-soft">
              Basés à Ouagadougou, nous connaissons les réalités du marché de l&apos;emploi local et mettons cette
              expertise au service de la performance de nos clients.
            </p>
          </div>
          <aside className="card h-fit bg-cream">
            <p className="eyebrow">Informations légales</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold">RCCM</dt>
                <dd className="text-ink-soft">{SITE.rccm}</dd>
              </div>
              <div>
                <dt className="font-semibold">IFU</dt>
                <dd className="text-ink-soft">{SITE.ifu}</dd>
              </div>
              <div>
                <dt className="font-semibold">Siège social</dt>
                <dd className="text-ink-soft">{SITE.city}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="container-bk">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Notre identité</p>
            <h2 className="section-title mt-2 text-white">Les trois dimensions du « 3S »</h2>
            <p className="mt-3 text-white/75">
              Notre nom porte notre méthode : trois dimensions complémentaires qui structurent chacune de nos
              interventions.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["Savoir", "La connaissance théorique et technique des métiers, des secteurs et des réglementations qui encadrent la gestion des ressources humaines."],
              ["Savoir-faire", "Une méthodologie éprouvée pour le recrutement, la formation et l'accompagnement, adaptée à chaque contexte d'entreprise."],
              ["Savoir-être", "L'écoute, l'éthique et la relation de confiance qui font de chaque mission un véritable partenariat."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-white/15 bg-white/5 p-6">
                <h3 className="text-xl text-gold-light">{title}</h3>
                <p className="mt-3 text-sm text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="container-bk">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Nos valeurs</p>
            <h2 className="section-title mt-2">Ce qui guide chacune de nos missions</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Professionnalisme", "Une méthode rigoureuse et transparente à chaque étape."],
              ["Expertise", "Une équipe qui connaît finement le tissu économique local."],
              ["Engagement", "Un accompagnement dans la durée, au-delà de la simple mission."],
              ["Résultats", "Des solutions durables, mesurables et orientées performance."],
            ].map(([title, text]) => (
              <div key={title} className="card text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-display text-gold">✓</span>
                <h3 className="mt-3 text-navy">{title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="container-bk">
          <h2 className="section-title">Envie de travailler avec nous ?</h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            Parlons de votre prochain projet de recrutement, de formation ou d&apos;accompagnement RH.
          </p>
          <Link href="/contact" className="btn btn-gold mt-6">Prendre contact</Link>
        </div>
      </section>
    </>
  );
}
