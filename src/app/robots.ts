import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/candidat/", "/entreprise/", "/admin/", "/api/"],
      },
    ],
    sitemap: "https://www.bk3sconsulting.com/sitemap.xml",
  };
}
