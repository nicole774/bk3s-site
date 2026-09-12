"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser, logAction } from "@/lib/auth";
import { notifyAdminTeam, notify as notifyUser } from "@/lib/notify";
import { str, optionalStr, generateOfferReference } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";
import type { ContractType, OfferStatus, ApplicationStatus } from "@prisma/client";

export type CompanyState = { error?: string; success?: string } | null;

async function requireApprovedCompany() {
  const user = await getCurrentUser();
  if (!user || user.role !== "COMPANY" || !user.companyId) return null;
  const company = await prisma.company.findUnique({ where: { id: user.companyId } });
  if (!company) return null;
  return { user, company };
}

/** Mise à jour des informations entreprise (§13). */
export async function updateCompany(_prev: CompanyState, formData: FormData): Promise<CompanyState> {
  const ctx = await requireApprovedCompany();
  if (!ctx) return { error: "Session expirée." };

  const logo = formData.get("logo");
  const data: Record<string, unknown> = {
    name: str(formData, "name") || ctx.company.name,
    sector: str(formData, "sector") || ctx.company.sector,
    address: optionalStr(formData, "address"),
    city: optionalStr(formData, "city"),
    phone: optionalStr(formData, "phone"),
    email: optionalStr(formData, "email"),
    website: optionalStr(formData, "website"),
    description: optionalStr(formData, "description"),
  };

  if (logo instanceof File && logo.size > 0) {
    if (logo.size > 2 * 1024 * 1024) return { error: "Logo trop volumineux (maximum 2 Mo)." };
    if (!logo.type.startsWith("image/")) return { error: "Le logo doit être une image." };
    data.logo = new Uint8Array(await logo.arrayBuffer());
    data.logoMime = logo.type;
  }

  await prisma.company.update({ where: { id: ctx.company.id }, data });
  await logAction(ctx.user.id, "COMPANY_UPDATE", "company", ctx.company.id);
  revalidatePath("/entreprise/entreprise");
  return { success: "Informations mises à jour." };
}

/** Publication d'une offre par l'entreprise (§7.1, §33 — validation BK3S). */
export async function saveOffer(_prev: CompanyState, formData: FormData): Promise<CompanyState> {
  const ctx = await requireApprovedCompany();
  if (!ctx) {
    return { error: "Votre compte entreprise doit être validé par BK3S avant de publier des offres." };
  }

  const offerId = optionalStr(formData, "offerId");
  const draft = formData.get("draft") === "on";

  const title = str(formData, "title");
  const sector = optionalStr(formData, "sector");
  const location = optionalStr(formData, "location");
  const contractType = str(formData, "contractType") as ContractType;
  const experienceLevel = optionalStr(formData, "experienceLevel");
  const educationLevel = optionalStr(formData, "educationLevel");
  const skills = str(formData, "skills").split(",").map((s) => s.trim()).filter(Boolean);
  const missions = optionalStr(formData, "missions");
  const profile = optionalStr(formData, "profile");
  const conditions = optionalStr(formData, "conditions");
  const salary = optionalStr(formData, "salary");
  const positions = parseInt(str(formData, "positions"), 10) || 1;
  const deadlineStr = str(formData, "deadline");
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  if (!title || !contractType) return { error: "L'intitulé du poste et le type de contrat sont obligatoires." };

  const data = {
    title,
    sector,
    location,
    contractType,
    experienceLevel,
    educationLevel,
    skills,
    missions,
    profile,
    conditions,
    salary,
    positions,
    deadline,
    status: (draft ? "DRAFT" : "PENDING_REVIEW") as OfferStatus,
  };

  if (offerId) {
    const offer = await prisma.jobOffer.findUnique({ where: { id: offerId } });
    if (!offer || offer.companyId !== ctx.company.id) return { error: "Offre introuvable." };
    await prisma.jobOffer.update({ where: { id: offerId }, data });
    await logAction(ctx.user.id, "OFFER_UPDATE", "job_offer", offerId);
  } else {
    await prisma.jobOffer.create({
      data: { ...data, reference: generateOfferReference(), companyId: ctx.company.id },
    });
    await logAction(ctx.user.id, "OFFER_CREATE", "job_offer", undefined, { title });
    if (!draft) {
      await notifyAdminTeam("Nouvelle offre à valider", `${ctx.company.name} : « ${title} »`, "/admin/offres");
    }
  }

  revalidatePath("/entreprise/offres");
  revalidatePath("/admin/offres");
  return { success: draft ? "Offre enregistrée en brouillon." : "Offre soumise à BK3S pour validation. Elle sera publiée après vérification." };
}

/** Transitions de statut pilotées par l'entreprise (§13). */
export async function updateOfferStatusByCompany(formData: FormData) {
  const ctx = await requireApprovedCompany();
  if (!ctx) return;

  const offerId = str(formData, "offerId");
  const action = str(formData, "action");

  const offer = await prisma.jobOffer.findUnique({ where: { id: offerId } });
  if (!offer || offer.companyId !== ctx.company.id) return;

  const transitions: Record<string, OfferStatus> = {
    submit: "PENDING_REVIEW", // soumettre à validation
    suspend: "SUSPENDED", // suspendre
    close: "CLOSED", // clôturer
    reactivate: "PENDING_REVIEW",
  };
  const nextStatus = transitions[action];
  if (!nextStatus) return;

  await prisma.jobOffer.update({ where: { id: offerId }, data: { status: nextStatus } });
  await logAction(ctx.user.id, `OFFER_${action.toUpperCase()}`, "job_offer", offerId);
  if (nextStatus === "PENDING_REVIEW") {
    await notifyAdminTeam("Offre à valider", `${ctx.company.name} : « ${offer.title} »`, "/admin/offres");
  }
  revalidatePath("/entreprise/offres");
  revalidatePath("/admin/offres");
}

/** Mise à jour du statut d'une candidature par l'entreprise. */
export async function updateApplicationStatusByCompany(formData: FormData) {
  const ctx = await requireApprovedCompany();
  if (!ctx) return;

  const applicationId = str(formData, "applicationId");
  const status = str(formData, "status");
  if (!Object.keys(APPLICATION_STATUS_LABELS).includes(status)) return;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      offer: { select: { companyId: true, title: true } },
      candidate: { include: { user: { select: { id: true } } } },
    },
  });
  if (!application || application.offer.companyId !== ctx.company.id) return;

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: status as ApplicationStatus },
  });
  await logAction(ctx.user.id, "APPLICATION_STATUS_UPDATE", "application", applicationId, { status });
  await notifyUser(
    application.candidate.user.id,
    "Mise à jour de votre candidature",
    `Votre candidature à « ${application.offer.title} » est désormais : ${APPLICATION_STATUS_LABELS[status as ApplicationStatus]}.`,
    "/candidat/candidatures",
  );
  revalidatePath("/entreprise/candidatures");
  revalidatePath(`/entreprise/offres/${application.offer.companyId}`);
}
