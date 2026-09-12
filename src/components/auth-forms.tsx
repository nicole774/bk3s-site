"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { login, registerCandidate, registerCompany, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/ui";
import { SECTORS } from "@/lib/constants";

export function LoginForm() {
  const [state, action] = useActionState<AuthState, FormData>(login, null);
  const params = useSearchParams();
  const next = params.get("next") ?? "";

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="label">Adresse e-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" placeholder="vous@exemple.com" />
      </div>
      <div>
        <label htmlFor="password" className="label">Mot de passe</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" placeholder="••••••••" />
      </div>
      <SubmitButton className="btn-gold w-full" pendingLabel="Connexion…">Se connecter</SubmitButton>
      <p className="text-center text-xs text-gray-500">
        <Link href="/politique-confidentialite" className="hover:text-navy">Politique de confidentialité</Link>
      </p>
    </form>
  );
}

export function CandidateRegisterForm() {
  const [state, action] = useActionState<AuthState, FormData>(registerCandidate, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="label">Prénom *</label>
          <input id="firstName" name="firstName" required className="input" />
        </div>
        <div>
          <label htmlFor="lastName" className="label">Nom *</label>
          <input id="lastName" name="lastName" required className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">Adresse e-mail *</label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Téléphone</label>
          <input id="phone" name="phone" type="tel" className="input" placeholder="(226) 70 00 00 00" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="label">Ville</label>
          <input id="city" name="city" className="input" placeholder="Ouagadougou" />
        </div>
        <div>
          <label htmlFor="country" className="label">Pays</label>
          <input id="country" name="country" className="input" defaultValue="Burkina Faso" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="label">Mot de passe * <span className="font-normal text-gray-400">(8 caractères min.)</span></label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
        </div>
        <div>
          <label htmlFor="confirm" className="label">Confirmer le mot de passe *</label>
          <input id="confirm" name="confirm" type="password" required autoComplete="new-password" className="input" />
        </div>
      </div>
      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="terms" className="mt-1" />
        <span>
          J&apos;accepte les{" "}
          <Link href="/politique-confidentialite" className="font-medium text-navy underline" target="_blank">
            conditions d&apos;utilisation et la politique de confidentialité
          </Link>{" "}
          *
        </span>
      </label>
      <SubmitButton className="btn-gold w-full" pendingLabel="Création du compte…">Créer mon compte candidat</SubmitButton>
    </form>
  );
}

export function CompanyRegisterForm() {
  const [state, action] = useActionState<AuthState, FormData>(registerCompany, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}

      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wider text-navy">Votre entreprise</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">Raison sociale *</label>
            <input id="name" name="name" required className="input" />
          </div>
          <div>
            <label htmlFor="sector" className="label">Secteur d&apos;activité *</label>
            <select id="sector" name="sector" required className="input" defaultValue="">
              <option value="" disabled>Sélectionner…</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="label">Ville</label>
            <input id="city" name="city" className="input" placeholder="Ouagadougou" />
          </div>
          <div>
            <label htmlFor="website" className="label">Site web</label>
            <input id="website" name="website" type="url" className="input" placeholder="https://…" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="label">Présentation de l&apos;entreprise</label>
          <textarea id="description" name="description" rows={3} className="input" />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-t border-gray-200 pt-4">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wider text-navy">Personne responsable</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="label">Prénom *</label>
            <input id="firstName" name="firstName" required className="input" />
          </div>
          <div>
            <label htmlFor="lastName" className="label">Nom *</label>
            <input id="lastName" name="lastName" required className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label">E-mail professionnel *</label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label htmlFor="phone" className="label">Téléphone</label>
            <input id="phone" name="phone" type="tel" className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="label">Mot de passe * <span className="font-normal text-gray-400">(8 caractères min.)</span></label>
            <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
          </div>
          <div>
            <label htmlFor="confirm" className="label">Confirmer le mot de passe *</label>
            <input id="confirm" name="confirm" type="password" required autoComplete="new-password" className="input" />
          </div>
        </div>
      </fieldset>

      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="terms" className="mt-1" />
        <span>
          J&apos;accepte les{" "}
          <Link href="/politique-confidentialite" className="font-medium text-navy underline" target="_blank">
            conditions d&apos;utilisation et la politique de confidentialité
          </Link>{" "}
          *
        </span>
      </label>
      <p className="text-xs text-gray-500">
        Après inscription, votre compte entreprise est vérifié par BK Dimension 3S Consulting avant publication de vos offres.
      </p>
      <SubmitButton className="btn-gold w-full" pendingLabel="Création du compte…">Créer mon compte entreprise</SubmitButton>
    </form>
  );
}
