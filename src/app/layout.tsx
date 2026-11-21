import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Polices auto-hébergées (licence OFL) : aucun téléchargement Google au build,
// donc les déploiements ne dépendent plus du réseau.
const fraunces = localFont({
  src: "../fonts/fraunces-variable.ttf",
  variable: "--font-fraunces",
  display: "swap",
  weight: "100 900",
});

const workSans = localFont({
  src: "../fonts/work-sans-variable.ttf",
  variable: "--font-work-sans",
  display: "swap",
  weight: "100 900",
});

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
    <html lang="fr" className={`${fraunces.variable} ${workSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <SiteHeader user={user ? { firstName: user.firstName, role: user.role } : null} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
