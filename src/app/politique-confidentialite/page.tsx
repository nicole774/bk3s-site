import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données personnelles sur la plateforme BK Dimension 3S Consulting.",
};

const SECTIONS: Array<[string, React.ReactNode]> = [
  [
    "1. Responsable du traitement",
    <>
      La présente plateforme est exploitée par <strong>{SITE.name}</strong>, dont le siège social est situé à{" "}
      {SITE.city} (RCCM {SITE.rccm} — IFU {SITE.ifu}). Le cabinet est responsable des traitements de données
      personnelles réalisés sur la plateforme.
    </>,
  ],
  [
    "2. Données collectées",
    <ul key="collectees" className="list-disc space-y-1 pl-5">
      <li key="cand"><strong>Pour les candidats :</strong> identité (nom, prénom), coordonnées (e-mail, téléphone, ville/pays), informations professionnelles (titre, résumé, compétences, langues, expériences, formations) et documents (CV, lettre de motivation, certificats).</li>
      <li key="ent"><strong>Pour les entreprises :</strong> raison sociale, secteur, coordonnées, identité du responsable de compte et logo.</li>
      <li key="nav"><strong>Données de navigation :</strong> données techniques liées à l&apos;utilisation de la plateforme, dans la limite de ce qui est nécessaire à la sécurité et à la mesure d&apos;audience.</li>
    </ul>,
  ],
  [
    "3. Finalités",
    <ul key="finalites" className="list-disc space-y-1 pl-5">
      <li key="offres">Diffusion des offres d&apos;emploi et gestion des candidatures ;</li>
      <li key="cvtheque">Constitution et exploitation du vivier de candidats (CVthèque), dans le respect des autorisations données ;</li>
      <li key="relation">Mise en relation entre candidats et employeurs clients du cabinet ;</li>
      <li key="info">Information des utilisateurs (notifications, alertes, réponses aux demandes).</li>
    </ul>,
  ],
  [
    "4. Base légale et consentement",
    <>
      Les traitements reposent sur l&apos;exécution des services demandés (compte candidat ou entreprise) et, pour la
      visibilité de votre profil dans la CVthèque, sur votre <strong>consentement explicite</strong> : vous pouvez à tout
      moment activer ou désactiver la visibilité de votre profil depuis votre espace « Mon CV ». Sans consentement,
      votre profil et votre CV ne sont jamais accessibles aux recruteurs dans la CVthèque.
    </>,
  ],
  [
    "5. Destinataires des données",
    <>
      Vos données sont destinées à l&apos;équipe de {SITE.name}. Les profils <strong>explicitement rendus visibles</strong> dans
      la CVthèque peuvent être consultés par les entreprises clientes dont le compte a été validé par le cabinet. Vos
      coordonnées personnelles (e-mail, téléphone) ne sont jamais publiées dans la CVthèque.
    </>,
  ],
  [
    "6. Durée de conservation",
    <>
      Les comptes et CV sont conservés tant que le compte est actif. En cas d&apos;inactivité prolongée (24 mois sans
      connexion), le profil peut être archivé puis supprimé. Les documents supprimés par l&apos;utilisateur le sont
      définitivement.
    </>,
  ],
  [
    "7. Vos droits",
    <>
      Conformément à la réglementation applicable au Burkina Faso (notamment la loi n°001-2021 portant protection des
      personnes à l&apos;égard du traitement des données à caractère personnel), vous disposez des droits d&apos;accès, de
      rectification, d&apos;opposition, de suppression et de portabilité de vos données. Pour les exercer, écrivez à{" "}
      <strong>{SITE.email}</strong>. Vous pouvez également à tout moment :
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>modifier ou supprimer votre CV depuis votre espace personnel ;</li>
        <li>désactiver la visibilité de votre profil dans la CVthèque ;</li>
        <li>demander la suppression complète de votre compte et de vos données.</li>
      </ul>
    </>,
  ],
  [
    "8. Sécurité",
    <>
      La plateforme met en œuvre des mesures techniques et organisationnelles adaptées : mots de passe hachés,
      communications chiffrées (HTTPS), contrôle d&apos;accès par rôles, journalisation des opérations sensibles et
      sauvegardes régulières.
    </>,
  ],
  [
    "9. Contact",
    <>
      Pour toute question relative à la présente politique : <strong>{SITE.email}</strong> — {SITE.phones[0]} — {SITE.city}.
    </>,
  ],
];

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <section className="bg-navy-deep py-16 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accueil / Légal</p>
          <h1 className="mt-3 text-4xl font-semibold">Politique de confidentialité</h1>
          <p className="mt-3 max-w-xl text-white/75">
            Protection des données personnelles sur la plateforme {SITE.name}.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-bk mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-ink-soft">
          {SECTIONS.map(([title, content]) => (
            <div key={title}>
              <h2 className="text-lg font-semibold text-navy">{title}</h2>
              <div className="mt-2">{content}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
