"use client";

import { useActionState } from "react";

import {
  updateCandidateProfile,
  uploadDocument,
  deleteDocument,
  setPrimaryDocument,
  withdrawApplication,
  deleteMyAccount,
  changePassword,
  type ProfileState,
} from "@/app/actions/candidate";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/ui";
import { AVAILABILITY_LABELS, EDUCATION_LEVELS, SECTORS } from "@/lib/constants";
import { Availability } from "@prisma/client";

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  phone: string | null;
  title: string | null;
  summary: string | null;
  skills: string;
  languages: string;
  educationLevel: string | null;
  sector: string | null;
  city: string | null;
  country: string | null;
  experienceYears: number;
  availability: Availability;
  visibleInCvtheque: boolean;
  experiencesText: string;
  educationsText: string;
};

export function ProfileForm({ data }: { data: ProfileFormData }) {
  const [state, action] = useActionState<ProfileState, FormData>(updateCandidateProfile, null);

  return (
    <form action={action} className="space-y-8">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}

      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wider text-navy">Informations personnelles</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="firstName" className="label">Prénom</label>
            <input id="firstName" name="firstName" defaultValue={data.firstName} className="input" />
          </div>
          <div>
            <label htmlFor="lastName" className="label">Nom</label>
            <input id="lastName" name="lastName" defaultValue={data.lastName} className="input" />
          </div>
          <div>
            <label htmlFor="phone" className="label">Téléphone</label>
            <input id="phone" name="phone" defaultValue={data.phone ?? ""} className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="label">Ville</label>
            <input id="city" name="city" defaultValue={data.city ?? ""} className="input" />
          </div>
          <div>
            <label htmlFor="country" className="label">Pays</label>
            <input id="country" name="country" defaultValue={data.country ?? "Burkina Faso"} className="input" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-t border-gray-200 pt-6">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wider text-navy">Profil professionnel</legend>
        <div>
          <label htmlFor="title" className="label">Titre professionnel</label>
          <input id="title" name="title" defaultValue={data.title ?? ""} className="input" placeholder="ex. : Comptable senior, Développeur web…" />
        </div>
        <div>
          <label htmlFor="summary" className="label">Résumé professionnel</label>
          <textarea id="summary" name="summary" rows={3} defaultValue={data.summary ?? ""} className="input" placeholder="Quelques lignes qui résument votre parcours et vos atouts." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="skills" className="label">Compétences <span className="font-normal text-gray-400">(séparées par des virgules)</span></label>
            <input id="skills" name="skills" defaultValue={data.skills} className="input" placeholder="Comptabilité, SAP, reporting…" />
          </div>
          <div>
            <label htmlFor="languages" className="label">Langues <span className="font-normal text-gray-400">(séparées par des virgules)</span></label>
            <input id="languages" name="languages" defaultValue={data.languages} className="input" placeholder="Français, Anglais…" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="sector" className="label">Domaine d&apos;expertise</label>
            <select id="sector" name="sector" defaultValue={data.sector ?? ""} className="input">
              <option value="">—</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="educationLevel" className="label">Niveau de formation</label>
            <select id="educationLevel" name="educationLevel" defaultValue={data.educationLevel ?? ""} className="input">
              <option value="">—</option>
              {EDUCATION_LEVELS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="experienceYears" className="label">Années d&apos;expérience</label>
            <input id="experienceYears" name="experienceYears" type="number" min={0} max={60} defaultValue={data.experienceYears} className="input" />
          </div>
        </div>
        <div>
          <label htmlFor="availability" className="label">Disponibilité</label>
          <select id="availability" name="availability" defaultValue={data.availability} className="input">
            {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="experiences" className="label">
            Expériences professionnelles{" "}
            <span className="font-normal text-gray-400">(une par ligne : Poste | Entreprise | Période | Description)</span>
          </label>
          <textarea
            id="experiences"
            name="experiences"
            rows={4}
            defaultValue={data.experiencesText}
            className="input"
            placeholder={"Comptable | ABC SARL | 2021-2024 | Tenue de la comptabilité générale"}
          />
        </div>
        <div>
          <label htmlFor="educations" className="label">
            Formations &amp; diplômes{" "}
            <span className="font-normal text-gray-400">(une par ligne : Diplôme | Établissement | Année)</span>
          </label>
          <textarea
            id="educations"
            name="educations"
            rows={3}
            defaultValue={data.educationsText}
            className="input"
            placeholder={"Master Comptabilité | Université de Ouagadougou | 2020"}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-3 border-t border-gray-200 pt-6">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wider text-navy">Confidentialité (§9)</legend>
        <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-cream/60 p-4 text-sm">
          <input type="checkbox" name="visibleInCvtheque" defaultChecked={data.visibleInCvtheque} className="mt-1" />
          <span>
            <strong>Rendre mon profil visible dans la CVthèque.</strong>
            <span className="mt-1 block text-ink-soft">
              Les recruteurs validés par BK3S pourront consulter votre profil professionnel et votre CV. Vos
              coordonnées personnelles (e-mail, téléphone) ne sont jamais affichées. Vous pouvez retirer cette
              autorisation à tout moment.
            </span>
          </span>
        </label>
      </fieldset>

      <SubmitButton pendingLabel="Enregistrement…">Enregistrer mon profil</SubmitButton>
    </form>
  );
}

export function CvUploadForm() {
  const [state, action] = useActionState<ProfileState, FormData>(uploadDocument, null);

  return (
    <form action={action} className="space-y-3">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <input type="file" name="file" required accept=".pdf,.doc,.docx" className="input py-1.5" aria-label="Fichier" />
        <select name="type" className="input" defaultValue="CV" aria-label="Type de document">
          <option value="CV">CV</option>
          <option value="MOTIVATION">Lettre de motivation</option>
          <option value="CERTIFICATE">Certificat / diplôme</option>
          <option value="OTHER">Autre document</option>
        </select>
      </div>
      <SubmitButton pendingLabel="Dépôt…">Déposer le document</SubmitButton>
      <p className="text-xs text-gray-500">PDF ou Word, 5 Mo maximum.</p>
    </form>
  );
}

export function DocumentActions({ documentId }: { documentId: string }) {
  const [, removeAction] = useActionState<ProfileState, FormData>(deleteDocument, null);
  const [, primaryAction] = useActionState<ProfileState, FormData>(setPrimaryDocument, null);

  return (
    <div className="flex flex-wrap gap-2">
      <a href={`/api/documents/${documentId}`} className="btn btn-outline-navy btn-sm">Télécharger</a>
      <form action={primaryAction}>
        <input type="hidden" name="documentId" value={documentId} />
        <SubmitButton className="btn btn-gold btn-sm" pendingLabel="…">Définir principal</SubmitButton>
      </form>
      <form action={removeAction}>
        <input type="hidden" name="documentId" value={documentId} />
        <SubmitButton className="btn btn-danger btn-sm" pendingLabel="…">Supprimer</SubmitButton>
      </form>
    </div>
  );
}

export function WithdrawButton({ applicationId }: { applicationId: string }) {
  const [, action] = useActionState<ProfileState, FormData>(withdrawApplication, null);
  return (
    <form action={action}>
      <input type="hidden" name="applicationId" value={applicationId} />
      <SubmitButton className="btn btn-danger btn-sm" pendingLabel="…">Retirer</SubmitButton>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action] = useActionState<ProfileState, FormData>(changePassword, null);
  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      <div>
        <label htmlFor="current" className="label">Mot de passe actuel</label>
        <input id="current" name="current" type="password" required autoComplete="current-password" className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="next" className="label">Nouveau mot de passe</label>
          <input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </div>
        <div>
          <label htmlFor="confirm" className="label">Confirmer</label>
          <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </div>
      </div>
      <SubmitButton pendingLabel="Modification…">Changer mon mot de passe</SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action] = useActionState<ProfileState, FormData>(deleteMyAccount, null);
  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      <p className="text-sm text-ink-soft">
        La suppression de votre compte entraîne la suppression définitive de votre profil, de vos CV et de vos
        candidatures. Cette action est irréversible.
      </p>
      <div>
        <label htmlFor="password" className="label">Confirmez avec votre mot de passe</label>
        <input id="password" name="password" type="password" required className="input" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="confirm" required />
        Je comprends que cette action est définitive.
      </label>
      <SubmitButton className="btn-danger" pendingLabel="Suppression…">Supprimer définitivement mon compte</SubmitButton>
    </form>
  );
}
