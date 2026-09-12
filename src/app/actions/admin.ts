"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword, logAction } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { str, optionalStr, slugify } from "@/lib/utils";
import { COMPANY_STATUS_LABELS } from "@/lib/constants";
import type { OfferStatus, CompanyStatus, ContentStatus, RequestStatus, Role, UserStatus } from "@prisma/client";

export type AdminState = { error?: string; success?: string } | null;

async function team() {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "CONSULTANT", "EDITOR"].includes(user.role)) return null;
  return user;
}

async function recruiters() {
  const user = await team();
  if (!user || !["ADMIN", "CONSULTANT"].includes(user.role)) return null;
  return user;
}

// ─── Modération des offres (§15.2) ──────────────────────────────────────────

export async function moderateOffer(formData: FormData) {
  const user = await recruiters();
  if (!user) return;

  const offerId = str(formData, "offerId");
  const action = str(formData, "action");
  const map: Record<string, OfferStatus> = {
    publish: "PUBLISHED",
    reject: "DRAFT",
    suspend: "SUSPENDED",
    close: "CLOSED",
    archive: "ARCHIVED",
  };
  const status = map[action];
  if (!status) return;

  const offer = await prisma.jobOffer.findUnique({
    where: { id: offerId },
    include: { company: { include: { owner: { select: { id: true } } } } },
  });
  if (!offer) return;

  await prisma.jobOffer.update({
    where: { id: offerId },
    data: { status, publishedAt: status === "PUBLISHED" ? new Date() : offer.publishedAt },
  });
  await logAction(user.id, `OFFER_${action.toUpperCase()}`, "job_offer", offerId, { title: offer.title });

  const messages: Partial<Record<OfferStatus, string>> = {
    PUBLISHED: `Votre offre « ${offer.title} » a été validée et publiée.`,
    DRAFT: `Votre offre « ${offer.title} » a été renvoyée pour modification.`,
    SUSPENDED: `Votre offre « ${offer.title} » a été suspendue par BK3S.`,
    CLOSED: `Votre offre « ${offer.title} » a été clôturée.`,
  };
  if (messages[status]) {
    await notify(offer.company.owner.id, "Mise à jour de votre offre", messages[status], "/entreprise/offres");
  }
  revalidatePath("/admin/offres");
  revalidatePath("/entreprise/offres");
  revalidatePath("/offres");
}

// ─── Gestion des entreprises (§15.4) ────────────────────────────────────────

export async function moderateCompany(formData: FormData) {
  const user = await recruiters();
  if (!user) return;

  const companyId = str(formData, "companyId");
  const action = str(formData, "action");
  const map: Record<string, CompanyStatus> = { approve: "APPROVED", suspend: "SUSPENDED", pending: "PENDING" };
  const status = map[action];
  if (!status) return;

  const company = await prisma.company.findUnique({ where: { id: companyId }, include: { owner: true } });
  if (!company) return;

  await prisma.company.update({ where: { id: companyId }, data: { status } });
  await logAction(user.id, `COMPANY_${action.toUpperCase()}`, "company", companyId, { name: company.name });
  await notify(
    company.owner.id,
    status === "APPROVED" ? "Compte entreprise validé" : "Statut de votre compte entreprise",
    status === "APPROVED"
      ? `Votre compte ${company.name} est validé : vous pouvez publier des offres et consulter la CVthèque.`
      : `Le statut de votre compte est désormais : ${COMPANY_STATUS_LABELS[status]}.`,
    "/entreprise",
  );
  revalidatePath("/admin/entreprises");
}

// ─── Gestion des utilisateurs (§15.1) ───────────────────────────────────────

export async function setUserStatus(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return;

  const targetId = str(formData, "userId");
  const status = str(formData, "status") as UserStatus;
  if (!["ACTIVE", "SUSPENDED"].includes(status) || targetId === user.id) return;

  await prisma.user.update({ where: { id: targetId }, data: { status } });
  await logAction(user.id, "USER_STATUS_UPDATE", "user", targetId, { status });
  revalidatePath("/admin/utilisateurs");
}

export async function setUserRole(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return;

  const targetId = str(formData, "userId");
  const role = str(formData, "role") as Role;
  if (!["ADMIN", "CONSULTANT", "EDITOR", "CANDIDATE", "COMPANY"].includes(role)) return;

  await prisma.user.update({ where: { id: targetId }, data: { role } });
  await logAction(user.id, "USER_ROLE_UPDATE", "user", targetId, { role });
  revalidatePath("/admin/utilisateurs");
}

