"use client";

import { useActionState } from "react";

import { createUser, saveFormation, saveArticle, type AdminState } from "@/app/actions/admin";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/ui";

export function CreateUserForm() {
  const [state, action] = useActionState<AdminState, FormData>(createUser, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <input name="firstName" required placeholder="Prénom" className="input" aria-label="Prénom" />
        <input name="lastName" required placeholder="Nom" className="input" aria-label="Nom" />
        <input name="email" type="email" required placeholder="E-mail" className="input" aria-label="E-mail" />
        <input name="password" type="password" required minLength={8} placeholder="Mot de passe (8 min.)" className="input" aria-label="Mot de passe" />
        <select name="role" required className="input" defaultValue="CONSULTANT" aria-label="Rôle">
          <option value="ADMIN">Administrateur</option>
          <option value="CONSULTANT">Consultant BK3S</option>
          <option value="EDITOR">Éditeur</option>
        </select>
      </div>
      <SubmitButton pendingLabel="Création…">Créer le compte</SubmitButton>
    </form>
  );
}

export type FormationFormData = {
  id?: string;
  title: string;
  theme: string | null;
  description: string | null;
  objectives: string | null;
  program: string | null;
  audience: string | null;
  trainer: string | null;
  duration: string | null;
  location: string | null;
  price: string | null;
  startDate: string;
  status: string;
};

export function FormationForm({ data }: { data: FormationFormData }) {
  const [state, action] = useActionState<AdminState, FormData>(saveFormation, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      {data.id ? <input type="hidden" name="id" value={data.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="label">Titre de la formation *</label>
          <input id="title" name="title" required defaultValue={data.title} className="input" />
        </div>
        <div>
          <label htmlFor="theme" className="label">Thème</label>
          <input id="theme" name="theme" defaultValue={data.theme ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="trainer" className="label">Formateur</label>
          <input id="trainer" name="trainer" defaultValue={data.trainer ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="startDate" className="label">Date</label>
          <input id="startDate" name="startDate" type="date" defaultValue={data.startDate} className="input" />
        </div>
        <div>
          <label htmlFor="duration" className="label">Durée</label>
          <input id="duration" name="duration" defaultValue={data.duration ?? ""} className="input" placeholder="ex. : 3 jours" />
        </div>
        <div>
          <label htmlFor="location" className="label">Lieu</label>
          <input id="location" name="location" defaultValue={data.location ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="price" className="label">Coût</label>
          <input id="price" name="price" defaultValue={data.price ?? ""} className="input" placeholder="ex. : 150 000 FCFA" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" name="description" rows={3} defaultValue={data.description ?? ""} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="objectives" className="label">Objectifs</label>
          <textarea id="objectives" name="objectives" rows={2} defaultValue={data.objectives ?? ""} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="program" className="label">Programme</label>
          <textarea id="program" name="program" rows={4} defaultValue={data.program ?? ""} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="audience" className="label">Public cible</label>
          <input id="audience" name="audience" defaultValue={data.audience ?? ""} className="input" />
        </div>
        <div>
          <label htmlFor="status" className="label">Statut</label>
          <select id="status" name="status" defaultValue={data.status} className="input">
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publiée</option>
            <option value="ARCHIVED">Archivée</option>
          </select>
        </div>
      </div>
      <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}

export type ArticleFormData = {
  id?: string;
  title: string;
  category: string | null;
  excerpt: string | null;
  content: string;
  status: string;
};

export function ArticleForm({ data }: { data: ArticleFormData }) {
  const [state, action] = useActionState<AdminState, FormData>(saveArticle, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      {data.id ? <input type="hidden" name="id" value={data.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="label">Titre *</label>
          <input id="title" name="title" required defaultValue={data.title} className="input" />
        </div>
        <div>
          <label htmlFor="category" className="label">Catégorie</label>
          <input id="category" name="category" defaultValue={data.category ?? ""} className="input" placeholder="Actualité, Conseil RH…" />
        </div>
      </div>
      <div>
        <label htmlFor="excerpt" className="label">Chapô / résumé</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={data.excerpt ?? ""} className="input" />
      </div>
      <div>
        <label htmlFor="content" className="label">Contenu *</label>
        <textarea id="content" name="content" rows={12} required defaultValue={data.content} className="input" />
      </div>
      <div>
        <label htmlFor="status" className="label">Statut</label>
        <select id="status" name="status" defaultValue={data.status} className="input w-auto">
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publié</option>
          <option value="ARCHIVED">Archivé</option>
        </select>
      </div>
      <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}
