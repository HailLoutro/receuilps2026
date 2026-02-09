// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEFAULTS.JS — Données pré-remplies extraites de l'Excel
// ➜ Modifiez les valeurs par défaut ici pour chaque client
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Helpers ──────────────────────────────────────────────────────
let _uid = 0;
export const uid = (prefix = "id") => `${prefix}_${++_uid}_${Date.now()}`;

// ── Rôles ────────────────────────────────────────────────────────
export const DEFAULT_ROLES = [
  { id: "r1", standard: true, name: "Manager", seeData: "Oui", accessFeatures: "Oui", validateProcesses: "Oui", assignment: "Responsable direct du collaborateur", population: "", domains: "", sensitivity: "Sensibles" },
  { id: "r2", standard: true, name: "RH", seeData: "Oui", accessFeatures: "Oui", validateProcesses: "Oui", assignment: "Admin.consultant", population: "Utilisateur - Tous", domains: "", sensitivity: "Sensibles" },
  { id: "r3", standard: true, name: "Assistant(e) RH", seeData: "Oui", accessFeatures: "Oui", validateProcesses: "Oui", assignment: "Admin.consultant", population: "Utilisateur - Tous", domains: "", sensitivity: "Sensibles" },
  { id: "r4", standard: true, name: "Salarié", seeData: "Oui", accessFeatures: "Oui", validateProcesses: "Oui", assignment: "Tous - Onboarding", population: "", domains: "", sensitivity: "Sensibles" },
];

