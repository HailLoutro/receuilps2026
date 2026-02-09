# Recueil du Besoin — PeopleSpheres

Application web modulaire pour le recueil des besoins SIRH Core RH.

## 🏗 Architecture

```
src/
├── config/                 ← ⚙️ CONFIGURATION (modifier ici en priorité)
│   ├── options.js          ← Listes déroulantes, constantes, branding
│   ├── defaults.js         ← Données pré-remplies par défaut
│   └── sections.js         ← Navigation (ajouter/supprimer des sections)
│
├── context/
│   └── AppContext.jsx       ← State centralisé + auto-save
│
├── components/
│   ├── ui/
│   │   └── index.jsx        ← Composants réutilisables (Select, Badge, DataTable...)
│   └── layout/
│       ├── Sidebar.jsx      ← Barre latérale avec navigation
│       └── TopBar.jsx       ← Barre supérieure
│
├── sections/                ← 📄 UNE SECTION = UN FICHIER
│   ├── index.js             ← Registre (mappe ID → composant)
│   ├── Accueil.jsx          ← Dashboard + progression
│   ├── Roles.jsx            ← 1. Rôles & Accès
│   ├── Features.jsx         ← 2. Accès fonctionnalités
│   ├── Profile.jsx          ← 3a. Profil utilisateur
│   ├── Creation.jsx         ← 3b. Création utilisateur
│   ├── Processes.jsx        ← 4. Processus & Workflows
│   ├── Automations.jsx      ← 5. Automatisations
│   ├── Groups.jsx           ← 5b. Groupes
│   ├── Widgets.jsx          ← 6. Page d'accueil & Templates
│   ├── Documents.jsx        ← 6b. Modèles de documents
│   ├── DocBase.jsx          ← 7. Base documentaire
│   └── PSO.jsx              ← 8. PSO
│
└── App.jsx                  ← Shell principal
```

## 🔧 Comment modifier

### Ajouter une option dans une liste déroulante
→ Éditez `src/config/options.js`

### Ajouter/modifier des données pré-remplies
→ Éditez `src/config/defaults.js`

### Ajouter une nouvelle section
1. Créez `src/sections/MaSection.jsx`
2. Ajoutez l'entrée dans `src/config/sections.js`
3. Importez et mappez dans `src/sections/index.js`

### Modifier le branding
→ Éditez `BRAND` dans `src/config/options.js`

### Ajouter une colonne à un tableau
→ Les tableaux utilisent le composant `<DataTable>` — ajoutez un objet dans le tableau `columns` de la section concernée.

### Modifier le composant DataTable
→ `src/components/ui/index.jsx` — le composant `DataTable` supporte les types : `text`, `select`, `check`, `badge`, `permission`, `custom`

## 🚀 Déploiement

### Firebase Hosting
```bash
npm create vite@latest recueil -- --template react
cd recueil
# Copiez le dossier src/
npm install lucide-react
npm run build
firebase deploy --only hosting
```

### Cloudflare Pages
```bash
npm run build
# Déployez le dossier dist/ sur Cloudflare Pages
```

### Multi-tenant (Firebase Auth + Firestore)
Pour gérer plusieurs clients :
1. Ajoutez Firebase Auth (`firebase/auth`)
2. Remplacez `window.storage` par Firestore
3. Chaque client aura son propre document dans une collection `recueils/`
