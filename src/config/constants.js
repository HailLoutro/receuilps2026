// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS — Branding, types de blocs, options
// ➜ Modifier ici pour changer le branding ou ajouter des types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import {
  Type, FileText, Info, Image, Video, Table,
  Home, Shield, Settings, Users, Bell, Layers, Layout,
  FolderOpen, Database, Puzzle, BookOpen, Package,
} from "lucide-react";

// ── Branding ─────────────────────────────────────────────────

export const BRAND = {
  name: "PeopleSpheres",
  subtitle: "Recueil du besoin",
};

// ── Types de blocs disponibles dans l'éditeur ────────────────

export const BLOCK_TYPES = [
  { type: "heading", label: "Titre",  icon: Type,     desc: "Titre de section" },
  { type: "text",    label: "Texte",  icon: FileText, desc: "Paragraphe libre" },
  { type: "info",    label: "Info",   icon: Info,     desc: "Encart conseil / info" },
  { type: "image",   label: "Image",  icon: Image,    desc: "Image avec URL" },
  { type: "video",   label: "Vidéo",  icon: Video,    desc: "Vidéo embarquée" },
  { type: "table",   label: "Tableau",icon: Table,    desc: "Tableau éditable" },
];

// ── Types de colonnes pour les tableaux ──────────────────────

export const TABLE_COL_TYPES = ["text", "select", "check", "number"];

// ── Mapping icônes pour le sélecteur de pages ────────────────

export const ICON_MAP = {
  Home, Shield, Settings, Users, FileText, Bell,
  Layers, Layout, FolderOpen, Database, Puzzle, BookOpen,
  Package, Table,
};

// ── Variantes info box ───────────────────────────────────────

export const INFO_VARIANTS = [
  { value: "info",    label: "ℹ️ Info" },
  { value: "tip",     label: "💡 Conseil" },
  { value: "warning", label: "⚠️ Attention" },
];

// ── Helpers ──────────────────────────────────────────────────

let _uid = 0;
export const uid = (prefix = "id") =>
  `${prefix}_${++_uid}_${Date.now().toString(36)}`;