// ── Champs profil ────────────────────────────────────────────────
export const DEFAULT_PROFILE_FIELDS = [
  { id: "f1", category: "Identité", field: "Image de profil", subfield: "", type: "Image", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Non sensibles", present: "Oui", public: "Oui", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Modifier", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f2", category: "Identité", field: "Actif", subfield: "", type: "Liste déroulante à choix unique", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Non sensibles", present: "Oui", public: "Non", inCreation: "Oui", prefilled: "Oui", prefilledValue: "Oui", required: "Oui", permissions: { "Soi-même": "Masquer", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f3", category: "Identité", field: "Nom", subfield: "", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Non sensibles", present: "Oui", public: "Oui", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Oui", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f4", category: "Identité", field: "Prénom", subfield: "", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Non sensibles", present: "Oui", public: "Oui", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Oui", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f5", category: "Identité", field: "ID d'utilisateur", subfield: "", type: "Champ système", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Oui", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Masquer", "Manager": "Masquer", "Assistant(e) RH": "Masquer", "RH": "Masquer" } },
  { id: "f6", category: "Identité", field: "Nom d'utilisateur", subfield: "", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Oui", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f7", category: "Identité", field: "Groupe", subfield: "", type: "Champ système", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Voir", "RH": "Voir" } },
  { id: "f8", category: "Identité", field: "N° de badge", subfield: "", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f9", category: "Identité", field: "Matricule", subfield: "", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f10", category: "Contact professionnel", field: "Adresse e-mail professionnelle", subfield: "", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Oui", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Oui", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f11", category: "Contact professionnel", field: "Téléphone fixe professionnel", subfield: "", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Oui", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f12", category: "Contact professionnel", field: "Téléphone portable professionnel", subfield: "", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Oui", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Modifier", "Manager": "Modifier", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f13", category: "Contact professionnel", field: "Adresse professionnelle", subfield: "Numéro de rue", type: "Nombre", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f14", category: "Contact professionnel", field: "Adresse professionnelle", subfield: "Nom de rue", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f15", category: "Contact professionnel", field: "Adresse professionnelle", subfield: "Ville", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f16", category: "Contact professionnel", field: "Adresse professionnelle", subfield: "Code postal", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f17", category: "Contact professionnel", field: "Adresse professionnelle", subfield: "Pays", type: "Liste déroulante à choix unique", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f18", category: "Contrat de travail", field: "Embauche", subfield: "Date d'embauche initiale", type: "Date", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f19", category: "Contrat de travail", field: "Embauche", subfield: "Date de fin de période d'essai", type: "Date", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f20", category: "Contrat de travail", field: "Contrat de travail", subfield: "Date d'effet du contrat", type: "Date", optionList: "Oui", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Oui", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f21", category: "Contrat de travail", field: "Contrat de travail", subfield: "Type de contrat", type: "Hiérarchie", optionList: "Oui", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f22", category: "Contrat de travail", field: "Contrat de travail", subfield: "Temps de travail", type: "Liste déroulante à choix unique", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f23", category: "Contrat de travail", field: "Contrat de travail", subfield: "Date de fin du contrat", type: "Date", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
  { id: "f24", category: "Contrat de travail", field: "Contrat de travail", subfield: "Convention collective", type: "Texte court", optionList: "Non", domain: "Domaine Global Utilisateur", sensitivity: "Considérées comme sensibles", present: "Oui", public: "Non", inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non", permissions: { "Soi-même": "Voir", "Manager": "Voir", "Assistant(e) RH": "Modifier", "RH": "Modifier" } },
];

// ── Processus ────────────────────────────────────────────────────
export const DEFAULT_PROCESSES = [
  { id: "p1", name: "Changement d'adresse personnelle", description: "Ce formulaire vous permet de modifier votre adresse personnelle.", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "Manager", validator3: "RH", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p2", name: "Changement de domiciliation bancaire", description: "Ce formulaire vous permet de mettre à jour vos coordonnées bancaires", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p3", name: "Changement de situation familiale", description: "Ce formulaire vous permet de modifier votre situation familiale", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Oui", notifyWho: "Manager" },
  { id: "p4", name: "Contact(s) en cas d'urgence", description: "Ce formulaire vous permet de mettre à jour vos contacts en cas d'urgence.", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p5", name: "Demande d'acompte", description: "Ce formulaire vous permet de réaliser une demande d'acompte", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p6", name: "Demande d'attestation", description: "Ce formulaire vous permet de demander une attestation", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p7", name: "Justificatif d'absence", description: "Ce formulaire vous permet de déposer un justificatif d'absence", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p8", name: "Mise à jour de données personnelles", description: "Ce formulaire vous permet de mettre à jour vos informations personnelles", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p9", name: "Mise à jour titre de séjour / autorisation de travail", description: "Ce formulaire vous permet de mettre à jour vos informations relatives au titre de séjour et autorisation de travail", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p10", name: "Personne(s) à charge", description: "Ce formulaire vous permet de mettre à jour vos personnes à charge.", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p11", name: "Lettre de mission", description: "Ce formulaire vous permet de renseigner les informations concernant la mission du collaborateur.", target: "Tous les utilisateurs", initiator: "Responsable", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p12", name: "Renouvellement ou transformation contrat", description: "Ce formulaire vous permet de saisir votre décision concernant la suite à donner au contrat", target: "Tous les utilisateurs", initiator: "Responsable", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p13", name: "Changement d'entité légale", description: "Ce formulaire vous permet de saisir le nouveau rattachement du collaborateur", target: "Tous les utilisateurs", initiator: "RH", validator2: "", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p14", name: "Changement de site", description: "Ce formulaire vous permet de saisir le nouveau rattachement du collaborateur", target: "Tous les utilisateurs", initiator: "RH", validator2: "", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p15", name: "Changement de poste", description: "Ce formulaire vous permet de saisir le nouveau poste du collaborateur", target: "Tous les utilisateurs", initiator: "RH", validator2: "", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p16", name: "Changement temps de travail", description: "Ce formulaire vous permet de mettre à jour les données concernant le temps de travail", target: "Tous les utilisateurs", initiator: "RH", validator2: "", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p17", name: "Mise à jour mutuelle", description: "Ce formulaire vous permet de mettre à jour votre choix concernant la mutuelle", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
  { id: "p18", name: "Mise à jour situation de handicap", description: "Ce formulaire vous permet de mettre à jour les informations concernant votre situation de handicap", target: "Tous les utilisateurs", initiator: "Collaborateur", validator2: "RH", validator3: "", keep: "Oui", notification: "Non", notifyWho: "" },
];

// ── Automatisations ──────────────────────────────────────────────
export const DEFAULT_AUTOMATIONS = [
  { id: "a1", theme: "Admin", name: "Sortie de rôles", objective: "Alerter les administrateurs lorsqu'un collaborateur va sortir d'un certain rôle", who: "Administrateur", timing: "15 jours avant le départ du collaborateur", alertType: "Mail", keep: "Non" },
  { id: "a2", theme: "Admin", name: "RGPD - N+1 mois", objective: "Supprimer automatiquement certains champs à N+1 mois du départ pour respecter le RGPD", who: "", timing: "", alertType: "NC", keep: "Non" },
  { id: "a3", theme: "Admin", name: "RGPD - N+5 ans", objective: "Supprimer automatiquement certains champs à N+5 ans du départ pour respecter le RGPD", who: "", timing: "", alertType: "NC", keep: "Non" },
  { id: "a4", theme: "Onboarding", name: "Fin de période d'essai", objective: "Alerter avant une fin de période d'essai (pour reconduction ou non)", who: "Assistant(e) RH / RH", timing: "4 semaines avant la date de fin de PE", alertType: "Mail", keep: "Non" },
  { id: "a5", theme: "Onboarding", name: "Alerte prévenance période d'essai", objective: "Alerter avant la fin de la prévenance de période d'essai", who: "Assistant(e) RH / RH", timing: "2 semaines avant la date de prévenance", alertType: "Mail", keep: "Non" },
  { id: "a6", theme: "Gestion de contrat", name: "Fin de CDD", objective: "Alerter avant une fin de CDD", who: "RH / Assistant(e) RH", timing: "4 semaines avant la date de fin de contrat", alertType: "Mail", keep: "Non" },
  { id: "a7", theme: "Gestion de contrat", name: "Contrat Terminé - alerte désactivation", objective: "Alerte si contrat dont la date de fin est dépassée (J+1) et collaborateur toujours actif", who: "RH", timing: "1 jour après la date de fin de contrat", alertType: "Mail", keep: "Non" },
  { id: "a8", theme: "Gestion de contrat", name: "Renouvellement ou transformation de contrat", objective: "Alerter au moment de la fin du contrat le manager et le RH pour prendre une décision", who: "Responsable / RH", timing: "X temps avant la date de fin du contrat", alertType: "Mail", keep: "Non" },
  { id: "a9", theme: "Gestion administrative", name: "Fin d'autorisation de travail", objective: "Alerter avant la fin de l'autorisation de travail", who: "RH / Collaborateur", timing: "30 jours avant la date d'expiration", alertType: "Mail", keep: "Non" },
  { id: "a10", theme: "Gestion administrative", name: "Mise à jour titre de séjour et autorisation", objective: "Affecte un formulaire de mise à jour et alerte de la date d'expiration", who: "RH / Collaborateur", timing: "1 mois avant la date d'expiration", alertType: "Mail", keep: "Non" },
  { id: "a11", theme: "Gestion administrative", name: "Fin de validité RQTH", objective: "Alerter avant la fin de validité RQTH", who: "RH / Assistant(e) RH / Collaborateur", timing: "1 mois avant la date d'expiration", alertType: "Mail", keep: "Non" },
  { id: "a12", theme: "Gestion administrative", name: "Fin de validité Visite Médicale", objective: "Alerter avant la fin de validité d'une visite médicale", who: "RH / Assistant(e) RH", timing: "2 semaines avant la date de la prochaine visite", alertType: "Mail", keep: "Non" },
  { id: "a13", theme: "Gestion administrative", name: "Renseigner parcours professionnel", objective: "Affecte un formulaire permettant de renseigner le parcours professionnel le jour de la création", who: "Collaborateur", timing: "Au moment de la création du collaborateur", alertType: "Mail", keep: "Non" },
  { id: "a14", theme: "Gestion administrative", name: "Expiration dispense mutuelle", objective: "Alerter le collaborateur et le RH que la date d'échéance de la dispense approche", who: "RH / Collaborateur", timing: "31/12/N", alertType: "Mail", keep: "Non" },
];

// ── Accès fonctionnalités ────────────────────────────────────────
export const DEFAULT_FEATURE_ACCESS = [
  { id: "fa1", permission: "Accéder à l'encart \"Actions\"", collaborateur: "Oui", manager: "Oui", assistantRH: "Oui", rh: "Oui" },
  { id: "fa2", permission: "Visualiser les actualités publiées", collaborateur: "Oui", manager: "Oui", assistantRH: "Oui", rh: "Oui" },
  { id: "fa3", permission: "Visualiser l'organigramme", collaborateur: "Oui", manager: "Oui", assistantRH: "Oui", rh: "Oui" },
  { id: "fa4", permission: "Lancer un chat RH", collaborateur: "Oui", manager: "Oui", assistantRH: "Oui", rh: "Oui" },
  { id: "fa5", permission: "Déclencher un formulaire / générer un document en self-service", collaborateur: "Oui", manager: "Oui", assistantRH: "Oui", rh: "Oui" },
  { id: "fa6", permission: "Rechercher d'autres collaborateurs", collaborateur: "Oui", manager: "Oui", assistantRH: "Oui", rh: "Oui" },
  { id: "fa7", permission: "Accéder rapidement à mon équipe (N-1)", collaborateur: "Non", manager: "Oui", assistantRH: "Non", rh: "Non" },
  { id: "fa8", permission: "Gérer le chat RH (répondre)", collaborateur: "Non", manager: "Non", assistantRH: "Oui", rh: "Oui" },
  { id: "fa9", permission: "Rechercher d'autres référentiels (PSO)", collaborateur: "Non", manager: "Non", assistantRH: "Oui", rh: "Oui" },
  { id: "fa10", permission: "Déléguer ses actions", collaborateur: "Non", manager: "Non", assistantRH: "Oui", rh: "Oui" },
  { id: "fa11", permission: "Accéder au centre de délégation d'un autre utilisateur", collaborateur: "Non", manager: "Non", assistantRH: "Oui", rh: "Oui" },
  { id: "fa12", permission: "Accéder au tableau de bord des actions", collaborateur: "Non", manager: "Non", assistantRH: "Oui", rh: "Oui" },
  { id: "fa13", permission: "Gérer les affectations (CRUD)", collaborateur: "Non", manager: "Non", assistantRH: "Oui", rh: "Oui" },
  { id: "fa14", permission: "Configurer les formulaires (CRUD)", collaborateur: "Non", manager: "Non", assistantRH: "Oui", rh: "Oui" },
  { id: "fa15", permission: "Gérer les actualités (CRUD)", collaborateur: "Non", manager: "Non", assistantRH: "Oui", rh: "Oui" },
  { id: "fa16", permission: "Créer des exports", collaborateur: "Non", manager: "Non", assistantRH: "Non", rh: "Oui" },
  { id: "fa17", permission: "Réaliser des imports", collaborateur: "Non", manager: "Non", assistantRH: "Non", rh: "Oui" },
  { id: "fa18", permission: "Gérer la page d'accueil", collaborateur: "Non", manager: "Non", assistantRH: "Non", rh: "Oui" },
  { id: "fa19", permission: "Gérer les modèles de documents", collaborateur: "Non", manager: "Non", assistantRH: "Non", rh: "Oui" },
  { id: "fa20", permission: "Gérer les champs (CRUD)", collaborateur: "Non", manager: "Non", assistantRH: "Non", rh: "Oui" },
  { id: "fa21", permission: "Gérer les groupes (CRUD)", collaborateur: "Non", manager: "Non", assistantRH: "Non", rh: "Oui" },
];

// ── Groupes ──────────────────────────────────────────────────────
export const DEFAULT_GROUPS = [
  { id: "g1", name: "Module Groupe Administrateur", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Rôle d'utilisateur est égal à Administrateur", specific: "" },
  { id: "g2", name: "Groupe Administrateurs", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Utilisateurs spécifiques", specific: "" },
  { id: "g3", name: "Module Groupe Propriétaire", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Rôle utilisateur est égal à Propriétaire", specific: "" },
  { id: "g4", name: "Utilisateur Groupe Manager", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Rôle d'utilisateur est égal à manager", specific: "" },
  { id: "g5", name: "Utilisateur Groupe Assistant(e) RH", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Rôle d'utilisateur est égal à Assistant(e) RH", specific: "" },
  { id: "g6", name: "Utilisateur Groupe RH", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Rôle d'utilisateur est égal à RH", specific: "" },
  { id: "g7", name: "Salariés", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Actif est parmi Oui,Non", specific: "" },
  { id: "g8", name: "OnBoarding", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Processus d'embauche est parmi Informations personnelles", specific: "" },
  { id: "g9", name: "OnBoarding finalisé", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "Processus d'embauche est égal à Onboarding finalisé", specific: "" },
];

// ── Widgets / Templates ──────────────────────────────────────────
export const TEMPLATE_PREVIEWS = [
  { id: 1, name: "Template 1 — Classique", desc: "Bannière + raccourcis + vidéo + image", blocks: ["banner", "shortcuts", "video", "image"] },
  { id: 2, name: "Template 2 — Élargi", desc: "Grande bannière + raccourcis + vidéo + image", blocks: ["banner-wide", "shortcuts", "video", "image"] },
  { id: 3, name: "Template 3 — Double accès", desc: "Bannière + 2 sections raccourcis + 2 images", blocks: ["banner", "shortcuts", "shortcuts2", "image", "image2"] },
  { id: 4, name: "Template 4 — Focus visuel", desc: "Bannière + raccourcis + accès + 2 images", blocks: ["banner", "shortcuts", "shortcuts2", "image", "image2"] },
  { id: 5, name: "Template 5 — Immersif", desc: "Grande bannière + raccourcis + accès + 2 images large", blocks: ["banner-xl", "shortcuts", "shortcuts2", "image-xl", "image2"] },
  { id: 6, name: "Template 6 — Premium", desc: "Design premium avec sections espacées", blocks: ["banner-xl", "shortcuts-wide", "shortcuts2-wide", "image-xl", "image2"] },
  { id: 7, name: "Template 7 — Modulaire", desc: "Bannière + raccourcis + accès + images", blocks: ["banner", "shortcuts", "shortcuts2", "image", "image2"] },
  { id: 8, name: "Template 8 — Compact", desc: "Design compact et fonctionnel", blocks: ["banner", "shortcuts", "shortcuts2", "image", "image2"] },
  { id: 9, name: "Template 9 — Moderne", desc: "Design moderne avec grandes zones", blocks: ["banner", "shortcuts", "shortcuts2", "image", "image2"] },
];

export const DEFAULT_TEMPLATE_DATA = {
  background: "",
  shortcuts: [{ title: "Mes coordonnées bancaires", desc: "Modifier vos informations bancaires", link: "" }],
  videoLink: "",
  imageLink: "",
};

// ── Modèles de documents ─────────────────────────────────────────
export const DEFAULT_DOC_MODELS = [
  { id: "dm1", name: "Attestation employeur", target: "Tous les utilisateurs", generator: "Collaborateur / RH / Assistant(e) RH", uploaded: "Non", spName: "" },
  { id: "dm2", name: "Attestation mutuelle", target: "Tous les utilisateurs", generator: "Collaborateur / RH / Assistant(e) RH", uploaded: "Non", spName: "" },
];

// ── Base documentaire ────────────────────────────────────────────
export const DEFAULT_DOC_BASE = {
  store: "Oui",
  common: "Non",
  populations: [
    { name: "France", folder: "Base documentaire France" },
    { name: "Italie", folder: "Base documentaire Italie" },
  ],
};

// ── PSO ──────────────────────────────────────────────────────────
export const DEFAULT_PSO = [
  { id: "pso1", name: "Utilisateur", objective: "Gérer les utilisateurs du Socle", forms: "", roles: "RH ; Assistant(e) RH ; Responsable ; Utilisateur", population: "Tous", group: "", criteria: "", responsible: "Admin" },
  { id: "pso2", name: "Base documentaire", objective: "Mettre à disposition des documents pour les collaborateurs", forms: "", roles: "Propriétaire, Administrateur", population: "Tous", group: "", criteria: "", responsible: "Admin" },
  { id: "pso3", name: "Centre de coût", objective: "Gérer les centres de coût du Socle", forms: "", roles: "Propriétaire, Administrateur", population: "Tous", group: "", criteria: "", responsible: "Admin" },
  { id: "pso4", name: "Employeur", objective: "Gérer les employeurs sur le socle", forms: "", roles: "Propriétaire, Administrateur", population: "Tous", group: "", criteria: "", responsible: "Admin" },
  { id: "pso5", name: "Module", objective: "Gérer les modules sur le socle", forms: "", roles: "Propriétaire, Administrateur", population: "Tous", group: "", criteria: "", responsible: "Admin" },
  { id: "pso6", name: "Poste", objective: "Gérer les postes sur le socle", forms: "", roles: "Propriétaire, Administrateur", population: "Tous", group: "", criteria: "", responsible: "Admin" },
  { id: "pso7", name: "Service", objective: "Gérer les services sur le socle", forms: "", roles: "Propriétaire, Administrateur", population: "Tous", group: "", criteria: "", responsible: "Admin" },
  { id: "pso8", name: "Site", objective: "Gérer les sites sur le socle", forms: "", roles: "Propriétaire, Administrateur", population: "Tous", group: "", criteria: "", responsible: "Admin" },
];
