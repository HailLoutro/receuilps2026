// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION REGISTRY
// ➜ Pour ajouter une section :
//    1. Créez le fichier dans /sections/MonNouveau.jsx
//    2. Ajoutez l'entrée dans config/sections.js
//    3. Importez et mappez ici
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Accueil from "./Accueil";
import Roles from "./Roles";
import Features from "./Features";
import Profile from "./Profile";
import Creation from "./Creation";
import Processes from "./Processes";
import Automations from "./Automations";
import Groups from "./Groups";
import Widgets from "./Widgets";
import Documents from "./Documents";
import DocBase from "./DocBase";
import PSO from "./PSO";

const SECTION_COMPONENTS = {
  accueil: Accueil,
  roles: Roles,
  features: Features,
  profile: Profile,
  creation: Creation,
  processes: Processes,
  automations: Automations,
  groups: Groups,
  widgets: Widgets,
  documents: Documents,
  docbase: DocBase,
  pso: PSO,
};

export default SECTION_COMPONENTS;
