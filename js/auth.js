// ==========================================================================
// BK DIMENSIONS 3S CONSULTING — authentification (démo, sans serveur)
//
// ATTENTION : ce site est hébergé en statique (aucun backend), donc cette
// authentification est purement côté navigateur et NE protège RIEN de
// vraiment confidentiel (les mots de passe et la logique sont visibles
// dans le code source). Pour un vrai espace client sécurisé, brancher un
// service comme Supabase Auth ou Firebase Auth.
//
// Comptes de démonstration :
//   admin@bk3sconsulting.com / demo1234
//   candidat@bk3sconsulting.com / demo1234
// ==========================================================================

var BK3S_AUTH = (function () {
  var SESSION_KEY = "bk3s_session";

  // Comptes de démonstration. En clair : uniquement pour la démo.
  var USERS = [
    { email: "admin@bk3sconsulting.com", password: "demo1234", name: "Administrateur" },
    { email: "candidat@bk3sconsulting.com", password: "demo1234", name: "Candidat démo" }
  ];

  function currentUser() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function login(email, password) {
    var mail = String(email || "").trim().toLowerCase();
    var user = null;
    for (var i = 0; i < USERS.length; i++) {
      if (USERS[i].email === mail && USERS[i].password === password) {
        user = USERS[i];
        break;
      }
    }
    if (!user) return null;

    var session = { email: user.email, name: user.name, loggedAt: new Date().toISOString() };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) { /* stockage indisponible : session non persistée */ }
    return session;
  }

  function logout() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* rien à faire */ }
  }

  // À inclure sur les pages protégées : redirige vers login.html si non connecté.
  function requireAuth() {
    if (!currentUser()) {
      window.location.replace("login.html");
    }
  }

  // Échappe le texte avant insertion dans le DOM (prudence de base).
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  return { currentUser: currentUser, login: login, logout: logout, requireAuth: requireAuth, escapeHtml: escapeHtml };
})();
