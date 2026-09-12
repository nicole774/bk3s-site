import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Logo d'entreprise (public, utilisé sur les fiches d'offres). */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id }, select: { logo: true, logoMime: true } });
  if (!company?.logo || !company.logoMime) return new NextResponse("Introuvable", { status: 404 });

  return new NextResponse(new Uint8Array(company.logo), {
    headers: {
      "Content-Type": company.logoMime,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
