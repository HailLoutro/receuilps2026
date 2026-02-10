// ━━━ DEFAULT TEMPLATE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// CONVENTION DE PROPAGATION DES RÔLES :
//
//   roleSource: true           → Ce tableau est la SOURCE des rôles (colonne "name")
//   roleCols: "check"          → Ajouter dynamiquement 1 colonne check par rôle
//   roleCols: "select:opts"    → Ajouter dynamiquement 1 colonne select par rôle (opts séparées par |)
//   roleOptions: true          → Les colonnes select de ce tableau incluent les rôles en options
//

export default function buildDefaultTemplate() {
  return { pages: [

    // ═══ ACCUEIL ═══════════════════════════════════════════════
    { id: "p_acc", title: "Accueil", icon: "Home", blocks: [
      { id: "b1", type: "heading", content: { title: "Bienvenue sur votre espace de configuration Core RH", subtitle: "Ce document sert de base pour configurer votre SIRH PeopleSpheres." } },
      { id: "b2", type: "text", content: { text: "Nous vous conseillons de réaliser ce recueil en plusieurs fois afin de vous laisser le temps de projeter vos processus et situations RH." } },
      { id: "b3", type: "info", content: { text: "**Conseil :** Appuyez-vous sur votre consultant Socle PeopleSpheres, le centre de support, et le parcours eLearning dans votre espace PeopleSpheres Academy.", variant: "tip" } },
    ] },

    // ═══ 1. RÔLES & ACCÈS (SOURCE) ═══════════════════════════
    { id: "p_roles", title: "1. Rôles & Accès", icon: "Shield", blocks: [
      { id: "br1", type: "heading", content: { title: "Rôles & Accès aux champs", subtitle: "Définissez les rôles nécessaires pour votre organisation" } },
      { id: "br2", type: "info", content: { text: "**Questions :** Qui valide des formulaires ? Qui voit/modifie les données ? Qui fait des exports ? Les rôles définis ici seront automatiquement propagés dans les autres sections.", variant: "info" } },
      { id: "br3", type: "table", content: {
        title: "Définition des rôles",
        roleSource: true,  // ← Les noms de rôles sont extraits d'ici
        allowAddRows: true,
        allowAddCols: true,
        columns: [
          { key: "name", label: "Nom du rôle", type: "text", minWidth: "160px" },
          { key: "see", label: "Voir données", type: "select", minWidth: "100px", options: "Oui, Non" },
          { key: "feat", label: "Fonctionnalités", type: "select", minWidth: "100px", options: "Oui, Non" },
          { key: "val", label: "Valider processus", type: "select", minWidth: "100px", options: "Oui, Non" },
          { key: "assign", label: "Assignation", type: "text", minWidth: "200px" },
          { key: "pop", label: "Population", type: "text", minWidth: "140px" },
          { key: "sens", label: "Sensibilité", type: "select", minWidth: "140px", options: "Non sensibles, Considérées sensibles, Sensibles" },
        ],
        defaultRows: [
          { _id: "r1", name: "Collaborateur", see: "Oui", feat: "Oui", val: "Non", assign: "Tous", pop: "Tous", sens: "Non sensibles" },
          { _id: "r2", name: "Manager", see: "Oui", feat: "Oui", val: "Oui", assign: "Responsable direct", pop: "", sens: "Sensibles" },
          { _id: "r3", name: "RH", see: "Oui", feat: "Oui", val: "Oui", assign: "Admin.consultant", pop: "Tous", sens: "Sensibles" },
          { _id: "r4", name: "Assistant(e) RH", see: "Oui", feat: "Oui", val: "Oui", assign: "Admin.consultant", pop: "Tous", sens: "Sensibles" },
        ],
      } },
    ] },

    // ═══ 2. ACCÈS FONCTIONNALITÉS (REÇOIT LES RÔLES EN COLONNES CHECK) ═══
    { id: "p_feat", title: "2. Accès fonctionnalités", icon: "Settings", blocks: [
      { id: "bf1", type: "heading", content: { title: "Accès aux fonctionnalités", subtitle: "Matrice de permissions par rôle" } },
      { id: "bf2", type: "info", content: { text: "**Les colonnes de rôles sont ajoutées automatiquement** depuis la section \"Rôles & Accès\".", variant: "info" } },
      { id: "bf3", type: "table", content: {
        title: "Permissions",
        roleCols: "check",  // ← Ajoute 1 colonne check par rôle
        allowAddRows: true,
        columns: [
          { key: "perm", label: "Permission / Fonctionnalité", type: "text", minWidth: "320px" },
        ],
        defaultRows: [
          { _id: "f1", perm: "Accéder à l'encart Actions" },
          { _id: "f2", perm: "Visualiser les actualités" },
          { _id: "f3", perm: "Accéder à l'organigramme" },
          { _id: "f4", perm: "Déclencher formulaire self-service" },
          { _id: "f5", perm: "Accéder à Mon équipe (N-1)" },
          { _id: "f6", perm: "Créer des exports" },
          { _id: "f7", perm: "Réaliser des imports" },
          { _id: "f8", perm: "Gérer les droits d'accès" },
        ],
      } },
    ] },

    // ═══ 3a. PROFIL UTILISATEUR (REÇOIT LES RÔLES EN COLONNES SELECT) ═══
    { id: "p_prof", title: "3a. Profil utilisateur", icon: "Users", blocks: [
      { id: "bp1", type: "heading", content: { title: "Profil de l'utilisateur", subtitle: "Champs du profil et permissions par rôle" } },
      { id: "bp2", type: "info", content: { text: "**Conseil :** Très peu de données doivent être publiques (Prénom, Nom, e-mail pro, téléphone pro, site).", variant: "tip" } },
      { id: "bp3", type: "table", content: {
        title: "Champs du profil",
        roleCols: "select:Modifier|Voir|Masquer",  // ← Ajoute 1 colonne select par rôle
        allowAddRows: true,
        allowAddCols: true,
        columns: [
          { key: "cat", label: "Catégorie", type: "select", minWidth: "130px", options: "Identité, Contact pro, Contrat et carrière, CV & formation, Perso, Rémunération, Organisation" },
          { key: "field", label: "Champ", type: "text", minWidth: "160px" },
          { key: "subfield", label: "Sous-champ", type: "text", minWidth: "120px" },
          { key: "type", label: "Type", type: "select", minWidth: "120px", options: "Texte court, Texte long, Date, Nombre, Liste, Composite, Hiérarchie, Image, Fichier, Devise" },
          { key: "present", label: "Présent", type: "check", minWidth: "70px" },
          { key: "public", label: "Public", type: "check", minWidth: "70px" },
          { key: "sens", label: "Sensibilité", type: "select", minWidth: "140px", options: "Non sensibles, Considérées sensibles, Sensibles" },
        ],
        defaultRows: [
          { _id: "pf1", cat: "Identité", field: "Nom", subfield: "", type: "Texte court", present: "Oui", public: "Oui", sens: "Non sensibles" },
          { _id: "pf2", cat: "Identité", field: "Prénom", subfield: "", type: "Texte court", present: "Oui", public: "Oui", sens: "Non sensibles" },
          { _id: "pf3", cat: "Identité", field: "Matricule", subfield: "", type: "Texte court", present: "Oui", public: "Non", sens: "Considérées sensibles" },
          { _id: "pf4", cat: "Contact pro", field: "E-mail pro", subfield: "", type: "Texte court", present: "Oui", public: "Oui", sens: "Considérées sensibles" },
          { _id: "pf5", cat: "Contrat et carrière", field: "Embauche", subfield: "Date initiale", type: "Date", present: "Oui", public: "Non", sens: "Considérées sensibles" },
          { _id: "pf6", cat: "Rémunération", field: "Rémunération", subfield: "", type: "Devise", present: "Oui", public: "Non", sens: "Sensibles" },
        ],
      } },
    ] },

    // ═══ 4. PROCESSUS (REÇOIT LES RÔLES EN OPTIONS DE SELECT) ═══
    { id: "p_proc", title: "4. Processus", icon: "FileText", blocks: [
      { id: "bpr1", type: "heading", content: { title: "Processus & Workflows", subtitle: "Formulaires et circuits de validation" } },
      { id: "bpr2", type: "info", content: { text: "**Conseil :** Quels processus entraînent le plus de doubles saisies ? Les rôles apparaissent automatiquement dans les listes déroulantes.", variant: "tip" } },
      { id: "bpr3", type: "table", content: {
        title: "Formulaires standards",
        roleOptions: true,  // ← Les selects Initiateur/Validateur listent les rôles
        allowAddRows: true,
        columns: [
          { key: "name", label: "Nom du formulaire", type: "text", minWidth: "220px" },
          { key: "desc", label: "Description", type: "text", minWidth: "200px" },
          { key: "init", label: "Initiateur", type: "select", minWidth: "130px", options: "" },
          { key: "v1", label: "Validateur 1", type: "select", minWidth: "130px", options: "" },
          { key: "v2", label: "Validateur 2", type: "select", minWidth: "130px", options: "" },
          { key: "keep", label: "Conserver", type: "check", minWidth: "80px" },
          { key: "notes", label: "Remarques", type: "text", minWidth: "200px" },
        ],
        defaultRows: [
          { _id: "p1", name: "Changement d'adresse", desc: "Modifier adresse personnelle", init: "", v1: "", v2: "", keep: "Oui", notes: "" },
          { _id: "p2", name: "Domiciliation bancaire", desc: "MAJ coordonnées bancaires", init: "", v1: "", v2: "", keep: "Oui", notes: "" },
          { _id: "p3", name: "Situation familiale", desc: "Modifier situation familiale", init: "", v1: "", v2: "", keep: "Oui", notes: "" },
          { _id: "p4", name: "Demande d'attestation", desc: "Demander une attestation", init: "", v1: "", v2: "", keep: "Oui", notes: "" },
          { _id: "p5", name: "Changement de poste", desc: "Mutation / promotion", init: "", v1: "", v2: "", keep: "Oui", notes: "" },
        ],
      } },
    ] },

    // ═══ 5. AUTOMATISATIONS ═══════════════════════════════════
    { id: "p_auto", title: "5. Automatisations", icon: "Bell", blocks: [
      { id: "ba1", type: "heading", content: { title: "Automatisations & Alertes" } },
      { id: "ba2", type: "table", content: {
        title: "Règles d'automatisation",
        roleOptions: true,
        allowAddRows: true,
        columns: [
          { key: "theme", label: "Thématique", type: "text", minWidth: "130px" },
          { key: "name", label: "Règle", type: "text", minWidth: "180px" },
          { key: "obj", label: "Objectif", type: "text", minWidth: "240px" },
          { key: "who", label: "Alerté", type: "select", minWidth: "130px", options: "" },
          { key: "type", label: "Type", type: "select", minWidth: "110px", options: "Mail, Notification, Mail + Notif, NC" },
          { key: "keep", label: "Conserver", type: "check", minWidth: "80px" },
        ],
        defaultRows: [
          { _id: "a1", theme: "Onboarding", name: "Fin période d'essai", obj: "Alerter avant fin PE", who: "", type: "Mail", keep: "Non" },
          { _id: "a2", theme: "Contrat", name: "Fin de CDD", obj: "Alerter avant fin CDD", who: "", type: "Mail", keep: "Non" },
        ],
      } },
    ] },

    // ═══ 5b. GROUPES ═════════════════════════════════════════
    { id: "p_grp", title: "5b. Groupes", icon: "Layers", blocks: [
      { id: "bg1", type: "heading", content: { title: "Groupes d'utilisateurs", subtitle: "Pour ciblage des actualités et formulaires" } },
      { id: "bg2", type: "table", content: { title: "Groupes", allowAddRows: true, columns: [
        { key: "name", label: "Nom", type: "text", minWidth: "200px" },
        { key: "pso", label: "PSO", type: "text", minWidth: "120px" },
        { key: "const", label: "Constitution (critères)", type: "text", minWidth: "300px" },
      ], defaultRows: [
        { _id: "g1", name: "Groupe Manager", pso: "Utilisateur", const: "Rôle = Manager" },
        { _id: "g2", name: "Groupe RH", pso: "Utilisateur", const: "Rôle = RH" },
      ] } },
    ] },

    // ═══ 6. PAGE D'ACCUEIL ══════════════════════════════════
    { id: "p_hp", title: "6. Page d'accueil", icon: "Layout", blocks: [
      { id: "bh1", type: "heading", content: { title: "Page d'accueil & Widgets" } },
      { id: "bh2", type: "table", content: { title: "Éléments", allowAddRows: true, columns: [
        { key: "el", label: "Élément", type: "text", minWidth: "200px" },
        { key: "desc", label: "Description", type: "text", minWidth: "350px" },
        { key: "keep", label: "Souhaité", type: "check", minWidth: "80px" },
      ], defaultRows: [
        { _id: "h1", el: "Bannière", desc: "Image ou couleur de fond", keep: "Oui" },
        { _id: "h2", el: "Raccourcis rapides", desc: "Coordonnées bancaires, attestation...", keep: "Oui" },
        { _id: "h3", el: "Compteurs", desc: "Congés restants, RTT...", keep: "Oui" },
      ] } },
    ] },

    // ═══ 6b. DOCUMENTS ═══════════════════════════════════════
    { id: "p_docs", title: "6b. Documents", icon: "FolderOpen", blocks: [
      { id: "bd1", type: "heading", content: { title: "Gestion documentaire", subtitle: "Catégories de documents et droits d'accès" } },
      { id: "bd2", type: "table", content: { title: "Catégories de documents", allowAddRows: true, columns: [
        { key: "cat", label: "Catégorie", type: "text", minWidth: "200px" },
        { key: "ex", label: "Exemples", type: "text", minWidth: "300px" },
        { key: "depot", label: "Déposé par", type: "select", minWidth: "120px", options: "RH, Collaborateur, Manager, Automatique" },
        { key: "keep", label: "Souhaité", type: "check", minWidth: "80px" },
      ], defaultRows: [
        { _id: "d1", cat: "Contrat de travail", ex: "CDI, CDD, avenants", depot: "RH", keep: "Oui" },
        { _id: "d2", cat: "Bulletins de paie", ex: "Fiches de paie mensuelles", depot: "Automatique", keep: "Oui" },
        { _id: "d3", cat: "Documents personnels", ex: "Pièce d'identité, RIB", depot: "Collaborateur", keep: "Oui" },
      ] } },
    ] },

    // ═══ 8. PSO ══════════════════════════════════════════════
    { id: "p_pso", title: "8. PSO", icon: "Puzzle", blocks: [
      { id: "bs1", type: "heading", content: { title: "PSO (Objets organisationnels)", subtitle: "Structure de votre organisation" } },
      { id: "bs2", type: "table", content: { title: "PSO", allowAddRows: true, columns: [
        { key: "name", label: "Nom", type: "text", minWidth: "150px" },
        { key: "obj", label: "Objectif", type: "text", minWidth: "240px" },
        { key: "roles", label: "Rôles", type: "text", minWidth: "200px" },
        { key: "pop", label: "Population", type: "text", minWidth: "120px" },
      ], defaultRows: [
        { _id: "s1", name: "Utilisateur", obj: "Gérer les utilisateurs", roles: "RH ; Responsable", pop: "Tous" },
        { _id: "s2", name: "Poste", obj: "Gérer les postes", roles: "Admin", pop: "Tous" },
        { _id: "s3", name: "Site", obj: "Gérer les sites", roles: "Admin", pop: "Tous" },
      ] } },
    ] },

  ] };
}
