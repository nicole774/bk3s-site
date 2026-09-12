// ==========================================================================
// BK DIMENSIONS 3S CONSULTING — script principal
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  // --- Menu mobile ---
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".main-nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("open");
      var expanded = nav.classList.contains("open");
      burger.setAttribute("aria-expanded", expanded);
    });
    // Fermer le menu quand on clique un lien (mobile)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  // --- Marquer le lien actif selon la page courante ---
  var current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });

  // --- Révélation au scroll ---
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  // --- Formulaire de contact (envoi réel via Formspree) ---
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      var name = form.querySelector("#name").value.trim();
      if (!name) return;

      status.textContent = "Envoi en cours...";
      status.classList.remove("ok");

      var data = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = "Merci " + name + ", votre message a bien été envoyé !";
            status.classList.add("ok");
            form.reset();
          } else {
            status.textContent = "Une erreur est survenue. Vérifiez que le formulaire Formspree est bien configuré.";
          }
        })
        .catch(function () {
          status.textContent = "Impossible d'envoyer le message pour le moment. Contactez-nous directement au (226) 70 94 60 96.";
        });
    });
  }
});
