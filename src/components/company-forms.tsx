"use client";

import { useActionState } from "react";

import { updateCompany, saveOffer, type CompanyState } from "@/app/actions/company";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/ui";
import { CONTRACT_LABELS, EDUCATION_LEVELS, EXPERIENCE_LEVELS, SECTORS } from "@/lib/constants";
import type { ContractType } from "@prisma/client";

export type OfferFormData = {
  id?: string;
  title: string;
  sector: string | null;
  location: string | null;
  contractType: ContractType;
  experienceLevel: string | null;
  educationLevel: string | null;
  skills: string;
  missions: string | null;
  profile: string | null;
  conditions: string | null;
  salary: string | null;
  positions: number;
  deadline: string;
};

export function OfferForm({ data }: { data: OfferFormData }) {
  const [state, action] = useActionState<CompanyState, FormData>(saveOffer, null);

  return (
    <form action={action} className="space-y-6">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      {data.id ? <input type="hidden" name="offerId" value={data.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="label">Intitulé du poste *</label>
          <input id="title" name="title" required defaultValue={data.title} className="input" placeholder="ex. : Comptable confirmé" />
        </div>
        <div>
          <label htmlFor="contractType" className="label">Type de contrat *</label>
          <select id="contractType" name="contractType" required defaultValue={data.contractType} className="input">
            {Object.entries(CONTRACT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sector" className="label">Secteur d&apos;activité</label>
          <select id="sector" name="sector" defaultValue={data.sector ?? ""} className="input">
            <option value="">—</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="label">Localisation</label>
          <input id="location" name="location" defaultValue={data.location ?? ""} className="input" placeholder="ex. : Ouagadougou" />
        </div>
        <div>
          <label htmlFor="deadline" className="label">Date limite de candidature</label>
          <input id="deadline" name="deadline" type="date" defaultValue={data.deadline} className="input" />
        </div>
        <div>
          <label htmlFor="experienceLevel" className="label">Niveau d&apos;expérience</label>
          <select id="experienceLevel" name="experienceLevel" defaultValue={data.experienceLevel ?? ""} className="input">
            <option value="">—</option>
            {EXPERIENCE_LEVELS.map((e) => (
              <option key={e} value={e}>{e}</option>
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
          <label htmlFor="positions" className="label">Nombre de postes</label>
          <input id="positions" name="positions" type="number" min={1} max={100} defaultValue={data.positions} className="input" />
        </div>
        <div>
          <label htmlFor="salary" className="label">Rémunération (facultatif)</label>
          <input id="salary" name="salary" defaultValue={data.salary ?? ""} className="input" placeholder="ex. : 350 000 – 500 000 FCFA" />
        </div>
      </div>

      <div>
        <label htmlFor="skills" className="label">Compétences recherchées <span className="font-normal text-gray-400">(séparées par des virgules)</span></label>
        <input id="skills" name="skills" defaultValue={data.skills} className="input" placeholder="Comptabilité, Sage, Excel…" />
      </div>
      <div>
        <label htmlFor="missions" className="label">Missions &amp; responsabilités</label>
        <textarea id="missions" name="missions" rows={5} defaultValue={data.missions ?? ""} className="input" />
      </div>
      <div>
        <label htmlFor="profile" className="label">Profil recherché</label>
        <textarea id="profile" name="profile" rows={4} defaultValue={data.profile ?? ""} className="input" />
      </div>
      <div>
        <label htmlFor="conditions" className="label">Conditions éventuelles</label>
        <textarea id="conditions" name="conditions" rows={3} defaultValue={data.conditions ?? ""} className="input" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pendingLabel="Envoi…">Soumettre à validation BK3S</SubmitButton>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="draft" />
          Enregistrer comme brouillon
        </label>
      </div>
      <p className="text-xs text-gray-500">
        Toute offre est vérifiée par l&apos;équipe BK Dimension 3S Consulting avant publication (délai habituel : 24 à 48 h ouvrées).
      </p>
    </form>
  );
}

export function CompanyInfoForm({
  data,
}: {
  data: { name: string; sector: string; address: string | null; city: string | null; phone: string | null; email: string | null; website: string | null; description: string | null; hasLogo: boolean };
}) {
  const [state, action] = useActionState<CompanyState, FormData>(updateCompany, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Raison sociale *</label>
          <input id="name" name="name" required defaultValue={data.name} className="input" />
        </div>
        <div>
          <label htmlFor="sector" className="label">Secteur *</label>
          <select id="sector" name="sector" required defaultValue={data.sector} className="input">
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="address" className="label">Adresse</label>
          <input id="address" name="address" defaultValue={data.address ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="city" className="label">Ville</label>
          <input id="city" name="city" defaultValue={data.city ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Téléphone</label>
          <input id="phone" name="phone" defaultValue={data.phone ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="email" className="label">E-mail</label>
          <input id="email" name="email" type="email" defaultValue={data.email ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="website" className="label">Site web</label>
          <input id="website" name="website" type="url" defaultValue={data.website ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="logo" className="label">Logo <span className="font-normal text-gray-400">(image, 2 Mo max.{data.hasLogo ? " — un logo est déjà en place" : ""})</span></label>
          <input id="logo" name="logo" type="file" accept="image/*" className="input py-1.5" />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="label">Présentation</label>
        <textarea id="description" name="description" rows={4} defaultValue={data.description ?? ""} className="input" />
      </div>
      <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}
