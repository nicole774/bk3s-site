import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { CalendarDays, MapPin, Timer } from "lucide-react";

export const metadata = {
  title: "Formations",
  description: "Catalogue des formations professionnelles de BK Dimension 3S Consulting : thèmes, calendrier, objectifs et inscriptions.",
};

export default async function FormationsPage() {
  const formations = await prisma.formation.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { startDate: "asc" },
  });

  return (
    <>
      <section className="bg-navy-deep py-16 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accueil / Formations</p>
          <h1 className="mt-3 text-4xl font-semibold">Nos formations</h1>
          <p className="mt-3 max-w-xl text-white/75">
            Renforcez vos compétences avec des formations pratiques, animées par des experts, adaptées au marché
            burkinabè.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-bk">
          {formations.length === 0 ? (
            <EmptyState
              title="Le catalogue est en cours de préparation"
              description="De nouvelles formations seront publiées très prochainement. Contactez-nous pour une formation sur mesure."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {formations.map((formation) => (
                <article key={formation.id} className="card flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    {formation.theme ? <Badge tone="gold">{formation.theme}</Badge> : <span />}
                    {formation.price ? <span className="font-display font-semibold text-navy">{formation.price}</span> : null}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-navy">{formation.title}</h2>
                  {formation.description ? <p className="mt-2 flex-1 text-sm text-ink-soft">{formation.description}</p> : null}
                  <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm text-ink-soft">
                    {formation.startDate ? (
                      <p className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-gold" /> {formatDate(formation.startDate)}</p>
                    ) : null}
                    {formation.duration ? (
                      <p className="inline-flex items-center gap-1.5"><Timer size={14} className="text-gold" /> {formation.duration}</p>
                    ) : null}
                    {formation.location ? (
                      <p className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-gold" /> {formation.location}</p>
                    ) : null}
                  </div>
                  <a href={`/contact?subject=${encodeURIComponent("Formation : " + formation.title)}`} className="btn btn-outline-navy btn-sm mt-4">
                    Demander l&apos;inscription
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
