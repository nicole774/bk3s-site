import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-bk grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="Logo BK Dimension 3S Consulting" width={48} height={48} className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/60" />
            <strong className="font-display">BK Dimension 3S Consulting</strong>
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/65">
            BK Dimension 3S Consulting vous accompagne avec professionnalisme, expertise et engagement pour répondre
            à vos besoins et propulser vos projets.
          </p>
          <p className="mt-3 font-display text-gold-light italic">« {SITE.tagline} »</p>
        </div>

        <div>
          <h4 className="text-gold-light">Navigation</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/" className="hover:text-gold-light">Accueil</Link></li>
            <li><Link href="/a-propos" className="hover:text-gold-light">À propos</Link></li>
            <li><Link href="/services" className="hover:text-gold-light">Nos services</Link></li>
            <li><Link href="/offres" className="hover:text-gold-light">Offres d&apos;emploi</Link></li>
            <li><Link href="/formations" className="hover:text-gold-light">Formations</Link></li>
            <li><Link href="/actualites" className="hover:text-gold-light">Actualités</Link></li>
            <li><Link href="/contact" className="hover:text-gold-light">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-light">Espaces en ligne</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/inscription" className="hover:text-gold-light">Créer un compte candidat</Link></li>
            <li><Link href="/connexion" className="hover:text-gold-light">Espace candidat</Link></li>
            <li><Link href="/inscription-entreprise" className="hover:text-gold-light">Créer un compte entreprise</Link></li>
            <li><Link href="/devis" className="hover:text-gold-light">Demander un devis</Link></li>
            <li><Link href="/politique-confidentialite" className="hover:text-gold-light">Politique de confidentialité</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-light">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Siège social — {SITE.city}</li>
            {SITE.phones.map((p) => (
              <li key={p}>{p}</li>
            ))}
            <li>{SITE.email}</li>
            <li>{SITE.website}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-bk flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {SITE.name} — RCCM {SITE.rccm} · IFU {SITE.ifu}</span>
          <span className="tracking-[0.2em] uppercase">{SITE.slogan}</span>
        </div>
      </div>
    </footer>
  );
}
