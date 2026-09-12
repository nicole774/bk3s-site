import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, GraduationCap, Clock, Eye, Hash } from "lucide-react";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CONTRACT_LABELS } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { ApplyForm, FavoriteButton } from "@/components/apply-form";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const offer = await prisma.jobOffer.findUnique({ where: { id }, select: { title: true, location: true } });
  if (!offer) return { title: "Offre introuvable" };
  return {
    title: `${offer.title}${offer.location ? ` — ${offer.location}` : ""}`,
    description: `Postulez en ligne : ${offer.title}${offer.location ? ` à ${offer.location}` : ""} via BK Dimension 3S Consulting.`,
  };
}

export default async function OffreDetailPage({ params }: Props) {
  const { id } = await params;
  const offer = await prisma.jobOffer.findUnique({
    where: { id },
    include: { company: { select: { id: true, name: true, sector: true, city: true, logo: true, logoMime: true } } },
  });

  const user = await getCurrentUser();
  const isTeam = user && ["ADMIN", "CONSULTANT", "EDITOR"].includes(user.role);
  const isOwner = user?.role === "COMPANY" && offer?.company && user.companyId === offer.company.id;

  if (!offer || (offer.status !== "PUBLISHED" && !isTeam && !isOwner)) notFound();

  await prisma.jobOffer.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  const expired = offer.deadline ? offer.deadline < new Date() : false;

  // État spécifique au candidat connecté
  let myApplication = null;
  let isFavorite = false;
  let documents: Array<{ id: string; filename: string; size: number; isPrimary: boolean }> = [];
  if (user?.role === "CANDIDATE" && user.candidateProfileId) {
    [myApplication, isFavorite, documents] = await Promise.all([
      prisma.application.findUnique({
        where: { candidateId_offerId: { candidateId: user.candidateProfileId, offerId: id } },
      }),
      prisma.favorite.findUnique({
        where: { candidateId_offerId: { candidateId: user.candidateProfileId, offerId: id } },
      }).then((f) => Boolean(f)),
      prisma.document.findMany({
        where: { candidateId: user.candidateProfileId },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
        select: { id: true, filename: true, size: true, isPrimary: true },
      }),
    ]);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: offer.title,
    description: offer.missions ?? offer.title,
    datePosted: offer.publishedAt?.toISOString(),
    validThrough: offer.deadline?.toISOString(),
    employmentType: offer.contractType,
    hiringOrganization: { "@type": "Organization", name: offer.company.name },
    jobLocation: offer.location
      ? { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: offer.location, addressCountry: "BF" } }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-navy-deep py-14 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            <Link href="/offres" className="hover:text-gold-light">Offres d&apos;emploi</Link> / Détail
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">{offer.title}</h1>
              <p className="mt-2 text-lg text-gold-light">{offer.company.name}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
                {offer.location ? <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {offer.location}</span> : null}
                <span className="inline-flex items-center gap-1.5"><Briefcase size={15} /> {CONTRACT_LABELS[offer.contractType]}</span>
                {offer.sector ? <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {offer.sector}</span> : null}
                <span className="inline-flex items-center gap-1.5"><Eye size={15} /> {offer.views + 1} vues</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge tone={expired ? "red" : "green"}>{expired ? "Date limite dépassée" : "Candidatures ouvertes"}</Badge>
              {offer.deadline ? (
                <span className="text-sm text-white/70">Date limite : <strong className="text-white">{formatDate(offer.deadline)}</strong></span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-bk grid gap-10 lg:grid-cols-[1fr_360px]">
          <article className="space-y-8">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-sm text-ink-soft">
                <Hash size={14} className="text-gold" /> Réf. {offer.reference}
              </span>
              {offer.educationLevel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-sm text-ink-soft">
                  <GraduationCap size={14} className="text-gold" /> {offer.educationLevel}
                </span>
              ) : null}
              {offer.experienceLevel ? (
                <span className="rounded-full bg-cream px-3 py-1 text-sm text-ink-soft">{offer.experienceLevel}</span>
              ) : null}
              {offer.positions > 1 ? (
                <span className="rounded-full bg-cream px-3 py-1 text-sm text-ink-soft">{offer.positions} postes</span>
              ) : null}
            </div>

            {offer.skills.length > 0 ? (
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">Compétences recherchées</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {offer.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-sm text-navy">{skill}</span>
                  ))}
                </div>
              </div>
            ) : null}

            {offer.missions ? (
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">Missions &amp; responsabilités</h2>
                <p className="mt-3 whitespace-pre-line text-ink-soft">{offer.missions}</p>
              </div>
            ) : null}

            {offer.profile ? (
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">Profil recherché</h2>
                <p className="mt-3 whitespace-pre-line text-ink-soft">{offer.profile}</p>
              </div>
            ) : null}

            {offer.conditions ? (
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">Conditions</h2>
                <p className="mt-3 whitespace-pre-line text-ink-soft">{offer.conditions}</p>
              </div>
            ) : null}

            {offer.salary ? (
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">Rémunération</h2>
                <p className="mt-3 text-ink-soft">{offer.salary}</p>
              </div>
            ) : null}

            {/* Bloc candidature */}
            <div className="card bg-cream" id="postuler">
              <h2 className="font-display text-xl font-semibold text-navy">Candidater à cette offre</h2>
              <div className="mt-4">
                {!user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-ink-soft">
                      Créez votre compte candidat ou connectez-vous pour postuler en quelques minutes.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/connexion?next=/offres/${offer.id}`} className="btn btn-navy">Se connecter</Link>
                      <Link href="/inscription" className="btn btn-gold">Créer mon compte candidat</Link>
                    </div>
                  </div>
                ) : user.role === "CANDIDATE" ? myApplication ? (
                  <p className="text-sm text-emerald-700">
                    Vous avez candidaté à cette offre le {formatDate(myApplication.createdAt)}. Statut :{" "}
                    <strong>en cours de traitement</strong>. Suivez-la depuis{" "}
                    <Link href="/candidat/candidatures" className="underline">vos candidatures</Link>.
                  </p>
                ) : expired ? (
                  <p className="text-sm text-red-600">La date limite de candidature est dépassée.</p>
                ) : (
                  <ApplyForm offerId={offer.id} documents={documents} />
                ) : (
                  <p className="text-sm text-ink-soft">
                    Cette espace de candidature est réservé aux candidats.
                  </p>
                )}
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="card text-center">
              {offer.company.logo ? (
                <Image
                  src={`/api/companies/${offer.company.id}/logo`}
                  alt={`Logo ${offer.company.name}`}
                  width={80}
                  height={80}
                  unoptimized
                  className="mx-auto h-20 w-20 rounded-lg object-contain"
                />
              ) : (
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-lg bg-navy font-display text-2xl font-semibold text-gold-light">
                  {offer.company.name.charAt(0)}
                </span>
              )}
              <h3 className="mt-3 text-lg font-semibold text-navy">{offer.company.name}</h3>
              {offer.company.sector ? <p className="text-sm text-ink-soft">{offer.company.sector}</p> : null}
              {offer.company.city ? <p className="text-sm text-ink-soft">{offer.company.city}</p> : null}
            </div>

            <div className="card">
              <p className="eyebrow">Récapitulatif</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-soft">Référence</dt>
                  <dd className="font-medium">{offer.reference}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-soft">Contrat</dt>
                  <dd className="font-medium">{CONTRACT_LABELS[offer.contractType]}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-soft">Publiée le</dt>
                  <dd className="font-medium">{formatDate(offer.publishedAt)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-soft">Date limite</dt>
                  <dd className={cn("font-medium", expired && "text-red-600")}>{offer.deadline ? formatDate(offer.deadline) : "—"}</dd>
                </div>
              </dl>
              {user?.role === "CANDIDATE" && !myApplication && !expired ? (
                <div className="mt-4">
                  <FavoriteButton offerId={offer.id} isFavorite={isFavorite} />
                </div>
              ) : null}
            </div>

            <div className="card bg-navy text-white">
              <p className="eyebrow">Recrutement par BK3S</p>
              <p className="mt-2 text-sm text-white/80">
                Cette offre est gérée par BK Dimension 3S Consulting. Les candidatures sont traitées avec
                confidentialité et professionnalisme.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
