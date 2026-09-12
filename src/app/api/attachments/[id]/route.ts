import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Pièce jointe d'une demande de devis — équipe BK3S uniquement. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "CONSULTANT", "EDITOR"].includes(user.role)) {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const { id } = await params;
  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    select: { attachmentData: true, attachmentMime: true, attachmentName: true },
  });
  if (!request?.attachmentData || !request.attachmentMime) return new NextResponse("Introuvable", { status: 404 });

  return new NextResponse(new Uint8Array(request.attachmentData), {
    headers: {
      "Content-Type": request.attachmentMime,
      "Content-Disposition": `inline; filename="${encodeURIComponent(request.attachmentName ?? "piece-jointe")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
