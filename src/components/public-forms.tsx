"use client";

import { useActionState } from "react";

import { sendContactMessage, submitServiceRequest, type PublicFormState } from "@/app/actions/public";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/ui";
import { SERVICES } from "@/lib/constants";

export function ContactForm() {
  const [state, action] = useActionState<PublicFormState, FormData>(sendContactMessage, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Nom complet *</label>
          <input id="name" name="name" required className="input" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Téléphone</label>
          <input id="phone" name="phone" type="tel" className="input" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="label">Adresse e-mail *</label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label htmlFor="subject" className="label">Sujet</label>
        <select id="subject" name="subject" className="input" defaultValue="">
          <option value="">Autre demande</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="label">Votre message *</label>
        <textarea id="message" name="message" rows={5} required className="input" />
      </div>
      <SubmitButton pendingLabel="Envoi…">Envoyer le message</SubmitButton>
    </form>
  );
}

export function DevisForm({ defaultService }: { defaultService?: string }) {
  const [state, action] = useActionState<PublicFormState, FormData>(submitServiceRequest, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Nom et prénom *</label>
          <input id="name" name="name" required className="input" />
        </div>
        <div>
          <label htmlFor="organization" className="label">Organisation</label>
          <input id="organization" name="organization" className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="label">Téléphone</label>
          <input id="phone" name="phone" type="tel" className="input" />
        </div>
        <div>
          <label htmlFor="email" className="label">Adresse e-mail *</label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className="label">Service demandé *</label>
          <select id="service" name="service" required className="input" defaultValue={defaultService ?? ""}>
            <option value="" disabled>Sélectionner…</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deadline" className="label">Délai souhaité</label>
          <input id="deadline" name="deadline" className="input" placeholder="ex. : sous 1 mois" />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="label">Description du besoin *</label>
        <textarea id="description" name="description" rows={5} required className="input" placeholder="Décrivez votre besoin : contexte, objectifs, ampleur…" />
      </div>
      <div>
        <label htmlFor="attachment" className="label">Pièce jointe éventuelle <span className="font-normal text-gray-400">(PDF ou Word, 5 Mo max.)</span></label>
        <input id="attachment" name="attachment" type="file" accept=".pdf,.doc,.docx" className="input py-1.5" />
      </div>
      <SubmitButton pendingLabel="Envoi…">Envoyer ma demande</SubmitButton>
    </form>
  );
}
