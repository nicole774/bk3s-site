import Link from "next/link";

import { SERVICES } from "@/lib/constants";

export const metadata = {
  title: "Nos services",
  description: "Recrutement, placement, formation, conseil, montage de dossiers, événementiel, gestion des ressources humaines et prestations diverses.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-navy-deep py-16 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accueil / Nos services</p>
          <h1 className="mt-3 text-4xl font-semibold">Nos services</h1>
          <p className="mt-3 max-w-xl text-white/75">
            Huit domaines d&apos;intervention pour couvrir l&apos;ensemble de vos besoins en ressources humaines.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-bk grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <a key={service.slug} href={`#${service.slug}`} className="card transition-shadow hover:border-gold/60 hover:shadow-md">
              <span className="font-display text-sm font-semibold text-gold">0{i + 1}</span>
              <h2 className="mt-2 text-lg font-semibold text-navy">{service.name}</h2>
              <p className="mt-2 text-sm text-ink-soft">{service.short}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-cream py-4 pb-16">
        <div className="container-bk space-y-8">
          {SERVICES.map((service) => (
            <article key={service.slug} id={service.slug} className="card scroll-mt-28">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold text-navy">{service.name}</h2>
                <Link href={`/devis?service=${encodeURIComponent(service.name)}`} className="btn btn-gold btn-sm">
                  Demander un devis
                </Link>
              </div>
              <p className="mt-3 text-ink-soft">{service.short}</p>
              <div className="mt-5 grid gap-5 text-sm md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-navy">Objectifs</h3>
                  <p className="mt-1 text-ink-soft">{service.objectifs}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Bénéficiaires</h3>
                  <p className="mt-1 text-ink-soft">{service.beneficiaires}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Notre méthode</h3>
                  <p className="mt-1 text-ink-soft">{service.methode}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy">Livrables</h3>
                  <p className="mt-1 text-ink-soft">{service.livrables}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy py-14 text-center text-white">
        <div className="container-bk">
          <p className="eyebrow">Votre partenaire de confiance</p>
          <h2 className="section-title mt-2 text-white">Un besoin spécifique ?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/75">
            Décrivez-nous votre projet, nous vous proposons une solution adaptée.
          </p>
          <Link href="/devis" className="btn btn-gold mt-6">Demander un devis</Link>
        </div>
      </section>
    </>
  );
}
