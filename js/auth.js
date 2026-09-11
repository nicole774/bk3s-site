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
  var USERS_KEY = "bk3s_users";

  // Comptes de démonstration. En clair : uniquement pour la démo.
  var DEFAULT_USERS = [
    { email: "admin@bk3sconsulting.com", password: "demo1234", name: "Administrateur" },
    { email: "candidat@bk3sconsulting.com", password: "demo1234", name: "Candidat démo" }
  ];

  // Comptes par défaut + comptes créés via register.html (stockés en local).
  function allUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      var extra = raw ? JSON.parse(raw) : [];
      return DEFAULT_USERS.concat(Array.isArray(extra) ? extra : []);
    } catch (e) {
      return DEFAULT_USERS.slice();
    }
  }

  function findUser(mail) {
    var users = allUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === mail) return users[i];
    }
    return null;
  }

  // Crée un compte (démo). Retourne la session, ou null si l'email existe déjà.
  function register(name, email, password) {
    var mail = String(email || "").trim().toLowerCase();
    if (!mail || !password || findUser(mail)) return null;

    var user = { email: mail, password: password, name: String(name || "").trim() || mail };
    try {
      var raw = localStorage.getItem(USERS_KEY);
      var extra = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(extra)) extra = [];
      extra.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(extra));
    } catch (e) {
      return null;
    }

    var session = { email: user.email, name: user.name, loggedAt: new Date().toISOString() };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) { /* stockage indisponible : session non persistée */ }
    return session;
  }

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
    var user = findUser(mail);
    if (!user || user.password !== password) return null;

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

  return { currentUser: currentUser, login: login, register: register, logout: logout, requireAuth: requireAuth, escapeHtml: escapeHtml };
})();
