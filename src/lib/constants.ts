import type { ApplicationStatus, Availability, CompanyStatus, ContractType, OfferStatus, Role } from "@prisma/client";

export const SITE = {
  name: "BK Dimension 3S Consulting",
  shortName: "BK 3S Consulting",
  tagline: "Ensemble, construisons votre succès !",
  motto: ["Savoir", "Savoir-faire", "Savoir-être"],
  slogan: "Solutions · Synergie · Succès",
  email: "contact@bk3sconsulting.com",
  phones: ["(226) 70 94 60 96", "(226) 70 54 32 55", "(226) 65 67 66 58", "(226) 76 00 25 60"],
  city: "Ouagadougou, Burkina Faso",
  website: "www.bk3sconsulting.com",
  rccm: "BF-OUA-01-2022-B13-11422",
  ifu: "00244687M",
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrateur",
  CONSULTANT: "Consultant BK3S",
  EDITOR: "Éditeur",
  CANDIDATE: "Candidat",
  COMPANY: "Entreprise",
};

export const CONTRACT_LABELS: Record<ContractType, string> = {
  CDI: "CDI",
  CDD: "CDD",
  STAGE: "Stage",
  CONSULTANCE: "Consultance",
  PRESTATION: "Prestation",
  MISSION: "Mission",
  AUTRE: "Autre",
};

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "En attente de validation",
  PUBLISHED: "Publiée",
  SUSPENDED: "Suspendue",
  CLOSED: "Clôturée",
  ARCHIVED: "Archivée",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  RECEIVED: "Candidature reçue",
  UNDER_REVIEW: "En cours d'examen",
  SHORTLISTED: "Présélectionné",
  INTERVIEW: "Entretien",
  HIRED: "Retenu",
  REJECTED: "Non retenu",
  CLOSED: "Clôturée",
};

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  PENDING: "En attente de validation",
  APPROVED: "Validée",
  SUSPENDED: "Suspendue",
};

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  IMMEDIATE: "Disponible immédiatement",
  UNDER_NOTICE: "Sous préavis",
  WITHIN_1_MONTH: "Disponible dans 1 mois",
  WITHIN_3_MONTHS: "Disponible dans 3 mois",
};

export const SECTORS = [
  "Administration & gestion",
  "Agriculture & élevage",
  "Banque, finance & assurance",
  "BTP & génie civil",
  "Commerce & distribution",
  "Communication & marketing",
  "Développement international & ONG",
  "Éducation & formation",
  "Énergie & mines",
  "Industrie & production",
  "Informatique & numérique",
  "Logistique & transport",
  "Santé & social",
  "Services aux entreprises",
  "Tourisme & hôtellerie",
  "Autre",
];

export const EDUCATION_LEVELS = [
  "BEPC",
  "Baccalauréat",
  "BTS / DUT / Licence",
  "Maîtrise / Master",
  "Ingénieur",
  "Doctorat",
  "Certification professionnelle",
  "Autre",
];

export const EXPERIENCE_LEVELS = [
  "Débutant (0-1 an)",
  "Junior (1-3 ans)",
  "Confirmé (3-5 ans)",
  "Expérimenté (5-10 ans)",
  "Senior (10 ans et +)",
];

export const LANGUAGES = ["Français", "Anglais", "Mooré", "Dioula", "Fulfuldé", "Arabe", "Espagnol", "Autre"];

