// ==========================================================================
// Footer commun injecté sur toutes les pages.
// Astuce : modifiez ce fichier une seule fois pour changer le footer partout.
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  var footer = document.getElementById("footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="assets/logo.jpeg" alt="Logo BK Dimension 3S Consulting" />
            <strong style="color:#fff; font-family: var(--font-display);">BK Dimension 3S Consulting</strong>
          </div>
          <p style="color:rgba(255,255,255,0.65); font-size:0.9rem; max-width:320px;">
            BK Dimension 3S Consulting vous accompagne avec professionnalisme, expertise
            et engagement pour répondre à vos besoins et propulser vos projets.
          </p>
          <p class="footer-tagline">Ensemble, construisons votre succès !</p>
        </div>

        <div>
          <h4>Navigation</h4>
          <ul>
            <li><a href="index.html">Accueil</a></li>
            <li><a href="apropos.html">À propos</a></li>
            <li><a href="activites.html">Nos activités</a></li>
            <li><a href="offres.html">Offres d'emploi</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="login.html">Espace client</a></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>Siège social — Ouagadougou, Burkina Faso</li>
            <li>(226) 70 94 60 96</li>
            <li>(226) 70 54 32 55</li>
            <li>contact@bk3sconsulting.com</li>
            <li>www.bk3sconsulting.com</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© <span id="year"></span> BK Dimension 3S Consulting — RCCM BF-OUA-01-2022-B13-11422 · IFU 00244687M</span>
        <span>Solutions · Synergie · Succès</span>
      </div>
    </div>
  `;

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
