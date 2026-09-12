"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser, logAction } from "@/lib/auth";
import { notify, notifyAdminTeam } from "@/lib/notify";
import { str } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";

export type ApplyState = { error?: string; success?: string } | null;

/** Candidature en ligne à une offre (§11). */
export async function applyToOffer(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Vous devez être connecté en tant que candidat pour postuler." };
  if (user.role !== "CANDIDATE" || !user.candidateProfileId) {
    return { error: "Seuls les comptes candidats peuvent postuler aux offres." };
  }

  const offerId = str(formData, "offerId");
  const documentId = str(formData, "documentId");
  const coverLetter = str(formData, "coverLetter") || null;

  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { company: { include: { owner: { select: { id: true } } } } },
  });
  if (!offer || offer.status !== "PUBLISHED") return { error: "Cette offre n'est plus disponible." };
  if (offer.deadline && offer.deadline < new Date()) return { error: "La date limite de candidature est dépassée." };

  const existing = await prisma.application.findUnique({
    where: { candidateId_offerId: { candidateId: user.candidateProfileId, offerId } },
  });
  if (existing) return { error: "Vous avez déjà candidaté à cette offre." };

  const doc = await prisma.document.findFirst({
    where: { id: documentId || undefined, candidateId: user.candidateProfileId },
  });
  if (!doc) return { error: "Veuillez sélectionner un CV valide." };

  await prisma.application.create({
    data: { candidateId: user.candidateProfileId, offerId, documentId: doc.id, coverLetter },
  });

  await notify(
    offer.company.owner.id,
    "Nouvelle candidature reçue",
    `${user.firstName} ${user.lastName} a postulé à l'offre « ${offer.title} ».`,
    `/entreprise/offres/${offerId}`,
  );
  await notifyAdminTeam(
    "Nouvelle candidature",
    `${user.firstName} ${user.lastName} → ${offer.title} (${offer.company.name})`,
    "/admin/candidatures",
  );
  await notify(user.id, "Candidature confirmée", `Votre candidature à « ${offer.title} » a bien été enregistrée.`, "/candidat/candidatures");

  revalidatePath(`/offres/${offerId}`);
  return { success: "Votre candidature a bien été envoyée. Suivez son évolution depuis votre espace candidat." };
}

/** Ajout/retrait des favoris (§12). */
export async function toggleFavorite(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "CANDIDATE" || !user.candidateProfileId) {
    return { error: "Connectez-vous en tant que candidat pour gérer vos favoris." };
  }
  const offerId = str(formData, "offerId");

  const existing = await prisma.favorite.findUnique({
    where: { candidateId_offerId: { candidateId: user.candidateProfileId, offerId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { candidateId_offerId: { candidateId: user.candidateProfileId, offerId } } });
    revalidatePath(`/offres/${offerId}`);
    return { success: "Offre retirée de vos favoris." };
  }

  await prisma.favorite.create({ data: { candidateId: user.candidateProfileId, offerId } });
  revalidatePath(`/offres/${offerId}`);
  return { success: "Offre ajoutée à vos favoris." };
}

/** Mise à jour du statut d'une candidature (recruteur ou équipe BK3S). */
export async function updateApplicationStatus(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["COMPANY", "ADMIN", "CONSULTANT"].includes(user.role)) return;

  const applicationId = str(formData, "applicationId");
  const status = str(formData, "status");
  const validStatuses = Object.keys(APPLICATION_STATUS_LABELS);
  if (!validStatuses.includes(status)) return;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      offer: { include: { company: { select: { id: true, ownerUserId: true, name: true } } } },
      candidate: { include: { user: { select: { id: true } } } },
    },
  });
  if (!application) return;

  // Une entreprise ne modifie que les candidatures de ses propres offres.
  if (user.role === "COMPANY" && application.offer.company.ownerUserId !== user.id) return;

  await prisma.application.update({ where: { id: applicationId }, data: { status: status as never } });
  await logAction(user.id, "APPLICATION_STATUS_UPDATE", "application", applicationId, { status });
  await notify(
    application.candidate.user.id,
    "Mise à jour de votre candidature",
    `Votre candidature à « ${application.offer.title} » est désormais : ${APPLICATION_STATUS_LABELS[status as never]}.`,
    "/candidat/candidatures",
  );

  revalidatePath("/entreprise/candidatures");
  revalidatePath("/admin/candidatures");
}
