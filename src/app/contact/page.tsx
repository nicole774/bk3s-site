import { ContactForm } from "@/components/public-forms";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Contact",
  description: "Contactez BK Dimension 3S Consulting à Ouagadougou : recrutement, formation, conseil RH.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy-deep py-16 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accueil / Contact</p>
          <h1 className="mt-3 text-4xl font-semibold">Parlons de votre projet</h1>
          <p className="mt-3 max-w-xl text-white/75">
            Une question, un besoin en recrutement ou en formation ? Notre équipe vous répond rapidement.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-bk grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Formulaire de contact</p>
            <h2 className="section-title mt-2">Écrivez-nous</h2>
            <div className="card mt-6">
              <ContactForm />
            </div>
          </div>
          <div>
            <p className="eyebrow">Coordonnées</p>
            <h2 className="section-title mt-2">Nous joindre</h2>
            <div className="mt-6 space-y-4">
              <div className="card">
                <p className="eyebrow">Téléphones</p>
                <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                  {SITE.phones.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <p className="eyebrow">E-mail &amp; site</p>
                <p className="mt-2 text-sm text-ink-soft">{SITE.email}</p>
                <p className="text-sm text-ink-soft">{SITE.website}</p>
              </div>
              <div className="card">
                <p className="eyebrow">Siège social</p>
                <p className="mt-2 text-sm text-ink-soft">{SITE.city}</p>
              </div>
              <div className="card">
                <p className="eyebrow">Informations légales</p>
                <p className="mt-2 text-sm text-ink-soft">RCCM : {SITE.rccm}</p>
                <p className="text-sm text-ink-soft">IFU : {SITE.ifu}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
