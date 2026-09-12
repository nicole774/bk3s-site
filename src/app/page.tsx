import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

import { prisma } from "@/lib/db";
import { SITE, SERVICES, RECRUITMENT_STEPS, CONTRACT_LABELS } from "@/lib/constants";
import { OfferCard } from "@/components/offer-card";

export default async function AccueilPage() {
  const [latestOffers, offerCount, candidateCount, companyCount] = await Promise.all([
    prisma.jobOffer.findMany({
      where: { status: "PUBLISHED", OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { company: { select: { name: true, logo: true, logoMime: true } } },
    }),
    prisma.jobOffer.count({ where: { status: "PUBLISHED" } }),
    prisma.candidateProfile.count(),
    prisma.company.count({ where: { status: "APPROVED" } }),
  ]);

  return (
    <>
      {/* Hero + moteur de recherche d'emploi (§6) */}
      <section className="bg-navy-deep text-white">
        <div className="container-bk grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow">{SITE.slogan}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              Des solutions RH sur mesure pour votre réussite
            </h1>
            <p className="mt-4 max-w-xl text-white/75">
              BK Dimension 3S Consulting vous accompagne avec professionnalisme, expertise et engagement pour répondre
              à vos besoins et propulser vos projets, à Ouagadougou et partout au Burkina Faso.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/offres" className="btn btn-gold">Rechercher une offre</Link>
              <Link href="/inscription" className="btn btn-outline">Déposer mon CV</Link>
              <Link href="/inscription-entreprise" className="btn btn-outline">Publier une offre</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-navy">Rechercher un emploi</h2>
            <form action="/offres" method="get" className="mt-4 space-y-3">
              <div>
                <label htmlFor="q" className="label">Mots-clés</label>
                <input id="q" name="q" className="input" placeholder="Poste, compétence, entreprise…" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="lieu" className="label">Localisation</label>
                  <input id="lieu" name="lieu" className="input" placeholder="Ouagadougou" />
                </div>
                <div>
                  <label htmlFor="contrat" className="label">Type de contrat</label>
                  <select id="contrat" name="contrat" className="input" defaultValue="">
                    <option value="">Tous</option>
                    {Object.entries(CONTRACT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-navy w-full">
                <Search size={16} /> Rechercher une offre
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bandeau 3S */}
      <div className="bg-gold text-navy-deep">
        <div className="container-bk flex flex-wrap items-center justify-center gap-x-10 gap-y-2 py-3 font-display text-sm font-semibold uppercase tracking-widest">
          {SITE.motto.map((m) => (
            <span key={m} className="flex items-center gap-2">
              <span className="inline-block h-2 w-6 rounded-full bg-navy-deep/80" /> {m}
            </span>
          ))}
        </div>
      </div>

      {/* Chiffres clés */}
      <section className="bg-cream">
        <div className="container-bk grid grid-cols-2 gap-6 py-10 text-center md:grid-cols-4">
          <div>
            <p className="font-display text-3xl font-semibold text-navy">{offerCount}</p>
            <p className="text-sm text-ink-soft">Offres en ligne</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-navy">{candidateCount}</p>
            <p className="text-sm text-ink-soft">Candidats dans le vivier</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-navy">{companyCount}</p>
            <p className="text-sm text-ink-soft">Entreprises partenaires</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-navy">8</p>
            <p className="text-sm text-ink-soft">Domaines d&apos;activité</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container-bk">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Nos activités</p>
            <h2 className="section-title mt-2">Un accompagnement complet, à chaque étape</h2>
            <p className="mt-3 text-ink-soft">
              Du recrutement à la gestion des ressources humaines, nous mettons notre expertise au service de la
              performance de votre organisation.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.slice(0, 4).map((service, i) => (
              <Link key={service.slug} href={`/services#${service.slug}`} className="card group transition-shadow hover:border-gold/60 hover:shadow-md">
                <span className="font-display text-sm font-semibold text-gold">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-navy">{service.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{service.short}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services" className="btn btn-outline-navy">Voir tous nos services</Link>
          </div>
        </div>
      </section>

      {/* Dernières offres */}
      <section className="bg-cream py-16">
        <div className="container-bk">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Recrutement</p>
            <h2 className="section-title mt-2">Les dernières offres d&apos;emploi</h2>
            <p className="mt-3 text-ink-soft">Postulez en ligne en quelques minutes depuis votre espace candidat.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
          {latestOffers.length === 0 ? (
            <p className="mt-8 text-center text-ink-soft">
              Aucune offre publiée pour le moment — revenez bientôt ou <Link href="/inscription" className="font-medium text-navy underline">déposez votre CV</Link>.
            </p>
          ) : (
            <div className="mt-8 text-center">
              <Link href="/offres" className="btn btn-outline-navy">Voir toutes les offres</Link>
            </div>
          )}
        </div>
      </section>

      {/* Approche 3S */}
      <section className="bg-navy py-16 text-white">
        <div className="container-bk grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Notre approche</p>
            <h2 className="section-title mt-2 text-white">Trois dimensions, une seule ambition : votre succès</h2>
            <p className="mt-4 text-white/75">
              Notre identité repose sur trois piliers indissociables : le <strong>Savoir</strong>, le{" "}
              <strong>Savoir-faire</strong> et le <strong>Savoir-être</strong>. C&apos;est cette approche à 360° qui nous
              permet de proposer des solutions réellement adaptées à chaque client.
            </p>
            <Link href="/a-propos" className="btn btn-outline mt-6">En savoir plus sur nous</Link>
          </div>
          <ul className="space-y-4">
            {[
              ["Professionnalisme", "Une méthode rigoureuse à chaque étape de nos missions."],
              ["Expertise", "Une connaissance fine du marché de l'emploi burkinabè."],
              ["Engagement", "Un partenaire présent sur la durée, pas seulement le temps d'une mission."],
              ["Résultats", "Des solutions durables, mesurables, pensées pour votre croissance."],
            ].map(([title, text]) => (
              <li key={title} className="rounded-lg border border-white/15 bg-white/5 p-5">
                <h3 className="text-gold-light">{title}</h3>
                <p className="mt-1 text-sm text-white/70">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Processus de recrutement (§33) */}
      <section className="py-16">
        <div className="container-bk">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Méthodologie</p>
            <h2 className="section-title mt-2">Notre processus de recrutement</h2>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {RECRUITMENT_STEPS.map((step, i) => (
              <li key={step} className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-navy font-display text-sm font-semibold text-gold-light">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm font-medium text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gold py-14 text-navy-deep">
        <div className="container-bk text-center">
          <Image src="/logo.jpeg" alt="" width={56} height={56} className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-navy-deep/30" />
          <h2 className="section-title mt-4">Prêt à propulser votre projet ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-deep/80">
            Parlons de vos besoins en recrutement, en formation ou en gestion des ressources humaines.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn bg-navy-deep text-white hover:bg-navy">Nous contacter</Link>
            <Link href="/devis" className="btn border border-navy-deep/50 text-navy-deep hover:bg-navy-deep hover:text-white">Demander un devis</Link>
          </div>
        </div>
      </section>
    </>
  );
}
