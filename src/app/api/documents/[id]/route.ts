import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/**
 * Téléchargement sécurisé d'un document.
 * Accessible au propriétaire, à l'équipe BK3S, à l'entreprise concernée
 * (via une candidature) ou aux entreprises validées pour un CV visible en CVthèque.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Non autorisé", { status: 401 });

  const { id } = await params;
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { candidate: { include: { user: { select: { id: true } } } } },
  });
  if (!doc) return new NextResponse("Introuvable", { status: 404 });

  const isOwner = user.role === "CANDIDATE" && user.candidateProfileId === doc.candidateId;
  const isTeam = ["ADMIN", "CONSULTANT"].includes(user.role);

  let isAuthorizedCompany = false;
  if (user.role === "COMPANY" && user.companyId) {
    // Entreprise destinataire d'une candidature utilisant ce document
    const usedInApplication = await prisma.application.findFirst({
      where: { documentId: id, offer: { companyId: user.companyId } },
    });
    // Ou CV visible en CVthèque par une entreprise validée
    const approved = await prisma.company.findUnique({ where: { id: user.companyId }, select: { status: true } });
    isAuthorizedCompany =
      Boolean(usedInApplication) ||
      (approved?.status === "APPROVED" && doc.type === "CV" && doc.candidate.visibleInCvtheque);
  }

  if (!isOwner && !isTeam && !isAuthorizedCompany) {
    return new NextResponse("Accès refusé", { status: 403 });
  }

  return new NextResponse(new Uint8Array(doc.data), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(doc.filename)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
