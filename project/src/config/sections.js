// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTIONS.JS — Définition de la navigation
// ➜ Ajoutez une section ici + créez son composant dans /sections
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import {
  Home, Shield, Settings, Users, FileText,
  Bell, Layers, Layout, FolderOpen, Database, Puzzle,
} from "lucide-react";

/**
 * Chaque section doit avoir :
 *  - id          : clé unique (sert de route)
 *  - label       : titre affiché dans la sidebar
 *  - icon        : composant Lucide
 *  - group       : groupe pour le regroupement dans la sidebar
 *  - dataKey     : clé dans le state global pour calculer la progression
 *  - component   : nom du fichier dans /sections (sans extension)
 */
const SECTIONS = [
  { id: "accueil",      label: "Accueil",                       icon: Home,       group: "Général",        dataKey: null },
  { id: "roles",        label: "1. Rôles & Accès",              icon: Shield,     group: "Configuration",  dataKey: "roles" },
  { id: "features",     label: "2. Accès fonctionnalités",      icon: Settings,   group: "Configuration",  dataKey: "featureAccess" },
  { id: "profile",      label: "3a. Profil utilisateur",        icon: Users,      group: "Données",        dataKey: "profileFields" },
  { id: "creation",     label: "3b. Création utilisateur",      icon: Users,      group: "Données",        dataKey: "profileFields" },
  { id: "processes",    label: "4. Processus & Workflows",      icon: FileText,   group: "Processus",      dataKey: "processes" },
  { id: "automations",  label: "5. Automatisations",            icon: Bell,       group: "Processus",      dataKey: "automations" },
  { id: "groups",       label: "5b. Groupes",                   icon: Layers,     group: "Processus",      dataKey: "groups" },
  { id: "widgets",      label: "6. Page d'accueil & Widgets",   icon: Layout,     group: "Interface",      dataKey: "widgets" },
  { id: "documents",    label: "6b. Modèles de documents",      icon: FolderOpen, group: "Interface",      dataKey: "docModels" },
  { id: "docbase",      label: "7. Base documentaire",          icon: Database,   group: "Interface",      dataKey: "docBase" },
  { id: "pso",          label: "8. PSO",                        icon: Puzzle,     group: "Avancé",         dataKey: "pso" },
];

export default SECTIONS;
