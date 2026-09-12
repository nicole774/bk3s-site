import { DevisForm } from "@/components/public-forms";

export const metadata = {
  title: "Demande de devis",
  description: "Soumettez votre besoin en recrutement, formation, conseil RH ou toute autre prestation à BK Dimension 3S Consulting.",
};

export default async function DevisPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;

  return (
    <>
      <section className="bg-navy-deep py-16 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accueil / Devis</p>
          <h1 className="mt-3 text-4xl font-semibold">Demander un devis</h1>
          <p className="mt-3 max-w-xl text-white/75">
            Décrivez-nous votre besoin : notre équipe étudie votre demande et vous propose une offre adaptée.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-bk mx-auto max-w-3xl">
          <div className="card">
            <DevisForm defaultService={service} />
          </div>
        </div>
      </section>
    </>
  );
}