/** Les 8 domaines d'activité du cabinet (§18) */
export const SERVICES = [
  {
    slug: "recrutement",
    name: "Recrutement",
    short: "Recherche et sélection de talents compétents et adaptés à vos besoins, du sourcing à l'intégration.",
    objectifs: "Identifier, évaluer et attirer les candidats les plus qualifiés pour chaque poste à pourvoir.",
    beneficiaires: "PME, grandes entreprises, ONG, projets et programmes, institutions publiques et privées.",
    methode: "Définition du besoin, rédaction et diffusion de l'offre, tri des candidatures, présélection, entretiens, short-list, accompagnement de la décision.",
    livrables: "Short-list de candidats évalués, comptes rendus d'entretiens, rapport de recrutement.",
  },
  {
    slug: "placement",
    name: "Placement",
    short: "Mise à disposition de personnel qualifié pour renforcer vos équipes efficacement et rapidement.",
    objectifs: "Fournir rapidement du personnel qualifié et opérationnel pour des besoins temporaires ou permanents.",
    beneficiaires: "Entreprises ayant des besoins ponctuels ou récurrents en personnel.",
    methode: "Analyse du besoin, sélection dans notre vivier de talents, mise à disposition, suivi de performance.",
    livrables: "Profil(s) mis à disposition, contrat de mise à disposition, suivi périodique.",
  },
  {
    slug: "formation",
    name: "Formation",
    short: "Renforcement des compétences de vos équipes à travers des formations pratiques et adaptées à votre secteur.",
    objectifs: "Développer les compétences techniques et comportementales des équipes.",
    beneficiaires: "Salariés, dirigeants, jeunes diplômés, demandeurs d'emploi.",
    methode: "Diagnostic des besoins, conception du programme, animation pratique, évaluation des acquis.",
    livrables: "Supports de formation, attestations, rapport d'évaluation.",
  },
  {
    slug: "conseil",
    name: "Conseil",
    short: "Accompagnement et conseils stratégiques pour optimiser vos performances et vos processus RH.",
    objectifs: "Structurer et optimiser la fonction RH et organisationnelle de l'entreprise.",
    beneficiaires: "Dirigeants, directions RH, organisations en croissance ou en transformation.",
    methode: "Audit de l'existant, recommandations, plan d'action, accompagnement à la mise en œuvre.",
    livrables: "Rapport d'audit, plan d'action, procédures et outils RH.",
  },
  {
    slug: "gestion-rh",
    name: "Gestion des ressources humaines",
    short: "Gestion administrative du personnel et optimisation du capital humain de votre structure.",
    objectifs: "Externaliser tout ou partie de la gestion administrative du personnel en toute conformité.",
    beneficiaires: "PME sans service RH, entreprises souhaitant se concentrer sur leur cœur de métier.",
    methode: "Prise en charge de la paie, des contrats, des déclarations sociales et du suivi administratif.",
    livrables: "Bulletins de paie, contrats, déclarations sociales, dossiers du personnel à jour.",
  },
  {
    slug: "montage-de-dossiers",
    name: "Montage de dossiers",
    short: "Constitution et montage de dossiers administratifs, techniques et financiers.",
    objectifs: "Constituer des dossiers solides et conformes (appels d'offres, financements, agréments).",
    beneficiaires: "Entreprises, associations, ONG, porteurs de projets.",
    methode: "Analyse des exigences, collecte des pièces, rédaction technique et financière, revue de conformité.",
    livrables: "Dossier complet et conforme, prêt à soumissionner.",
  },
  {
    slug: "evenementiel",
    name: "Événementiel",
    short: "Organisation d'événements professionnels et privés sur mesure, de la conception à la réalisation.",
    objectifs: "Organiser des événements professionnels réussis (séminaires, conférences, lancements).",
    beneficiaires: "Entreprises, institutions, organisations internationales.",
    methode: "Conception du concept, logistique, coordination des prestataires, animation et bilan.",
    livrables: "Événement réalisé, rapport bilan, supports de communication.",
  },
  {
    slug: "prestations-diverses",
    name: "Prestations diverses",
    short: "Des solutions variées et personnalisées pour répondre à vos besoins spécifiques.",
    objectifs: "Répondre à des besoins spécifiques non couverts par les prestations standards.",
    beneficiaires: "Toute organisation ayant un besoin ponctuel ou particulier.",
    methode: "Étude du besoin, proposition sur mesure, exécution et suivi.",
    livrables: "Définis ensemble selon le besoin exprimé.",
  },
] as const;

export const RECRUITMENT_STEPS = [
  "Création du besoin",
  "Rédaction de l'offre",
  "Réception des candidatures",
  "Présélection",
  "Entretiens",
  "Short-list",
  "Décision & intégration",
] as const;
