"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword, logAction, verifyPassword, destroySession } from "@/lib/auth";
import { str, optionalStr, validateUpload, parseLines } from "@/lib/utils";
import type { Availability } from "@prisma/client";

export type ProfileState = { error?: string; success?: string } | null;

async function requireCandidate() {
  const user = await getCurrentUser();
  if (!user || user.role !== "CANDIDATE" || !user.candidateProfileId) return null;
  return user;
}

/** Mise à jour du profil professionnel (§8.2). */
export async function updateCandidateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireCandidate();
  if (!user) return { error: "Session expirée." };

  const title = optionalStr(formData, "title");
  const summary = optionalStr(formData, "summary");
  const skills = str(formData, "skills").split(",").map((s) => s.trim()).filter(Boolean);
  const languages = str(formData, "languages").split(",").map((s) => s.trim()).filter(Boolean);
  const educationLevel = optionalStr(formData, "educationLevel");
  const sector = optionalStr(formData, "sector");
  const city = optionalStr(formData, "city");
  const country = optionalStr(formData, "country") ?? "Burkina Faso";
  const experienceYears = parseInt(str(formData, "experienceYears"), 10) || 0;
  const availability = (str(formData, "availability") || "IMMEDIATE") as Availability;
  const visibleInCvtheque = formData.get("visibleInCvtheque") === "on";

  // Expériences et formations saisies "une par ligne", champs séparés par « | »
  const experiences = parseLines(str(formData, "experiences"), 4).map(([poste, entreprise, periode, description]) => ({
    poste,
    entreprise,
    periode,
    description,
  }));
  const educations = parseLines(str(formData, "educations"), 3).map(([diplome, etablissement, annee]) => ({
    diplome,
    etablissement,
    annee,
  }));

  await prisma.candidateProfile.update({
    where: { id: user.candidateProfileId },
    data: {
      title,
      summary,
      skills,
      languages,
      educationLevel,
      sector,
      city,
      country,
      experienceYears,
      availability,
      visibleInCvtheque,
      experiences,
      educations,
    },
  });

  // Mise à jour des coordonnées de base
  await prisma.user.update({
    where: { id: user.id },
    data: { firstName: str(formData, "firstName") || user.firstName, lastName: str(formData, "lastName") || user.lastName, phone: optionalStr(formData, "phone") },
  });

  await logAction(user.id, "PROFILE_UPDATE", "candidate_profile", user.candidateProfileId, { visibleInCvtheque });
  revalidatePath("/candidat/profil");
  revalidatePath("/candidat");
  return { success: "Profil mis à jour avec succès." };
}

/** Dépôt d'un CV / document (§9). */
export async function uploadDocument(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireCandidate();
  if (!user || !user.candidateProfileId) return { error: "Session expirée." };

  const file = formData.get("file");
  const type = (str(formData, "type") || "CV") as "CV" | "MOTIVATION" | "CERTIFICATE" | "OTHER";
  if (!(file instanceof File) || file.size === 0) return { error: "Veuillez sélectionner un fichier." };
  const validation = validateUpload(file);
  if (validation) return { error: validation };

  const count = await prisma.document.count({ where: { candidateId: user.candidateProfileId, type } });
  if (count >= 5) return { error: "Vous avez déjà 5 documents de ce type. Supprimez-en un avant d'en déposer un nouveau." };

  const data = new Uint8Array(await file.arrayBuffer());
  const hasPrimary = await prisma.document.findFirst({ where: { candidateId: user.candidateProfileId, type, isPrimary: true } });

  await prisma.document.create({
    data: {
      candidateId: user.candidateProfileId,
      type,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data,
      isPrimary: type === "CV" ? !hasPrimary : false,
    },
  });

  await logAction(user.id, "DOCUMENT_UPLOAD", "document", undefined, { type, filename: file.name });
  revalidatePath("/candidat/cv");
  revalidatePath("/candidat");
  return { success: "Document déposé avec succès." };
}

export async function deleteDocument(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireCandidate();
  if (!user) return { error: "Session expirée." };
  const id = str(formData, "documentId");

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc || doc.candidateId !== user.candidateProfileId) return { error: "Document introuvable." };

  await prisma.document.delete({ where: { id } });
  revalidatePath("/candidat/cv");
  return { success: "Document supprimé." };
}

export async function setPrimaryDocument(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireCandidate();
  if (!user) return { error: "Session expirée." };
  const id = str(formData, "documentId");

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc || doc.candidateId !== user.candidateProfileId) return { error: "Document introuvable." };

  await prisma.document.updateMany({ where: { candidateId: user.candidateProfileId, type: doc.type }, data: { isPrimary: false } });
  await prisma.document.update({ where: { id }, data: { isPrimary: true } });
  revalidatePath("/candidat/cv");
  return { success: "Document défini comme principal." };
}

/** Retrait d'une candidature par le candidat. */
export async function withdrawApplication(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireCandidate();
  if (!user) return { error: "Session expirée." };
  const id = str(formData, "applicationId");

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.candidateId !== user.candidateProfileId) return { error: "Candidature introuvable." };

  await prisma.application.update({ where: { id }, data: { status: "CLOSED", statusNote: "Retirée par le candidat" } });
  revalidatePath("/candidat/candidatures");
  return { success: "Candidature retirée." };
}

/** Droit à la suppression du compte (§26). */
export async function deleteMyAccount(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Session expirée." };
  const password = str(formData, "password");
  const confirm = formData.get("confirm") === "on";

  const full = await prisma.user.findUnique({ where: { id: user.id } });
  if (!full || !(await verifyPassword(password, full.passwordHash))) return { error: "Mot de passe incorrect." };
  if (!confirm) return { error: "Merci de cocher la case de confirmation." };

  await logAction(user.id, "ACCOUNT_DELETE", "user", user.id);
  await prisma.user.delete({ where: { id: user.id } });
  await destroySession();
  revalidatePath("/");
  return { success: "Compte supprimé." };
}

/** Changement de mot de passe (§25 — récupération/gestion du compte). */
export async function changePassword(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Session expirée." };

  const current = str(formData, "current");
  const next = str(formData, "next");
  const confirm = str(formData, "confirm");

  const full = await prisma.user.findUnique({ where: { id: user.id } });
  if (!full || !(await verifyPassword(current, full.passwordHash))) return { error: "Mot de passe actuel incorrect." };
  if (next.length < 8) return { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
  if (next !== confirm) return { error: "Les deux mots de passe ne correspondent pas." };

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
  await logAction(user.id, "PASSWORD_CHANGE", "user", user.id);
  return { success: "Mot de passe modifié avec succès." };
}

export async function markAllNotificationsRead() {
  const user = await getCurrentUser();
  if (!user) return;
  await prisma.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
  revalidatePath("/candidat/notifications");
  revalidatePath("/entreprise");
  revalidatePath("/admin");
}
