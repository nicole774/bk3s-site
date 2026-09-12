import Link from "next/link";

import { prisma } from "@/lib/db";
import { CONTRACT_LABELS, SECTORS, EXPERIENCE_LEVELS } from "@/lib/constants";
import { OfferCard } from "@/components/offer-card";
import { EmptyState } from "@/components/ui";

export const metadata = {
  title: "Offres d'emploi",
  description: "Consultez les offres d'emploi publiées par BK Dimension 3S Consulting et ses entreprises partenaires au Burkina Faso.",
};

const PER_PAGE = 9;

type Search = {
  q?: string;
  lieu?: string;
  contrat?: string;
  secteur?: string;
  experience?: string;
  page?: string;
};

export default async function OffresPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const contratKeys = Object.keys(CONTRACT_LABELS) as Array<keyof typeof CONTRACT_LABELS>;
  const contractFilter = contratKeys.includes(sp.contrat as never) ? (sp.contrat as keyof typeof CONTRACT_LABELS) : null;

  const where = {
    status: "PUBLISHED" as const,
    OR: [{ deadline: null }, { deadline: { gte: new Date() } }],
    AND: [
      sp.q
        ? {
            OR: [
              { title: { contains: sp.q, mode: "insensitive" as const } },
              { sector: { contains: sp.q, mode: "insensitive" as const } },
              { location: { contains: sp.q, mode: "insensitive" as const } },
              { missions: { contains: sp.q, mode: "insensitive" as const } },
              { profile: { contains: sp.q, mode: "insensitive" as const } },
            ],
          }
        : {},
      sp.lieu ? { location: { contains: sp.lieu, mode: "insensitive" as const } } : {},
      contractFilter ? { contractType: contractFilter } : {},
      sp.secteur ? { sector: { equals: sp.secteur } } : {},
      sp.experience ? { experienceLevel: { equals: sp.experience } } : {},
    ],
  };

  const [offers, total] = await Promise.all([
    prisma.jobOffer.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      include: { company: { select: { name: true, logo: true, logoMime: true } } },
    }),
    prisma.jobOffer.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const buildQuery = (overrides: Partial<Search>) => {
    const merged: Record<string, string> = {};
    for (const [k, v] of Object.entries({ ...sp, ...overrides })) {
      if (v) merged[k] = String(v);
    }
    return `/offres?${new URLSearchParams(merged).toString()}`;
  };

  return (
    <>
      <section className="bg-navy-deep py-14 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accueil / Emploi</p>
          <h1 className="mt-3 text-4xl font-semibold">Offres d&apos;emploi</h1>
          <p className="mt-2 text-white/75">{total} offre{total > 1 ? "s" : ""} correspondant à votre recherche</p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-cream py-6">
        <form action="/offres" method="get" className="container-bk grid gap-3 md:grid-cols-5">
          <input name="q" defaultValue={sp.q ?? ""} className="input md:col-span-2" placeholder="Mots-clés (poste, compétence…)" aria-label="Mots-clés" />
          <input name="lieu" defaultValue={sp.lieu ?? ""} className="input" placeholder="Localisation" aria-label="Localisation" />
          <select name="contrat" defaultValue={sp.contrat ?? ""} className="input" aria-label="Type de contrat">
            <option value="">Tous les contrats</option>
            {contratKeys.map((key) => (
              <option key={key} value={key}>{CONTRACT_LABELS[key]}</option>
            ))}
          </select>
          <select name="secteur" defaultValue={sp.secteur ?? ""} className="input" aria-label="Secteur">
            <option value="">Tous les secteurs</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select name="experience" defaultValue={sp.experience ?? ""} className="input md:col-span-1" aria-label="Expérience">
            <option value="">Toute expérience</option>
            {EXPERIENCE_LEVELS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <div className="flex gap-3 md:col-span-4">
            <button type="submit" className="btn btn-navy">Rechercher</button>
            <Link href="/offres" className="btn btn-outline-navy">Réinitialiser</Link>
          </div>
        </form>
      </section>

      <section className="py-12">
        <div className="container-bk">
          {offers.length === 0 ? (
            <EmptyState
              title="Aucune offre ne correspond à votre recherche"
              description="Essayez d'élargir vos critères, ou déposez votre CV : les recruteurs consultent activement la CVthèque."
            >
              <Link href="/inscription" className="btn btn-gold">Déposer mon CV</Link>
            </EmptyState>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
              {page > 1 ? (
                <Link href={buildQuery({ page: String(page - 1) })} className="btn btn-outline-navy btn-sm">← Précédente</Link>
              ) : null}
              <span className="px-3 text-sm text-ink-soft">Page {page} sur {totalPages}</span>
              {page < totalPages ? (
                <Link href={buildQuery({ page: String(page + 1) })} className="btn btn-outline-navy btn-sm">Suivante →</Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </section>
    </>
  );
}
