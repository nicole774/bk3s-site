import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["500", "600", "700"] });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bk3sconsulting.com"),
  title: {
    default: "BK Dimension 3S Consulting — Recrutement, formation & conseil RH à Ouagadougou",
    template: "%s | BK Dimension 3S Consulting",
  },
  description:
    "BK Dimension 3S Consulting accompagne les entreprises du Burkina Faso : recrutement, placement, formation, conseil RH, montage de dossiers et événementiel. Déposez votre CV ou publiez vos offres d'emploi.",
  keywords: ["emploi Burkina Faso", "recrutement Ouagadougou", "cabinet RH", "formation", "BK3S"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "BK Dimension 3S Consulting",
    images: ["/logo.jpeg"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="fr" className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader user={user ? { firstName: user.firstName, role: user.role } : null} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
