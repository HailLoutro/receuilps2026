# PeopleSpheres — Recueil du Besoin

Application multi-tenant de recueil de besoins SIRH.

## Architecture

```
src/
├── config/
│   ├── firebase.js                ← Credentials Firebase
│   ├── constants.js               ← Branding, types de blocs, icônes
│   └── defaultTemplate.js         ← Template initial pré-rempli (10 pages)
│
├── services/
│   ├── auth.js                    ← Firebase Auth (admins) + Firestore (clients)
│   ├── database.js                ← Firestore CRUD + cache mémoire
│   ├── storage.js                 ← Couche cache devant Firestore
│   └── export.js                  ← Export JSON & Excel (SheetJS)
│
├── context/
│   └── AppContext.jsx             ← State global + debounce save + backup/restore
│
├── components/
│   ├── ui/index.jsx               ← Btn, Inp, Sel, Card, Modal, Empty, FileUpload
│   ├── layout/LoadingScreen.jsx
│   └── editor/
│       ├── InlineTable.jsx        ← Tableau éditable (textarea + CellDisplay)
│       ├── CellDisplay.jsx        ← Texte principal + sous-texte italique
│       ├── BlockEditor.jsx        ← Éditeur de bloc (drag & drop + preview)
│       ├── BlockPreview.jsx       ← Rendu aperçu d'un bloc
│       └── TableBlockEditor.jsx   ← Config admin des colonnes d'un tableau
│
├── pages/
│   ├── LoginPage.jsx              ← Connexion admin (Firebase Auth) / client (Firestore)
│   ├── admin/
│   │   ├── AdminPanel.jsx         ← Shell admin (sidebar + routing)
│   │   ├── AdminClients.jsx       ← CRUD clients (ne change pas le user courant)
│   │   ├── AdminTemplate.jsx      ← Éditeur Notion-style (sans groupes)
│   │   ├── AdminExport.jsx        ← Export recueils (JSON + Excel)
│   │   ├── AdminBackups.jsx       ← Sauvegardes / restauration du template
│   │   └── AdminAdmins.jsx        ← Gestion comptes admin
│   └── client/
│       └── ClientRecueil.jsx      ← Vue client (sidebar, progress, auto-save)
│
├── App.jsx                        ← React Router
├── main.jsx                       ← Point d'entrée
└── index.css                      ← Tailwind
```

## Corrections appliquées

| # | Problème | Solution |
|---|----------|----------|
| 1 | Créer un client changeait l'interface en mode client | `sC`/`refreshClients` ne touche plus le state `user` |
| 2 | Clients pas enregistrés comme users Firebase | Clients stockés dans Firestore `clients/{slug}` avec credentials propres |
| 3 | Pas de sous-texte dans les cellules | `textarea` + `CellDisplay` : Entrée → sous-texte en italique |
| 4 | Groupes confus (Configuration, Processus...) | Supprimés — liste de pages plate avec titre + icône uniquement |
| 5 | Pas de sauvegarde du template | Section "Sauvegardes" : snapshot + restauration (max 20) |
| 6 | Export invisible | Section "Export recueils" dans la sidebar admin avec aperçu |
| 7 | Images uniquement par URL | Composant `FileUpload` avec `FileReader.readAsDataURL()` |
| 8 | Pas de preview des blocs | Bouton 👁 par bloc + bouton "Prévisualiser" pour la page entière |

## Guide de modification

| Besoin | Fichier |
|--------|---------|
| Branding | `config/constants.js` → BRAND |
| Ajouter un type de bloc | `config/constants.js` + `BlockEditor.jsx` |
| Données par défaut | `config/defaultTemplate.js` |
| Type de colonne | `config/constants.js` + `InlineTable.jsx` |
| Couleurs | `tailwind.config.js` |
| Règles Firestore | `firestore.rules` |
| Format d'export | `services/export.js` |
| Composant UI | `components/ui/index.jsx` |

## Stack

- **Frontend** : React 18 + Vite + Tailwind CSS + React Router
- **Auth admin** : Firebase Authentication (email/password)
- **Auth client** : Firestore (slug + username + password)
- **Database** : Cloud Firestore + cache mémoire
- **Hébergement** : Firebase Hosting ou Cloudflare Pages
- **Export** : SheetJS (xlsx) côté client

## Setup

### 1. Firebase

1. Créer un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer **Authentication** → Email/Password
3. Activer **Cloud Firestore** (mode production)
4. Copier la config dans `.env` (voir `.env.example`)
5. Déployer les règles : `firebase deploy --only firestore:rules`

### 2. Premier admin

Dans la console Firebase :
- **Authentication** → Add user → email + password
- **Firestore** → `users/{uid}` → `{ role: "admin", name: "Admin", createdAt: "..." }`

### 3. Dev local

```bash
npm install
cp .env.example .env
npm run dev
```

### 4. Déploiement

```bash
# Firebase
npm run deploy:firebase

# Cloudflare Pages
npm run deploy:cloudflare
```

## Firestore

```
users/{uid}                   → { role: "admin", name, createdAt }
template/current              → { pages: [...], updatedAt }
clients/{slug}                → { name, slug, username, password, createdAt }
clients/{slug}/data/recueil   → { [pageId]: { [blockId]: { rows, extraCols } } }
meta/backups                  → { list: [{ id, label, template, createdAt }] }
```

## URLs

| Route | Description |
|-------|-------------|
| `/admin/login` | Login admin |
| `/admin` | Panel admin (protégé) |
| `/client` | Login client |
| `/client/:slug` | Login client (slug pré-rempli) |
| `/client/app` | Recueil client (protégé) |
