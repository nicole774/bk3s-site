# Guide de démarrage — Site BK Dimension 3S Consulting

## 1. Structure du projet

```
bk3s-site/
├── index.html        → Page d'accueil
├── apropos.html       → Page "À propos"
├── activites.html      → Page "Nos activités" (les 8 domaines)
├── contact.html        → Page "Contact" (formulaire + coordonnées)
├── css/style.css       → Tous les styles (couleurs, polices, mise en page)
├── js/main.js          → Menu mobile, animations, formulaire
├── js/footer.js        → Le pied de page (identique sur toutes les pages)
└── assets/logo.jpeg    → Votre logo
```

## 2. Voir le site en local

Le plus simple : double-cliquez sur `index.html`, il s'ouvre dans votre navigateur.
Pour naviguer correctement entre les pages (recommandé), ouvrez le dossier avec
un petit serveur local : si vous avez Python installé, dans le dossier du projet :

```
python3 -m http.server 8000
```

puis ouvrez `http://localhost:8000` dans votre navigateur.

## 3. Modifier le contenu

- **Textes** : ouvrez le fichier `.html` de la page concernée, cherchez le texte
  à changer entre les balises (ex. `<h1>...</h1>`, `<p>...</p>`) et remplacez-le.
- **Couleurs** : tout se règle en un seul endroit, en haut de `css/style.css`,
  dans le bloc `:root { --navy: ...; --gold: ...; }`.
- **Footer (pied de page)** : modifiez `js/footer.js`, le changement s'applique
  automatiquement sur les 4 pages.
- **Logo** : remplacez `assets/logo.jpeg` par une meilleure résolution si vous
  en avez une (idéalement un PNG avec fond transparent).

## 4. Le formulaire de contact

Actuellement, le formulaire de la page Contact **simule** l'envoi (il n'envoie
pas encore de vrai email). Pour qu'il fonctionne réellement, deux options simples :

- **Formspree** (gratuit, sans code serveur) : créez un compte sur formspree.io,
  récupérez votre URL de formulaire, et remplacez l'action du `<form>` dans
  `contact.html` par cette URL.
- **EmailJS** : similaire, avec un peu plus de personnalisation possible.

Dites-moi si vous voulez qu'on le fasse ensemble, je peux vous guider pas à pas.

## 5. Photos réelles

J'ai volontairement laissé les sections d'activités sans photos pour l'instant
(pour rester dans le respect des droits d'auteur sur les images). Ajoutez vos
propres photos d'équipe, de bureaux ou d'événements dans le dossier `images/`,
puis référencez-les avec une balise `<img src="images/mon-fichier.jpg">`.

## 6. Mettre le site en ligne

Options simples et économiques :
- **Nom de domaine** : `bk3sconsulting.com` est déjà mentionné sur votre affiche
  — vérifiez sa disponibilité et achetez-le si nécessaire (ex. via un registrar
  local ou international).
- **Hébergement gratuit/simple** : Netlify ou Vercel (glisser-déposer le dossier,
  aucune configuration serveur nécessaire) — parfait pour un site comme celui-ci.
- **Hébergement classique** : tout hébergeur avec accès FTP fonctionne aussi
  (uploadez simplement tout le dossier `bk3s-site`).

Je peux vous guider étape par étape sur l'option que vous choisirez.

## 7. Prochaines étapes possibles

- Ajouter une section "témoignages clients"
- Ajouter une page "Offres d'emploi" avec candidatures en ligne
- Ajouter le formulaire réel (Formspree/EmailJS)
- Ajouter vos vraies photos
- Optimiser le référencement (Google) avec du contenu plus détaillé
