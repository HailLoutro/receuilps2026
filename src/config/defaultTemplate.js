// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEFAULT TEMPLATE — Template initial pré-rempli PeopleSpheres
// ➜ Modifiez ce fichier pour changer les données par défaut
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function buildDefaultTemplate() {
  return { pages: [

    // ── Accueil ──────────────────────────────────────────────
    { id: "p_acc", title: "Accueil", icon: "Home", group: "Général", blocks: [
      { id: "b1", type: "heading", content: { title: "Bienvenue sur votre espace de configuration Core RH", subtitle: "Ce document sert de base pour configurer votre SIRH PeopleSpheres." } },
      { id: "b2", type: "text", content: { text: "Nous vous conseillons de réaliser ce recueil en plusieurs fois afin de vous laisser le temps de projeter vos processus et situations RH." } },
      { id: "b3", type: "info", content: { text: "**Conseil :** Appuyez-vous sur votre consultant Socle PeopleSpheres, le centre de support, et le parcours eLearning dans votre espace PeopleSpheres Academy.", variant: "tip" } },
    ] },

    // ── 1. Rôles ─────────────────────────────────────────────
    { id: "p_roles", title: "1. Rôles & Accès", icon: "Shield", group: "Configuration", blocks: [
      { id: "br1", type: "heading", content: { title: "Rôles & Accès aux champs", subtitle: "Définissez les rôles nécessaires pour votre organisation" } },
      { id: "br2", type: "info", content: { text: "**Questions :** Qui valide des formulaires ? Qui voit/modifie les données ? Qui fait des exports ?", variant: "info" } },
      { id: "br3", type: "table", content: {
        title: "Définition des rôles", allowAddRows: true, allowAddCols: true,
        columns: [
          { key: "name", label: "Nom du rôle", type: "text", minWidth: "160px" },
          { key: "see", label: "Voir données", type: "select", minWidth: "100px", options: "Oui, Non" },
          { key: "feat", label: "Fonctionnalités", type: "select", minWidth: "100px", options: "Oui, Non" },
          { key: "val", label: "Valider processus", type: "select", minWidth: "100px", options: "Oui, Non" },
          { key: "assign", label: "Assignation", type: "text", minWidth: "200px" },
          { key: "pop", label: "Population", type: "text", minWidth: "140px" },
          { key: "sens", label: "Sensibilité", type: "select", minWidth: "140px", options: "Non sensibles, Considérées comme sensibles, Sensibles" },
        ],
        defaultRows: [
          { _id: "r1", name: "Manager", see: "Oui", feat: "Oui", val: "Oui", assign: "Responsable direct", pop: "", sens: "Sensibles" },
          { _id: "r2", name: "RH", see: "Oui", feat: "Oui", val: "Oui", assign: "Admin.consultant", pop: "Utilisateur - Tous", sens: "Sensibles" },
          { _id: "r3", name: "Assistant(e) RH", see: "Oui", feat: "Oui", val: "Oui", assign: "Admin.consultant", pop: "Utilisateur - Tous", sens: "Sensibles" },
          { _id: "r4", name: "Salarié", see: "Oui", feat: "Oui", val: "Oui", assign: "Tous - Onboarding", pop: "", sens: "Sensibles" },
        ],
      } },
    ] },

    // ── 2. Fonctionnalités ────────────────────────────────────
    { id: "p_feat", title: "2. Accès fonctionnalités", icon: "Settings", group: "Configuration", blocks: [
      { id: "bf1", type: "heading", content: { title: "Accès aux fonctionnalités", subtitle: "Matrice de permissions par rôle" } },
      { id: "bf2", type: "table", content: {
        title: "Permissions", allowAddRows: true, allowAddCols: true,
        columns: [
          { key: "perm", label: "Permission", type: "text", minWidth: "280px" },
          { key: "col", label: "Collaborateur", type: "check", minWidth: "90px" },
          { key: "mgr", label: "Manager", type: "check", minWidth: "90px" },
          { key: "arh", label: "Assist. RH", type: "check", minWidth: "90px" },
          { key: "rh", label: "RH", type: "check", minWidth: "90px" },
        ],
        defaultRows: [
          { _id: "f1", perm: "Accéder à l'encart Actions", col: "Oui", mgr: "Oui", arh: "Oui", rh: "Oui" },
          { _id: "f2", perm: "Visualiser les actualités", col: "Oui", mgr: "Oui", arh: "Oui", rh: "Oui" },
          { _id: "f3", perm: "Accéder à l'organigramme", col: "Oui", mgr: "Oui", arh: "Oui", rh: "Oui" },
          { _id: "f4", perm: "Déclencher formulaire self-service", col: "Oui", mgr: "Oui", arh: "Oui", rh: "Oui" },
          { _id: "f5", perm: "Accéder à mon équipe (N-1)", col: "Non", mgr: "Oui", arh: "Non", rh: "Non" },
          { _id: "f6", perm: "Créer des exports", col: "Non", mgr: "Non", arh: "Non", rh: "Oui" },
          { _id: "f7", perm: "Réaliser des imports", col: "Non", mgr: "Non", arh: "Non", rh: "Oui" },
          { _id: "f8", perm: "Gérer la page d'accueil", col: "Non", mgr: "Non", arh: "Non", rh: "Oui" },
        ],
      } },
    ] },

    // ── 3a. Profil ────────────────────────────────────────────
    { id: "p_prof", title: "3a. Profil utilisateur", icon: "Users", group: "Données", blocks: [
      { id: "bp1", type: "heading", content: { title: "Profil de l'utilisateur", subtitle: "Champs du profil et permissions par rôle" } },
      { id: "bp2", type: "info", content: { text: "**Conseil :** Très peu de données doivent être publiques (Prénom, Nom, e-mail pro, téléphone pro, site).", variant: "tip" } },
      { id: "bp3", type: "table", content: {
        title: "Champs du profil", allowAddRows: true, allowAddCols: true,
        columns: [
          { key: "cat", label: "Catégorie", type: "select", minWidth: "120px", options: "Identité, Contact professionnel, Contrat de travail, CV & formation, Informations personnelles, Rémunération, Structure organisationnelle" },
          { key: "field", label: "Champ", type: "text", minWidth: "150px" },
          { key: "sub", label: "Sous-champ", type: "text", minWidth: "110px" },
          { key: "type", label: "Type", type: "select", minWidth: "120px", options: "Texte court, Date, Nombre, Liste déroulante, Composite, Hiérarchie, Image, Fichier, Devise, Champ système" },
          { key: "present", label: "Présent", type: "check", minWidth: "60px" },
          { key: "public", label: "Public", type: "check", minWidth: "60px" },
          { key: "sens", label: "Sensibilité", type: "select", minWidth: "100px", options: "Non sensibles, Considérées sensibles, Sensibles" },
          { key: "self", label: "Soi-même", type: "select", minWidth: "80px", options: "Modifier, Voir, Masquer" },
          { key: "mgr", label: "Manager", type: "select", minWidth: "80px", options: "Modifier, Voir, Masquer" },
          { key: "arh", label: "Assist. RH", type: "select", minWidth: "80px", options: "Modifier, Voir, Masquer" },
          { key: "rh", label: "RH", type: "select", minWidth: "80px", options: "Modifier, Voir, Masquer" },
        ],
        defaultRows: [
          { _id: "pf1", cat: "Identité", field: "Nom", sub: "", type: "Texte court", present: "Oui", public: "Oui", sens: "Non sensibles", self: "Voir", mgr: "Voir", arh: "Modifier", rh: "Modifier" },
          { _id: "pf2", cat: "Identité", field: "Prénom", sub: "", type: "Texte court", present: "Oui", public: "Oui", sens: "Non sensibles", self: "Voir", mgr: "Voir", arh: "Modifier", rh: "Modifier" },
          { _id: "pf3", cat: "Identité", field: "Matricule", sub: "", type: "Texte court", present: "Oui", public: "Non", sens: "Considérées sensibles", self: "Voir", mgr: "Voir", arh: "Modifier", rh: "Modifier" },
          { _id: "pf4", cat: "Contact professionnel", field: "E-mail pro", sub: "", type: "Texte court", present: "Oui", public: "Oui", sens: "Considérées sensibles", self: "Voir", mgr: "Voir", arh: "Modifier", rh: "Modifier" },
          { _id: "pf5", cat: "Contrat de travail", field: "Embauche", sub: "Date initiale", type: "Date", present: "Oui", public: "Non", sens: "Considérées sensibles", self: "Voir", mgr: "Voir", arh: "Modifier", rh: "Modifier" },
          { _id: "pf6", cat: "Rémunération", field: "Rémunération brute", sub: "", type: "Devise", present: "Oui", public: "Non", sens: "Sensibles", self: "Voir", mgr: "Masquer", arh: "Modifier", rh: "Modifier" },
        ],
      } },
    ] },

    // ── 4. Processus ──────────────────────────────────────────
    { id: "p_proc", title: "4. Processus", icon: "FileText", group: "Processus", blocks: [
      { id: "bpr1", type: "heading", content: { title: "Processus & Workflows", subtitle: "Formulaires et circuits de validation" } },
      { id: "bpr2", type: "info", content: { text: "**Conseil :** Notez vos actions RH courantes. Quels processus entraînent le plus de doubles saisies ?", variant: "tip" } },
      { id: "bpr3", type: "table", content: {
        title: "Formulaires standards", allowAddRows: true, allowAddCols: false,
        columns: [
          { key: "name", label: "Nom", type: "text", minWidth: "200px" },
          { key: "desc", label: "Description", type: "text", minWidth: "180px" },
          { key: "target", label: "Population", type: "text", minWidth: "100px" },
          { key: "init", label: "Initiateur", type: "select", minWidth: "110px", options: "Collaborateur, Responsable, RH, Assistant(e) RH" },
          { key: "v2", label: "Validation 2", type: "select", minWidth: "100px", options: "Manager, RH, Assistant(e) RH" },
          { key: "keep", label: "Conserver", type: "check", minWidth: "70px" },
        ],
        defaultRows: [
          { _id: "p1", name: "Changement d'adresse", desc: "Modifier adresse personnelle", target: "Tous", init: "Collaborateur", v2: "Manager", keep: "Oui" },
          { _id: "p2", name: "Domiciliation bancaire", desc: "MAJ coordonnées bancaires", target: "Tous", init: "Collaborateur", v2: "RH", keep: "Oui" },
          { _id: "p3", name: "Situation familiale", desc: "Modifier situation familiale", target: "Tous", init: "Collaborateur", v2: "RH", keep: "Oui" },
          { _id: "p4", name: "Demande d'attestation", desc: "Demander une attestation", target: "Tous", init: "Collaborateur", v2: "RH", keep: "Oui" },
          { _id: "p5", name: "Changement de poste", desc: "Nouveau poste collaborateur", target: "Tous", init: "RH", v2: "", keep: "Oui" },
        ],
      } },
      { id: "bpr4", type: "table", content: {
        title: "Besoins spécifiques", allowAddRows: true, allowAddCols: true,
        columns: [
          { key: "name", label: "Nom", type: "text", minWidth: "200px" },
          { key: "desc", label: "Description", type: "text", minWidth: "200px" },
          { key: "init", label: "Initiateur", type: "select", minWidth: "110px", options: "Collaborateur, Responsable, RH" },
        ],
        defaultRows: [],
      } },
    ] },

    // ── 5. Automatisations ────────────────────────────────────
    { id: "p_auto", title: "5. Automatisations", icon: "Bell", group: "Processus", blocks: [
      { id: "ba1", type: "heading", content: { title: "Automatisations & Alertes", subtitle: "Règles d'automatisation" } },
      { id: "ba2", type: "table", content: {
        title: "Règles", allowAddRows: true, allowAddCols: false,
        columns: [
          { key: "theme", label: "Thématique", type: "text", minWidth: "120px" },
          { key: "name", label: "Règle", type: "text", minWidth: "160px" },
          { key: "obj", label: "Objectif", type: "text", minWidth: "220px" },
          { key: "who", label: "Alerté", type: "text", minWidth: "130px" },
          { key: "when", label: "Temporalité", type: "text", minWidth: "160px" },
          { key: "type", label: "Type", type: "select", minWidth: "100px", options: "Mail, Notification, Mail + Notification, NC" },
          { key: "keep", label: "Conserver", type: "check", minWidth: "70px" },
        ],
        defaultRows: [
          { _id: "a1", theme: "Onboarding", name: "Fin période d'essai", obj: "Alerter avant fin PE", who: "RH", when: "4 sem. avant", type: "Mail", keep: "Non" },
          { _id: "a2", theme: "Contrat", name: "Fin de CDD", obj: "Alerter avant fin CDD", who: "RH", when: "4 sem. avant", type: "Mail", keep: "Non" },
          { _id: "a3", theme: "Admin", name: "Autorisation travail", obj: "Alerter avant expiration", who: "RH / Collaborateur", when: "30j avant", type: "Mail", keep: "Non" },
          { _id: "a4", theme: "RGPD", name: "N+1 mois", obj: "Supprimer certains champs", who: "", when: "", type: "NC", keep: "Non" },
        ],
      } },
    ] },

    // ── 5b. Groupes ───────────────────────────────────────────
    { id: "p_grp", title: "5b. Groupes", icon: "Layers", group: "Processus", blocks: [
      { id: "bg1", type: "heading", content: { title: "Groupes d'utilisateurs", subtitle: "Pour le ciblage des actualités, formulaires et widgets" } },
      { id: "bg2", type: "table", content: {
        title: "Groupes", allowAddRows: true, allowAddCols: false,
        columns: [
          { key: "name", label: "Nom", type: "text", minWidth: "180px" },
          { key: "pso", label: "PSO", type: "text", minWidth: "110px" },
          { key: "dom", label: "Domaine", type: "text", minWidth: "160px" },
          { key: "const", label: "Constitution", type: "text", minWidth: "260px" },
        ],
        defaultRows: [
          { _id: "g1", name: "Groupe Manager", pso: "Utilisateur", dom: "Domaine global", const: "Rôle = Manager" },
          { _id: "g2", name: "Groupe RH", pso: "Utilisateur", dom: "Domaine global", const: "Rôle = RH" },
          { _id: "g3", name: "Salariés", pso: "Utilisateur", dom: "Domaine global", const: "Actif = Oui/Non" },
        ],
      } },
    ] },

    // ── 6. Page d'accueil ─────────────────────────────────────
    { id: "p_hp", title: "6. Page d'accueil", icon: "Layout", group: "Interface", blocks: [
      { id: "bh1", type: "heading", content: { title: "Page d'accueil & Widgets", subtitle: "Éléments souhaités" } },
      { id: "bh2", type: "table", content: {
        title: "Éléments", allowAddRows: true, allowAddCols: false,
        columns: [
          { key: "el", label: "Élément", type: "text", minWidth: "200px" },
          { key: "desc", label: "Description", type: "text", minWidth: "300px" },
          { key: "keep", label: "Souhaité", type: "check", minWidth: "70px" },
        ],
        defaultRows: [
          { _id: "h1", el: "Bannière", desc: "Image ou couleur de fond", keep: "Oui" },
          { _id: "h2", el: "Raccourcis rapides", desc: "Coordonnées bancaires, attestation...", keep: "Oui" },
          { _id: "h3", el: "Vidéo de bienvenue", desc: "YouTube / Vimeo", keep: "Non" },
        ],
      } },
    ] },

    // ── 6b. Documents ─────────────────────────────────────────
    { id: "p_doc", title: "6b. Documents", icon: "FolderOpen", group: "Interface", blocks: [
      { id: "bd1", type: "heading", content: { title: "Modèles de documents", subtitle: "Documents générables" } },
      { id: "bd2", type: "table", content: {
        title: "Modèles", allowAddRows: true, allowAddCols: false,
        columns: [
          { key: "name", label: "Document", type: "text", minWidth: "200px" },
          { key: "target", label: "Concerné", type: "text", minWidth: "160px" },
          { key: "gen", label: "Qui génère", type: "text", minWidth: "200px" },
          { key: "sp", label: "SharePoint", type: "check", minWidth: "80px" },
        ],
        defaultRows: [
          { _id: "d1", name: "Attestation employeur", target: "Tous", gen: "Collaborateur / RH", sp: "Non" },
        ],
      } },
    ] },

    // ── 8. PSO ─────────────────────────────────────────────────
    { id: "p_pso", title: "8. PSO", icon: "Puzzle", group: "Avancé", blocks: [
      { id: "bs1", type: "heading", content: { title: "PSO (Objets organisationnels)", subtitle: "Structure de votre organisation" } },
      { id: "bs2", type: "table", content: {
        title: "PSO", allowAddRows: true, allowAddCols: false,
        columns: [
          { key: "name", label: "Nom", type: "text", minWidth: "140px" },
          { key: "obj", label: "Objectif", type: "text", minWidth: "220px" },
          { key: "roles", label: "Rôles", type: "text", minWidth: "200px" },
          { key: "pop", label: "Population", type: "text", minWidth: "100px" },
        ],
        defaultRows: [
          { _id: "s1", name: "Utilisateur", obj: "Gérer les utilisateurs", roles: "RH ; Assist. RH ; Responsable", pop: "Tous" },
          { _id: "s2", name: "Poste", obj: "Gérer les postes", roles: "Propriétaire, Admin", pop: "Tous" },
          { _id: "s3", name: "Site", obj: "Gérer les sites", roles: "Propriétaire, Admin", pop: "Tous" },
        ],
      } },
    ] },

  ] };
}
