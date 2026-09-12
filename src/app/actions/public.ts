"use server";

import { prisma } from "@/lib/db";
import { notifyAdminTeam } from "@/lib/notify";
import { str, optionalStr } from "@/lib/utils";

export type PublicFormState = { error?: string; success?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Message de contact (§5 rubrique Contact) */
export async function sendContactMessage(_prev: PublicFormState, formData: FormData): Promise<PublicFormState> {
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const phone = optionalStr(formData, "phone");
  const subject = optionalStr(formData, "subject");
  const message = str(formData, "message");

  if (!name || !email || !message) return { error: "Merci de remplir tous les champs obligatoires." };
  if (!EMAIL_RE.test(email)) return { error: "Adresse e-mail invalide." };

  await prisma.contactMessage.create({ data: { name, email, phone, subject, message } });
  await notifyAdminTeam("Nouveau message de contact", `${name} — ${subject ?? "Sans sujet"}`, "/admin/messages");

  return { success: "Votre message a bien été envoyé. Notre équipe vous répondra dans les meilleurs délais." };
}

/** Demande de devis / prestation (§19) */
export async function submitServiceRequest(_prev: PublicFormState, formData: FormData): Promise<PublicFormState> {
  const name = str(formData, "name");
  const organization = optionalStr(formData, "organization");
  const phone = optionalStr(formData, "phone");
  const email = str(formData, "email").toLowerCase();
  const service = str(formData, "service");
  const description = str(formData, "description");
  const deadline = optionalStr(formData, "deadline");
  const attachment = formData.get("attachment");

  if (!name || !email || !service || !description) return { error: "Merci de remplir tous les champs obligatoires." };
  if (!EMAIL_RE.test(email)) return { error: "Adresse e-mail invalide." };

  let attachmentData: Uint8Array<ArrayBuffer> | null = null;
  let attachmentName: string | null = null;
  let attachmentMime: string | null = null;
  if (attachment instanceof File && attachment.size > 0) {
    if (attachment.size > 5 * 1024 * 1024) return { error: "Pièce jointe trop volumineuse (maximum 5 Mo)." };
    attachmentData = new Uint8Array(await attachment.arrayBuffer());
    attachmentName = attachment.name;
    attachmentMime = attachment.type;
  }

  await prisma.serviceRequest.create({
    data: { name, organization, phone, email, service, description, deadline, attachmentData, attachmentName, attachmentMime },
  });
  await notifyAdminTeam("Nouvelle demande de devis", `${name}${organization ? ` — ${organization}` : ""} : ${service}`, "/admin/devis");

  return { success: "Votre demande a bien été enregistrée. Le cabinet reviendra vers vous très prochainement." };
}
