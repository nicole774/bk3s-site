/**
 * Données de démonstration de la plateforme BK Dimension 3S Consulting.
 * Usage : npm run seed
 *
 * Comptes créés (mots de passe à changer en production !) :
 *  - admin@bk3sconsulting.com      / Bk3sAdmin@2026   (administrateur)
 *  - consultant@bk3sconsulting.com / Bk3sConsult@2026 (consultant)
 *  - recruteur@entreprise-demo.bf  / Recruteur@2026   (entreprise validée)
 *  - aline.candidat@demo.bf        / Candidat@2026    (candidat)
 *  - ibrahim.candidat@demo.bf      / Candidat@2026    (candidat)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Suppression des données existantes…");
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.application.deleteMany();
  await prisma.jobOffer.deleteMany();
  await prisma.company.deleteMany();
  await prisma.document.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  console.log("Création de l'équipe BK3S…");
  await prisma.user.createMany({
    data: [
      {
        email: "admin@bk3sconsulting.com",
        passwordHash: hash("Bk3sAdmin@2026"),
        firstName: "Bertrand",
        lastName: "KABORE",
        phone: "(226) 70 94 60 96",
        role: "ADMIN",
      },
      {
        email: "consultant@bk3sconsulting.com",
        passwordHash: hash("Bk3sConsult@2026"),
        firstName: "Awa",
        lastName: "TRAORE",
        phone: "(226) 70 54 32 55",
        role: "CONSULTANT",
      },
      {
        email: "editeur@bk3sconsulting.com",
        passwordHash: hash("Bk3sEditeur@2026"),
        firstName: "Salif",
        lastName: "OUEDRAOGO",
        role: "EDITOR",
      },
    ],
  });

  console.log("Création de l'entreprise de démonstration…");
  const companyOwner = await prisma.user.create({
    data: {
      email: "recruteur@entreprise-demo.bf",
      passwordHash: hash("Recruteur@2026"),
      firstName: "Clarisse",
      lastName: "ZOUNGRANA",
      phone: "(226) 76 00 25 60",
      role: "COMPANY",
      company: {
        create: {
          name: "Faso Industries SARL",
          sector: "Industrie & production",
          city: "Ouagadougou",
          address: "Zone industrielle, Kossodo",
          phone: "(226) 76 00 25 60",
          email: "rh@fasoindustries.bf",
          website: "https://www.fasoindustries.bf",
          contactName: "Clarisse ZOUNGRANA",
          description:
            "Entreprise industrielle burkinabè spécialisée dans la transformation agroalimentaire, filiale d'un groupe régional.",
          status: "APPROVED",
        },
      },
    },
    include: { company: true },
  });

  console.log("Création des offres d'emploi…");
  const now = new Date();
  const in30 = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
  const offersData = [
    {
      reference: "BK3S-2026-10001",
      title: "Comptable confirmé",
      sector: "Banque, finance & assurance",
      location: "Ouagadougou",
      contractType: "CDI" as const,
      experienceLevel: "Confirmé (3-5 ans)",
      educationLevel: "BTS / DUT / Licence",
      skills: ["Comptabilité", "Sage", "Reporting", "Fiscalité"],
      missions:
        "Tenue de la comptabilité générale et auxiliaire\nÉtablissement des états financiers\nDéclarations fiscales et sociales\nParticipation aux audits",
      profile:
        "Licence en comptabilité minimum\n3 ans d'expérience en cabinet ou entreprise\nMaîtrise de Sage et d'Excel\nRigueur et confidentialité",
      conditions: "Assurance santé prise en charge\nPrime annuelle sur objectifs",
      salary: "350 000 – 500 000 FCFA brut",
      positions: 2,
      days: 30,
    },
    {
      reference: "BK3S-2026-10002",
      title: "Développeur web full-stack",
      sector: "Informatique & numérique",
      location: "Ouagadougou (télétravail partiel)",
      contractType: "CDD" as const,
      experienceLevel: "Junior (1-3 ans)",
      educationLevel: "BTS / DUT / Licence",
      skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "Git"],
      missions:
        "Développement d'applications web internes\nMaintenance des outils existants\nRédaction de la documentation technique",
      profile:
        "Bon niveau en JavaScript/TypeScript\nExpérience avec React et Node.js\nConnaissance de PostgreSQL\nAutonomie et esprit d'équipe",
      conditions: "Télétravail 2 jours/semaine",
      salary: "À négocier selon profil",
      positions: 1,
      days: 21,
    },
    {
      reference: "BK3S-2026-10003",
      title: "Assistant(e) administratif(ve) et RH",
      sector: "Services aux entreprises",
      location: "Bobo-Dioulasso",
      contractType: "CDI" as const,
      experienceLevel: "Débutant (0-1 an)",
      educationLevel: "Baccalauréat",
      skills: ["Gestion administrative", "Accueil", "Word", "Excel", "Organisation"],
      missions:
        "Accueil physique et téléphonique\nSuivi administratif du personnel\nPréparation des dossiers RH",
      profile: "Bac minimum\nPremière expérience appréciée\nExcellent relationnel",
      conditions: null,
      salary: "Salaire selon grille + avantages",
      positions: 1,
      days: 14,
    },
    {
      reference: "BK3S-2026-10004",
      title: "Stagiaire en marketing digital",
      sector: "Communication & marketing",
      location: "Ouagadougou",
      contractType: "STAGE" as const,
      experienceLevel: "Débutant (0-1 an)",
      educationLevel: "Baccalauréat",
      skills: ["Réseaux sociaux", "Rédaction web", "Canva", "Community management"],
      missions:
        "Animation des réseaux sociaux\nCréation de visuels simples\nVeille concurrentielle",
      profile: "Étudiant(e) en communication ou marketing\nCréativité et curiosité",
      conditions: "Indemnité de stage + encadrement",
      salary: "Indemnité de stage",
      positions: 1,
      days: 25,
    },
    {
      reference: "BK3S-2026-10005",
      title: "Consultant(e) en gestion des ressources humaines",
      sector: "Services aux entreprises",
      location: "Ouagadougou",
      contractType: "CONSULTANCE" as const,
      experienceLevel: "Expérimenté (5-10 ans)",
      educationLevel: "Maîtrise / Master",
      skills: ["Conseil RH", "Droit du travail", "Paie", "Audit social", "Formation"],
      missions:
        "Réalisation d'audits sociaux\nAccompagnement des clients dans la structuration RH\nConception et animation de formations",
      profile:
        "Master en GRH ou droit social\n5 ans d'expérience minimum\nExcellentes aptitudes rédactionnelles",
      conditions: "Missions ponctuelles, récurrence garantie",
      salary: "Journalier 100 000 – 150 000 FCFA",
      positions: 1,
      days: 40,
    },
    {
      reference: "BK3S-2026-10006",
      title: "Technicien(ne) supérieur(e) maintenance industrielle",
      sector: "Industrie & production",
      location: "Koudougou",
      contractType: "CDI" as const,
      experienceLevel: "Junior (1-3 ans)",
      educationLevel: "BTS / DUT / Licence",
      skills: ["Maintenance préventive", "Électricité industrielle", "Hydraulique", "Diagnostic"],
      missions:
        "Maintenance préventive et curative des lignes de production\nDiagnostic des pannes\nSuivi des stocks de pièces de rechange",
      profile: "BTS maintenance industrielle ou équivalent\n1 à 3 ans d'expérience en environnement industriel",
      conditions: "Logement de fonction possible",
      salary: "250 000 – 350 000 FCFA brut",
      positions: 3,
      days: 45,
    },
  ];

  for (const { days, ...offerData } of offersData) {
    await prisma.jobOffer.create({
      data: {
        ...offerData,
        deadline: in30(days),
        companyId: companyOwner.company!.id,
        status: "PUBLISHED",
        publishedAt: now,
      },
    });
  }

  console.log("Création des candidats de démonstration…");
  const aline = await prisma.user.create({
    data: {
      email: "aline.candidat@demo.bf",
      passwordHash: hash("Candidat@2026"),
      firstName: "Aline",
      lastName: "KONE",
      phone: "(226) 65 67 66 58",
      role: "CANDIDATE",
      candidateProfile: {
        create: {
          title: "Comptable senior",
          summary:
            "Comptable avec 6 ans d'expérience en entreprise et en cabinet, spécialisée en comptabilité générale et reporting sous Sage.",
          skills: ["Comptabilité", "Sage", "Reporting", "Fiscalité", "Excel"],
          languages: ["Français", "Anglais"],
          experienceYears: 6,
          educationLevel: "Maîtrise / Master",
          sector: "Banque, finance & assurance",
          city: "Ouagadougou",
          availability: "IMMEDIATE",
          visibleInCvtheque: true,
          experiences: [
            { poste: "Comptable générale", entreprise: "Sahel Distribution SARL", periode: "2021 – 2026", description: "Tenue de la comptabilité complète, clôtures annuelles, formation de deux assistantes." },
            { poste: "Aide-comptable", entreprise: "Cabinet FIDUCIA", periode: "2019 – 2021", description: "Saisie, rapprochements bancaires, déclarations TVA." },
          ],
          educations: [
            { diplome: "Master Comptabilité-Finance", etablissement: "Université Norbert ZERBO, Ouagadougou", annee: "2019" },
          ],
        },
      },
    },
    include: { candidateProfile: true },
  });

  const ibrahim = await prisma.user.create({
    data: {
      email: "ibrahim.candidat@demo.bf",
      passwordHash: hash("Candidat@2026"),
      firstName: "Ibrahim",
      lastName: "SAWADOGO",
      phone: "(226) 70 12 34 56",
      role: "CANDIDATE",
      candidateProfile: {
        create: {
          title: "Développeur web full-stack",
          summary: "Développeur JavaScript orienté React/Node, 2 ans d'expérience sur des applications métier.",
          skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "Git"],
          languages: ["Français", "Mooré"],
          experienceYears: 2,
          educationLevel: "BTS / DUT / Licence",
          sector: "Informatique & numérique",
          city: "Ouagadougou",
          availability: "UNDER_NOTICE",
          visibleInCvtheque: true,
        },
      },
    },
    include: { candidateProfile: true },
  });

  // Un profil volontairement masqué de la CVthèque
  await prisma.user.create({
    data: {
      email: "fatou.candidat@demo.bf",
      passwordHash: hash("Candidat@2026"),
      firstName: "Fatoumata",
      lastName: "DIALLO",
      role: "CANDIDATE",
      candidateProfile: {
        create: {
          title: "Assistante de direction",
          summary: "Assistante de direction bilingue, 8 ans d'expérience en organisation internationale.",
          skills: ["Secrétariat", "Organisation", "Anglais", "Word", "Excel"],
          languages: ["Français", "Anglais"],
          experienceYears: 8,
          city: "Ouagadougou",
          visibleInCvtheque: false,
        },
      },
    },
  });

  console.log("Création des candidatures de démonstration…");
  const firstOffer = await prisma.jobOffer.findUniqueOrThrow({ where: { reference: "BK3S-2026-10001" } });
  const devOffer = await prisma.jobOffer.findUniqueOrThrow({ where: { reference: "BK3S-2026-10002" } });

  await prisma.application.create({
    data: {
      candidateId: aline.candidateProfile!.id,
      offerId: firstOffer.id,
      coverLetter:
        "Madame, Monsieur,\n\nFort de six années d'expérience en comptabilité générale, je suis très intéressé par ce poste. Mon mastery de Sage et ma rigueur seront des atouts pour vos équipes.\n\nCordialement,\nAline KONE",
      status: "SHORTLISTED",
    },
  });
  await prisma.application.create({
    data: { candidateId: ibrahim.candidateProfile!.id, offerId: devOffer.id, status: "RECEIVED" },
  });
  await prisma.favorite.create({
    data: { candidateId: aline.candidateProfile!.id, offerId: devOffer.id },
  });

  console.log("Création des formations et actualités…");
  await prisma.formation.createMany({
    data: [
      {
        title: "Gestion de la paie au Burkina Faso",
        theme: "Ressources humaines",
        description: "Maîtriser le calcul de la paie, les cotisations sociales et les obligations déclaratives burkinabè.",
        objectives: "Calculer un bulletin de paie conforme ; maîtriser la CNSS et l'ITS ; sécuriser les déclarations.",
        program: "Cadre légal du travail\nStructure du bulletin de paie\nCotisations CNSS et ITS\nCas pratiques et litiges fréquents",
        audience: "Responsables RH, assistantes RH, dirigeants de PME",
        trainer: "Awa TRAORE, consultante RH certifiée",
        duration: "3 jours",
        startDate: in30(20),
        location: "Ouagadougou",
        price: "150 000 FCFA / participant",
        status: "PUBLISHED",
      },
      {
        title: "Excel pour les métiers de la gestion",
        theme: "Bureautique",
        description: "Tableaux croisés dynamiques, fonctions avancées et automatisation pour gagner en efficacité.",
        objectives: "Exploiter les TCD ; automatiser les calculs ; produire des tableaux de bord.",
        program: "Rappels essentiels\nRecherches et conditions\nTCD\nTableaux de bord",
        audience: "Assistants, comptables, gestionnaires",
        trainer: "Formateur certifié MIC",
        duration: "2 jours",
        startDate: in30(35),
        location: "Ouagadougou",
        price: "90 000 FCFA / participant",
        status: "PUBLISHED",
      },
      {
        title: "Techniques de recrutement et d'entretien",
        theme: "Ressources humaines",
        description: "Structurer ses recrutements, conduire des entretiens structurés et décider objectivement.",
        objectives: "Définir un besoin ; évaluer objectivement ; éviter les biais.",
        program: "Définition du besoin\nSourcing\nEntretien structuré\nDécision et intégration",
        audience: "Managers, recruteurs internes",
        trainer: "Bertrand KABORE",
        duration: "2 jours",
        startDate: in30(50),
        location: "Bobo-Dioulasso",
        price: "120 000 FCFA / participant",
        status: "PUBLISHED",
      },
    ],
  });

  await prisma.newsArticle.createMany({
    data: [
      {
        slug: "lancement-de-la-plateforme-numerique-bk3s",
        title: "BK3S lance sa plateforme numérique de recrutement",
        category: "Actualité",
        excerpt:
          "Offres d'emploi en ligne, CVthèque sécurisée et candidatures digitalisées : le cabinet franchit une nouvelle étape de sa transformation numérique.",
        content:
          "BK Dimension 3S Consulting est fier d'annoncer le lancement de sa plateforme numérique dédiée au recrutement et à la gestion des talents.\n\nDésormais, les candidats peuvent créer leur espace personnel, déposer leur CV et postuler en ligne aux offres publiées par le cabinet et ses entreprises clientes. Les entreprises disposent d'un espace dédié pour publier leurs offres, suivre leurs candidatures et rechercher des profils dans la CVthèque.\n\nCette plateforme traduit notre engagement : rapprocher les talents et les opportunités, avec professionnalisme, sécurité et proximité.",
        status: "PUBLISHED",
        publishedAt: now,
      },
      {
        slug: "cinq-conseils-pour-un-cv-qui-retient-lattention",
        title: "5 conseils pour un CV qui retient l'attention",
        category: "Conseil RH",
        excerpt: "Un CV efficace est un CV clair, ciblé et honnête. Nos consultants partagent leurs recommandations.",
        content:
          "1. Adaptez votre CV à chaque candidature : reprenez les mots-clés de l'offre.\n2. Mettez vos réalisations en avant, pas seulement vos missions.\n3. Soignez la forme : une page à deux pages maximum, sans fautes.\n4. Mentionnez des informations vérifiables (références, dates).\n5. Actualisez régulièrement votre profil sur la plateforme : les recruteurs recherchent dans la CVthèque en continu.",
        status: "PUBLISHED",
        publishedAt: in30(-10),
      },
      {
        slug: "recrutement-ce-que-cherchent-les-employeurs-burkinabe",
        title: "Recrutement : ce que recherchent vraiment les employeurs burkinabè",
        category: "Conseil RH",
        excerpt: "Retour sur les tendances observées par nos consultants lors des derniers mandats de recrutement.",
        content:
          "Au-delà du diplôme, les employeurs recherchent de plus en plus le savoir-être : fiabilité, capacité d'adaptation et esprit d'équipe. Les compétences numériques de base sont devenues incontournables, y compris pour des postes opérationnels.\n\nNotre méthodologie 3S (Savoir, Savoir-faire, Savoir-être) permet d'évaluer ces dimensions de manière structurée, pour des recrutements durables.",
        status: "PUBLISHED",
        publishedAt: in30(-25),
      },
    ],
  });

  await prisma.serviceRequest.create({
    data: {
      name: "Jean-Baptiste SOMDA",
      organization: "Coopérative agricole du Nazinon",
      phone: "(226) 74 55 66 77",
      email: "jbsomda@coopnazinon.bf",
      service: "Montage de dossiers",
      description:
        "Nous souhaitons un accompagnement pour le montage d'un dossier de financement auprès d'un bailleur pour un projet de transformation de mangue.",
      deadline: "Sous 2 mois",
      status: "NEW",
    },
  });

  await prisma.contactMessage.create({
    data: {
      name: "Mariam OUATTARA",
      email: "m.ouattara@exemple.bf",
      phone: "(226) 78 11 22 33",
      subject: "Formation",
      message: "Bonjour, je souhaite connaître les prochaines dates de la formation en gestion de la paie. Merci.",
    },
  });

  console.log("✅ Données de démonstration créées avec succès.");
  console.log("   Admin      : admin@bk3sconsulting.com / Bk3sAdmin@2026");
  console.log("   Consultant : consultant@bk3sconsulting.com / Bk3sConsult@2026");
  console.log("   Entreprise : recruteur@entreprise-demo.bf / Recruteur@2026");
  console.log("   Candidats  : aline.candidat@demo.bf, ibrahim.candidat@demo.bf / Candidat@2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