export async function createUser(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return { error: "Action non autorisée." };

  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");
  const role = str(formData, "role") as Role;

  if (!firstName || !lastName || !email || password.length < 8) {
    return { error: "Champs invalides (mot de passe : 8 caractères minimum)." };
  }
  if (!["ADMIN", "CONSULTANT", "EDITOR"].includes(role)) return { error: "Rôle invalide." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Un compte existe déjà avec cet e-mail." };

  await prisma.user.create({
    data: { email, passwordHash: await hashPassword(password), firstName, lastName, role, status: "ACTIVE" },
  });
  await logAction(user.id, "USER_CREATE", "user", undefined, { email, role });
  revalidatePath("/admin/utilisateurs");
  return { success: `Compte ${email} créé avec le rôle ${role}.` };
}

// ─── Formations & actualités (§17, §20, §35) ────────────────────────────────

export async function saveFormation(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const user = await team();
  if (!user) return { error: "Action non autorisée." };

  const id = optionalStr(formData, "id");
  const title = str(formData, "title");
  if (!title) return { error: "Le titre est obligatoire." };
  const startDateStr = str(formData, "startDate");

  const data = {
    title,
    theme: optionalStr(formData, "theme"),
    description: optionalStr(formData, "description"),
    objectives: optionalStr(formData, "objectives"),
    program: optionalStr(formData, "program"),
    audience: optionalStr(formData, "audience"),
    trainer: optionalStr(formData, "trainer"),
    duration: optionalStr(formData, "duration"),
    location: optionalStr(formData, "location"),
    price: optionalStr(formData, "price"),
    startDate: startDateStr ? new Date(startDateStr) : null,
    status: (str(formData, "status") || "DRAFT") as ContentStatus,
  };

  if (id) await prisma.formation.update({ where: { id }, data });
  else await prisma.formation.create({ data });

  await logAction(user.id, id ? "FORMATION_UPDATE" : "FORMATION_CREATE", "formation", id, { title });
  revalidatePath("/admin/formations");
  revalidatePath("/formations");
  return { success: "Formation enregistrée." };
}

export async function deleteFormation(formData: FormData) {
  const user = await team();
  if (!user) return;
  const id = str(formData, "id");
  await prisma.formation.delete({ where: { id } });
  await logAction(user.id, "FORMATION_DELETE", "formation", id);
  revalidatePath("/admin/formations");
  revalidatePath("/formations");
}

export async function saveArticle(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const user = await team();
  if (!user) return { error: "Action non autorisée." };

  const id = optionalStr(formData, "id");
  const title = str(formData, "title");
  const content = str(formData, "content");
  if (!title || !content) return { error: "Le titre et le contenu sont obligatoires." };

  const data = {
    title,
    category: optionalStr(formData, "category"),
    excerpt: optionalStr(formData, "excerpt"),
    content,
    status: (str(formData, "status") || "DRAFT") as ContentStatus,
  };

  if (id) {
    await prisma.newsArticle.update({ where: { id }, data });
  } else {
    const baseSlug = slugify(title) || `article-${Date.now()}`;
    const slugCount = await prisma.newsArticle.count({ where: { slug: { startsWith: baseSlug } } });
    const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;
    await prisma.newsArticle.create({
      data: { ...data, slug, authorId: user.id, publishedAt: data.status === "PUBLISHED" ? new Date() : null },
    });
  }

  await logAction(user.id, id ? "ARTICLE_UPDATE" : "ARTICLE_CREATE", "news_article", id, { title });
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  return { success: "Article enregistré." };
}

export async function deleteArticle(formData: FormData) {
  const user = await team();
  if (!user) return;
  const id = str(formData, "id");
  await prisma.newsArticle.delete({ where: { id } });
  await logAction(user.id, "ARTICLE_DELETE", "news_article", id);
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
}

// ─── Devis & messages (§19) ─────────────────────────────────────────────────

export async function updateServiceRequestStatus(formData: FormData) {
  const user = await team();
  if (!user) return;
  const id = str(formData, "id");
  const status = str(formData, "status") as RequestStatus;
  if (!["NEW", "IN_PROGRESS", "COMPLETED"].includes(status)) return;
  await prisma.serviceRequest.update({ where: { id }, data: { status } });
  await logAction(user.id, "SERVICE_REQUEST_STATUS", "service_request", id, { status });
  revalidatePath("/admin/devis");
}

export async function toggleMessageHandled(formData: FormData) {
  const user = await team();
  if (!user) return;
  const id = str(formData, "id");
  const handled = formData.get("handled") === "true";
  await prisma.contactMessage.update({ where: { id }, data: { handled: !handled } });
  revalidatePath("/admin/messages");
}

/** Candidatures : l'équipe BK3S peut suivre et intervenir (§16). */
export async function adminUpdateApplicationStatus(formData: FormData) {
  const user = await recruiters();
  if (!user) return;
  const { updateApplicationStatus } = await import("@/app/actions/offers");
  await updateApplicationStatus(formData);
}
