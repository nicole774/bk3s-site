"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";

import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/services", label: "Nos services" },
  { href: "/offres", label: "Offres d'emploi" },
  { href: "/formations", label: "Formations" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

const ROLE_HOME: Record<string, string> = {
  CANDIDATE: "/candidat",
  COMPANY: "/entreprise",
  ADMIN: "/admin",
  CONSULTANT: "/admin",
  EDITOR: "/admin",
};

export function SiteHeader({ user }: { user: { firstName: string; role: string } | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const dashboardHref = user ? ROLE_HOME[user.role] ?? "/" : null;

  return (
    <header className="sticky top-0 z-40 bg-navy-deep text-white shadow-md">
      <div className="hidden border-b border-white/10 md:block">
        <div className="container-bk flex items-center justify-between py-1.5 text-xs text-white/70">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <Phone size={12} className="text-gold" /> {SITE.phones[0]}
            </span>
            <span>{SITE.email}</span>
          </div>
          <span className="tracking-[0.2em] text-gold-light uppercase">{SITE.slogan}</span>
        </div>
      </div>

      <div className="container-bk flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.jpeg" alt="Logo BK Dimension 3S Consulting" width={48} height={48} className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/60" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold">BK Dimension</span>
            <span className="block text-xs font-medium tracking-[0.18em] text-gold-light uppercase">3S Consulting</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) && "bg-white/10 text-gold-light",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {dashboardHref ? (
            <Link href={dashboardHref} className="btn btn-gold btn-sm">
              Mon espace
            </Link>
          ) : (
            <>
              <Link href="/connexion" className="btn btn-outline btn-sm">
                Connexion
              </Link>
              <Link href="/inscription" className="btn btn-gold btn-sm">
                Déposer mon CV
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-navy-deep lg:hidden" aria-label="Navigation mobile">
          <div className="container-bk flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
              {dashboardHref ? (
                <Link href={dashboardHref} onClick={() => setOpen(false)} className="btn btn-gold">
                  Mon espace ({user?.firstName})
                </Link>
              ) : (
                <>
                  <Link href="/connexion" onClick={() => setOpen(false)} className="btn btn-outline">
                    Connexion
                  </Link>
                  <Link href="/inscription" onClick={() => setOpen(false)} className="btn btn-gold">
                    Déposer mon CV
                  </Link>
                  <Link href="/inscription-entreprise" onClick={() => setOpen(false)} className="btn btn-outline">
                    Publier une offre
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
