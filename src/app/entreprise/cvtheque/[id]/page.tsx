import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { AVAILABILITY_LABELS } from "@/lib/constants";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";

type Props = { params: Promise<{ id: string }> };

/** Fiche candidat de la CVthèque — informations pro uniquement (§10.2). */
export default async function CvthequeProfilePage({ params }: Props) {
  const user = await requireRole("COMPANY");
  const { id } = await params;

  const company = await prisma.company.findUnique({ where: { id: user.companyId! }, select: { status: true } });
  if (company?.status !== "APPROVED") notFound();

  const profile = await prisma.candidateProfile.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true } },
      documents: { where: { type: "CV" }, orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }], select: { id: true, filename: true, isPrimary: true, createdAt: true } },
    },
  });

  if (!profile || !profile.visibleInCvtheque) notFound();

  const experiences = (profile.experiences as Array<Record<string, string>> | null) ?? [];
  const educations = (profile.educations as Array<Record<string, string>> | null) ?? [];

  return (
    <>
      <DashboardTitle
        title={profile.title ?? "Profil candidat"}
        description={`${profile.user.firstName} ${profile.user.lastName.charAt(0)}. · ${profile.city ?? "Localisation non précisée"}`}
        action={<Link href="/entreprise/cvtheque" className="btn btn-outline-navy btn-sm">← CVthèque</Link>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {profile.summary ? (
            <div className="card">
              <p className="eyebrow">Résumé professionnel</p>
              <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{profile.summary}</p>
            </div>
          ) : null}

          {profile.skills.length > 0 ? (
            <div className="card">
              <p className="eyebrow">Compétences</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-sm text-navy">{skill}</span>
                ))}
              </div>
            </div>
          ) : null}

          {experiences.length > 0 ? (
            <div className="card">
              <p className="eyebrow">Expériences professionnelles</p>
              <ul className="mt-3 space-y-4">
                {experiences.map((e, i) => (
                  <li key={i} className="border-l-2 border-gold/50 pl-4">
                    <p className="font-medium text-ink">{e.poste || "—"}</p>
                    <p className="text-xs text-ink-soft">{[e.entreprise, e.periode].filter(Boolean).join(" · ")}</p>
                    {e.description ? <p className="mt-1 text-sm text-ink-soft">{e.description}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {educations.length > 0 ? (
            <div className="card">
              <p className="eyebrow">Formations &amp; diplômes</p>
              <ul className="mt-3 space-y-2">
                {educations.map((e, i) => (
                  <li key={i} className="text-sm text-ink-soft">
                    <strong className="text-ink">{e.diplome || "—"}</strong>
                    {e.etablissement ? ` — ${e.etablissement}` : ""}
                    {e.annee ? ` (${e.annee})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="card">
            <p className="eyebrow">En bref</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-soft">Expérience</dt>
                <dd className="font-medium">{profile.experienceYears} an(s)</dd>
              </div>
              {profile.educationLevel ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-soft">Formation</dt>
                  <dd className="font-medium text-right">{profile.educationLevel}</dd>
                </div>
              ) : null}
              {profile.sector ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-soft">Domaine</dt>
                  <dd className="font-medium text-right">{profile.sector}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-2">
                <dt className="text-ink-soft">Disponibilité</dt>
                <dd className="font-medium text-right">{AVAILABILITY_LABELS[profile.availability]}</dd>
              </div>
              {profile.languages.length > 0 ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-soft">Langues</dt>
                  <dd className="font-medium text-right">{profile.languages.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="card">
            <p className="eyebrow">CV</p>
            {profile.documents.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {profile.documents.map((doc) => (
                  <li key={doc.id}>
                    <a href={`/api/documents/${doc.id}`} target="_blank" className="flex items-center justify-between gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-navy hover:border-gold/60">
                      <span className="truncate">{doc.filename}</span>
                      {doc.isPrimary ? <Badge tone="gold">Principal</Badge> : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Aucun CV déposé" />
            )}
            <p className="mt-3 text-xs text-gray-400">
              Ce candidat a autorisé la consultation de son profil dans la CVthèque. Ses coordonnées directes ne sont
              pas publiées ; pour le contacter, passez par BK Dimension 3S Consulting.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
