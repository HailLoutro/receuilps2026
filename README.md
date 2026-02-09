# PeopleSpheres — Recueil du Besoin

Application multi-tenant de recueil de besoins SIRH.

## Architecture

```
src/
├── config/                         ← Configuration (modifier ici en priorité)
│   ├── firebase.js                 ← Credentials Firebase
│   ├── constants.js                ← Branding, types de blocs, icônes
│   └── defaultTemplate.js          ← Template initial pré-rempli
│
├── services/                       ← Couche données (Firebase)
│   ├── auth.js                     ← Firebase Auth (login, createUser, onAuthChange)
│   ├── database.js                 ← Firestore CRUD (template, clients, données)
│   └── export.js                   ← Export JSON & Excel
│
├── context/
│   └── AppContext.jsx              ← State global + actions
│
├── components/
│   ├── ui/index.jsx                ← Btn, Inp, Sel, Card, Modal, Empty
│   ├── layout/LoadingScreen.jsx    ← Écran de chargement
│   └── editor/
│       ├── InlineTable.jsx         ← Tableau éditable réutilisable
│       ├── BlockEditor.jsx         ← Éditeur de bloc (drag & drop)
│       └── TableBlockEditor.jsx    ← Config colonnes d'un tableau
│
├── pages/
│   ├── LoginPage.jsx               ← Écran de connexion (admin + client)
│   ├── admin/
│   │   ├── AdminPanel.jsx          ← Shell admin (sidebar + routing)
│   │   ├── AdminClients.jsx        ← CRUD clients
│   │   ├── AdminTemplate.jsx       ← Éditeur de template Notion-style
│   │   ├── AdminAdmins.jsx         ← Gestion comptes admin
│   │   └── AdminClientView.jsx     ← Voir réponses + export
│   └── client/
│       └── ClientRecueil.jsx       ← Vue client (remplir le recueil)
│
├── App.jsx                         ← Routeur principal
├── main.jsx                        ← Point d'entrée React
└── index.css                       ← Tailwind CSS
```

## Guide de modification

| Besoin                        | Fichier à modifier                |
|-------------------------------|-----------------------------------|
| Changer le branding           | `config/constants.js` → BRAND     |
| Ajouter un type de bloc       | `config/constants.js` + `BlockEditor.jsx` |
| Modifier les données par défaut| `config/defaultTemplate.js`      |
| Ajouter un type de colonne    | `config/constants.js` + `InlineTable.jsx` |
| Changer les couleurs           | `tailwind.config.js` → colors.brand |
| Modifier les règles Firestore  | `firestore.rules`                |
| Ajouter un format d'export     | `services/export.js`             |
| Ajouter un composant UI        | `components/ui/index.jsx`        |

## Stack technique

- **Frontend** : React 18 + Vite + Tailwind CSS
- **Auth** : Firebase Authentication (email/password)
- **Base de données** : Cloud Firestore
- **Hébergement** : Firebase Hosting ou Cloudflare Pages
- **Export** : SheetJS (xlsx) côté client

## Setup

### 1. Firebase

1. Créer un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer **Authentication** → Email/Password
3. Activer **Cloud Firestore** (mode production)
4. Copier la config dans `.env` (voir `.env.example`)
5. Déployer les règles Firestore : `firebase deploy --only firestore:rules`

### 2. Premier admin

Créez le premier admin directement dans la console Firebase :
- **Authentication** → Add user → email + password
- **Firestore** → collection `users` → doc avec l'UID → `{ role: "admin", name: "Admin", slug: null, createdAt: "..." }`

### 3. Développement local

```bash
npm install
cp .env.example .env    # Remplir avec vos credentials
npm run dev             # http://localhost:5173
```

### 4. Déploiement

**Firebase Hosting :**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting    # Choisir "dist" comme dossier
npm run deploy:firebase
```

**Cloudflare Pages :**
```bash
npm install -g wrangler
wrangler login
npm run deploy:cloudflare
```

Ou connecter le repo GitHub à Cloudflare Pages (build command: `npm run build`, output: `dist`).

## Structure Firestore

```
users/{uid}                  → { role, name, slug, createdAt }
template/current             → { pages: [...], updatedAt }
clients/{slug}               → { name, slug, createdAt }
clients/{slug}/data/recueil  → { [pageId]: { [blockId]: { rows: [...] } } }
```

## URLs

| Route             | Description              |
|--------------------|--------------------------|
| `/admin`           | Login admin              |
| `/client`          | Login client (saisir slug) |
| `/client/:slug`    | Login client (slug pré-rempli) |
