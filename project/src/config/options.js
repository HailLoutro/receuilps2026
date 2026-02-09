// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OPTIONS.JS — Toutes les listes déroulantes et constantes
// ➜ Pour ajouter/modifier une option, éditez simplement ce fichier
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const YES_NO = ["Oui", "Non"];

export const SENSITIVITY_OPTIONS = [
  "Non sensibles",
  "Considérées comme sensibles",
  "Sensibles",
];

export const PERMISSION_OPTIONS = ["Modifier", "Voir", "Masquer"];

export const FIELD_TYPES = [
  "Case à cocher unique",
  "Composite",
  "Devise",
  "Date",
  "Date avec heure",
  "Hiérarchie",
  "Image",
  "Liste déroulante à choix unique",
  "Ensemble de cases à cocher",
  "Fichier",
  "Nombre",
  "Bouton radio",
  "Echelle numérique",
  "Texte court",
  "Tag",
  "Texte défilant",
  "Url",
  "PSO Relation",
  "Champ système",
];

export const CATEGORIES = [
  "Identité",
  "Contact professionnel",
  "Contrat de travail",
  "Congés & Absences, Feuilles de temps et Frais",
  "CV & formation",
  "Informations personnelles",
  "Intégration",
  "Paramètres",
  "Relations utilisateurs",
  "Rémunération",
  "Structure organisationnelle",
];

export const ALERT_TYPES = [
  "Mail",
  "Notification cloche",
  "Notification cloche + Envoi mail",
  "NC",
];

export const INITIATOR_OPTIONS = [
  "Collaborateur",
  "Responsable",
  "RH",
  "Assistant(e) RH",
];

export const STANDARD_ROLES = ["Manager", "RH", "Assistant(e) RH", "Salarié"];

export const LIST_PERMISSIONS = [
  "Ajouter de nouvelles valeur ou modifier les valeurs existantes",
  "Ajouter toujours de nouvelles valeurs",
  "Modifier les valeurs existantes",
];

export const DOMAIN_OPTIONS = [
  "Domaine Global Utilisateur",
];

// ━━━ Branding ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const BRAND = {
  name: "PeopleSpheres",
  subtitle: "Recueil du besoin",
  colors: {
    primary: "#0f1147",
    primaryLight: "#1a1f6c",
    accent: "#4e54c8",
    gradientFrom: "#1a1f6c",
    gradientVia: "#2d3494",
    gradientTo: "#4e54c8",
  },
  font: "'DM Sans', 'Segoe UI', sans-serif",
  fontUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
};
