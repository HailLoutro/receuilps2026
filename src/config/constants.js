// ━━━ CONSTANTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import {
  Type, FileText, Info, Image, Video, Table,
  Home, Shield, Settings, Users, Bell, Layers, Layout,
  FolderOpen, Database, Puzzle, BookOpen, Package,
} from "lucide-react";

export const BRAND = {
  name: "PeopleSpheres",
  font: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
};

export const BLOCK_TYPES = [
  { type: "heading", label: "Titre", icon: Type, desc: "Titre de section" },
  { type: "text", label: "Texte", icon: FileText, desc: "Paragraphe libre" },
  { type: "info", label: "Info", icon: Info, desc: "Encart conseil" },
  { type: "image", label: "Image", icon: Image, desc: "Image uploadée ou URL" },
  { type: "video", label: "Vidéo", icon: Video, desc: "Vidéo embarquée" },
  { type: "table", label: "Tableau", icon: Table, desc: "Tableau éditable" },
];

export const COL_TYPES = ["text", "select", "check", "number"];

// FIX #4: plus de groupes — juste les icônes
export const ICONS = {
  Home, Shield, Settings, Users, FileText, Bell,
  Layers, Layout, FolderOpen, Database, Puzzle, BookOpen, Package, Table,
};

let _u = 0;
export const uid = (p = "id") => `${p}_${++_u}_${Date.now().toString(36)}`;
