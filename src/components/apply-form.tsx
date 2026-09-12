"use client";

import { useActionState } from "react";
import Link from "next/link";

import { applyToOffer, toggleFavorite, type ApplyState } from "@/app/actions/offers";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/ui";
import { formatFileSize } from "@/lib/utils";

type Doc = { id: string; filename: string; size: number; isPrimary: boolean };

export function ApplyForm({ offerId, documents }: { offerId: string; documents: Doc[] }) {
  const [state, action] = useActionState<ApplyState, FormData>(applyToOffer, null);
  const primary = documents.find((d) => d.isPrimary) ?? documents[0];

  if (documents.length === 0) {
    return (
      <Alert tone="amber">
        Vous devez d&apos;abord déposer un CV pour postuler.{" "}
        <Link href="/candidat/cv" className="font-semibold underline">Déposer mon CV</Link>
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error ? <Alert>{state.error}</Alert> : null}
      {state?.success ? <Alert tone="green">{state.success}</Alert> : null}
      <input type="hidden" name="offerId" value={offerId} />
      <div>
        <span className="label">CV à transmettre *</span>
        <div className="space-y-2">
          {documents.map((doc) => (
            <label key={doc.id} className="flex items-center gap-3 rounded-md border border-gray-200 px-3 py-2 text-sm hover:border-navy/40">
              <input type="radio" name="documentId" value={doc.id} defaultChecked={doc.id === primary.id} required />
              <span className="font-medium">{doc.filename}</span>
              <span className="text-gray-400">({formatFileSize(doc.size)})</span>
              {doc.isPrimary ? <span className="ml-auto text-xs text-gold">CV principal</span> : null}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Gérez vos CV depuis <Link href="/candidat/cv" className="underline">Mon CV</Link>.
        </p>
      </div>
      <div>
        <label htmlFor="coverLetter" className="label">Lettre de motivation (facultatif)</label>
        <textarea id="coverLetter" name="coverLetter" rows={5} className="input" placeholder="Quelques mots sur votre motivation pour ce poste…" />
      </div>
      <SubmitButton pendingLabel="Envoi de la candidature…">Postuler à cette offre</SubmitButton>
    </form>
  );
}

export function FavoriteButton({ offerId, isFavorite }: { offerId: string; isFavorite: boolean }) {
  const [state, action] = useActionState<ApplyState, FormData>(toggleFavorite, null);

  return (
    <form action={action}>
      <input type="hidden" name="offerId" value={offerId} />
      <button type="submit" className="btn btn-outline-navy btn-sm">
        {isFavorite ? "★ Retirer des favoris" : "☆ Ajouter aux favoris"}
      </button>
      {state?.error ? <p className="mt-1 text-xs text-red-600">{state.error}</p> : null}
    </form>
  );
}
