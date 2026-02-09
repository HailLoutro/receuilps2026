// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATABASE SERVICE — Firestore CRUD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Structure Firestore :
//
//   users/{uid}                  → profil (role, name, slug, createdAt)
//   template/current             → le template global (pages + blocks)
//   clients/{slug}               → métadonnées client (name, slug, createdAt)
//   clients/{slug}/data/recueil  → réponses du client au recueil
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs, query, orderBy, onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

// ── Template (global, partagé par tous les clients) ──────────

export async function getTemplate() {
  const snap = await getDoc(doc(db, "template", "current"));
  return snap.exists() ? snap.data() : null;
}

export async function saveTemplate(templateData) {
  await setDoc(doc(db, "template", "current"), {
    ...templateData,
    updatedAt: new Date().toISOString(),
  });
}

/** Écoute en temps réel les changements du template */
export function onTemplateChange(callback) {
  return onSnapshot(doc(db, "template", "current"), (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
}

// ── Clients ──────────────────────────────────────────────────

export async function getClients() {
  const snap = await getDocs(
    query(collection(db, "clients"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createClient({ slug, name, createdAt }) {
  await setDoc(doc(db, "clients", slug), { name, slug, createdAt });
}

export async function deleteClient(slug) {
  // Supprimer les données du client
  await deleteDoc(doc(db, "clients", slug, "data", "recueil"));
  // Supprimer le client
  await deleteDoc(doc(db, "clients", slug));
}

// ── Données client (réponses au recueil) ─────────────────────

export async function getClientData(slug) {
  const snap = await getDoc(doc(db, "clients", slug, "data", "recueil"));
  return snap.exists() ? snap.data() : {};
}

export async function saveClientData(slug, data) {
  await setDoc(doc(db, "clients", slug, "data", "recueil"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/** Écoute en temps réel les données d'un client */
export function onClientDataChange(slug, callback) {
  return onSnapshot(doc(db, "clients", slug, "data", "recueil"), (snap) => {
    callback(snap.exists() ? snap.data() : {});
  });
}

// ── Admins (liste depuis collection users) ───────────────────

export async function getAdmins() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs
    .map((d) => ({ uid: d.id, ...d.data() }))
    .filter((u) => u.role === "admin");
}
