// ==========================================================================
// BK DIMENSIONS 3S CONSULTING — Offres d'emploi dynamiques
//
// PRINCIPE : les offres sont gérées dans un Google Sheet par l'équipe
// (aucun code à toucher pour ajouter/retirer une offre). Ce script va
// chercher le contenu du Sheet et construit les cartes d'offres.
//
// ------------------------------------------------------------------------
// CONFIGURATION — à faire une seule fois (voir le guide fourni) :
// 1. Créez un Google Sheet avec les colonnes, dans cet ordre exact :
//    Titre | Contrat | Lieu | Categorie | Description | Reference | DateLimite | Statut
// 2. Menu Fichier > Partager > Publier sur le Web > format CSV > Publier.
// 3. Collez l'URL obtenue ci-dessous, entre les guillemets.
// ------------------------------------------------------------------------

const SHEET_CSV_URL = ""; // <-- Collez ici l'URL "Publier sur le Web" (format CSV)

// Offres affichées tant que SHEET_CSV_URL n'est pas configurée, ou si la
// connexion au Sheet échoue (garde le site fonctionnel dans tous les cas).
const DEFAULT_JOBS = [
  {
    titre: "Chargé(e) de clientèle",
    contrat: "CDI",
    lieu: "Ouagadougou",
    categorie: "Commercial",
    description: "Développement du portefeuille clients, suivi commercial et reporting pour une entreprise partenaire du secteur des services.",
    reference: "BK3S-2026-014",
    dateLimite: "15 septembre 2026",
    statut: "ouverte"
  },
  {
    titre: "Assistant(e) administratif(ve)",
    contrat: "CDD",
    lieu: "Ouagadougou",
    categorie: "Administration",
    description: "Gestion du courrier, appui à la constitution de dossiers administratifs, accueil et suivi des rendez-vous.",
    reference: "BK3S-2026-015",
    dateLimite: "5 septembre 2026",
    statut: "ouverte"
  },
  {
    titre: "Stagiaire RH (poste pourvu)",
    contrat: "Stage",
    lieu: "Ouagadougou",
    categorie: "Ressources humaines",
    description: "Ce poste n'est plus disponible. Exemple d'offre fermée conservée à titre indicatif.",
    reference: "BK3S-2026-009",
    dateLimite: "",
    statut: "fermee"
  }
];

// --- Parseur CSV simple (gère les champs entre guillemets contenant des virgules) ---
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') { field += '"'; i++; }
      else if (char === '"') { inQuotes = false; }
      else { field += char; }
    } else {
      if (char === '"') inQuotes = true;
      else if (char === ",") { row.push(field); field = ""; }
      else if (char === "\n" || char === "\r") {
        if (field !== "" || row.length > 0) { row.push(field); rows.push(row); row = []; field = ""; }
        if (char === "\r" && next === "\n") i++;
      } else { field += char; }
    }
  }
  if (field !== "" || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function rowsToJobs(rows) {
  if (!rows.length) return [];
  const dataRows = rows.slice(1).filter(function (r) { return r.some(function (c) { return c.trim() !== ""; }); });
  return dataRows.map(function (r) {
    return {
      titre: (r[0] || "").trim(),
      contrat: (r[1] || "").trim(),
      lieu: (r[2] || "").trim(),
      categorie: (r[3] || "").trim(),
      description: (r[4] || "").trim(),
      reference: (r[5] || "").trim(),
      dateLimite: (r[6] || "").trim(),
      statut: (r[7] || "ouverte").trim().toLowerCase()
    };
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jobCardHTML(job) {
  const closed = job.statut && job.statut.indexOf("ferm") === 0 === false
    ? job.statut.toLowerCase().indexOf("ferm") !== -1
    : false;
  const isClosed = job.statut && job.statut.toLowerCase().indexOf("ferm") !== -1;
  const cardClass = "job-card reveal" + (isClosed ? " job-closed" : "");
  const deadlineText = job.dateLimite
    ? (job.reference ? "Réf. " + escapeHtml(job.reference) + " — Date limite : " + escapeHtml(job.dateLimite) : "Date limite : " + escapeHtml(job.dateLimite))
    : (isClosed ? "Candidatures closes" : (job.reference ? "Réf. " + escapeHtml(job.reference) : ""));

  const applyLink = "candidature.html?poste=" + encodeURIComponent(job.titre) + "&ref=" + encodeURIComponent(job.reference || "");

  return (
    '<div class="' + cardClass + '">' +
      '<div class="job-main">' +
        '<div class="job-meta">' +
          (job.contrat ? '<span class="job-badge contract">' + escapeHtml(job.contrat) + '</span>' : "") +
          (job.lieu ? '<span class="job-badge">' + escapeHtml(job.lieu) + '</span>' : "") +
          (job.categorie ? '<span class="job-badge">' + escapeHtml(job.categorie) + '</span>' : "") +
        '</div>' +
        '<h3>' + escapeHtml(job.titre) + '</h3>' +
        (job.description ? '<p class="job-desc">' + escapeHtml(job.description) + '</p>' : "") +
        (deadlineText ? '<p class="job-deadline">' + deadlineText + '</p>' : "") +
      '</div>' +
      (isClosed ? "" : '<a href="' + applyLink + '" class="btn btn-gold">Postuler</a>') +
    '</div>'
  );
}

function renderJobs(jobs) {
  const container = document.getElementById("job-list");
  if (!container) return;
  if (!jobs.length) {
    container.innerHTML = '<p class="job-loading">Aucune offre publiée pour le moment. Revenez bientôt !</p>';
    return;
  }
  container.innerHTML = jobs.map(jobCardHTML).join("");

  // Réactive les animations d'apparition pour les cartes injectées dynamiquement
  var reveals = container.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("job-list");
  if (!container) return;

  if (!SHEET_CSV_URL) {
    // Pas encore configuré : on affiche les offres par défaut.
    renderJobs(DEFAULT_JOBS);
    return;
  }

  fetch(SHEET_CSV_URL)
    .then(function (res) {
      if (!res.ok) throw new Error("Réponse réseau invalide");
      return res.text();
    })
    .then(function (csvText) {
      var jobs = rowsToJobs(parseCSV(csvText));
      renderJobs(jobs.length ? jobs : DEFAULT_JOBS);
    })
    .catch(function () {
      // En cas d'échec (Sheet non public, URL invalide...), on ne casse pas
      // le site : on retombe sur les offres par défaut.
      renderJobs(DEFAULT_JOBS);
    });
});
