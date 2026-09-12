import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.bk3sconsulting.com";

  const staticRoutes = [
    "",
    "/a-propos",
    "/services",
    "/offres",
    "/formations",
    "/actualites",
    "/contact",
    "/devis",
    "/inscription",
    "/inscription-entreprise",
    "/connexion",
    "/politique-confidentialite",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [offers, articles] = await Promise.all([
    prisma.jobOffer.findMany({ where: { status: "PUBLISHED" }, select: { id: true, updatedAt: true } }),
    prisma.newsArticle.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  return [
    ...staticRoutes,
    ...offers.map((o) => ({ url: `${base}/offres/${o.id}`, lastModified: o.updatedAt, priority: 0.9 })),
    ...articles.map((a) => ({ url: `${base}/actualites/${a.slug}`, lastModified: a.updatedAt, priority: 0.6 })),
  ];
}
