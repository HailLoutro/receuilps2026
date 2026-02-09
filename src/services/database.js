// ━━━ DATABASE SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Firestore CRUD + cache mémoire
//
// Structure :
//   template/current           → template global
//   clients/{slug}             → { name, slug, username, password, createdAt }
//   clients/{slug}/data/recueil → réponses client
//   backups/{id}               → sauvegardes template (FIX #5)

import {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, query, orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

const cache = {};

// ── Template ─────────────────────────────────────────────────

export async function getTemplate() {
  if (cache.template) return cache.template;
  const snap = await getDoc(doc(db, "template", "current"));
  const val = snap.exists() ? snap.data() : null;
  cache.template = val;
  return val;
}

export async function saveTemplate(data) {
  cache.template = data;
  await setDoc(doc(db, "template", "current"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ── Clients (FIX #2: credentials dans Firestore) ────────────

export async function getClients() {
  const snap = await getDocs(
    query(collection(db, "clients"), orderBy("createdAt", "desc"))
  );
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  cache.clients = list;
  return list;
}

export async function createClient({ name, slug, username, password }) {
  const data = { name, slug, username, password, createdAt: new Date().toISOString() };
  await setDoc(doc(db, "clients", slug), data);
  delete cache.clients;
}

export async function deleteClient(slug) {
  await deleteDoc(doc(db, "clients", slug, "data", "recueil"));
  await deleteDoc(doc(db, "clients", slug));
  delete cache.clients;
}

// ── Client Data ──────────────────────────────────────────────

export async function getClientData(slug) {
  const key = `cdata-${slug}`;
  if (cache[key]) return cache[key];
  const snap = await getDoc(doc(db, "clients", slug, "data", "recueil"));
  const val = snap.exists() ? snap.data() : {};
  cache[key] = val;
  return val;
}

export async function saveClientData(slug, data) {
  cache[`cdata-${slug}`] = data;
  await setDoc(doc(db, "clients", slug, "data", "recueil"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ── Backups (FIX #5) ─────────────────────────────────────────

export async function getBackups() {
  try {
    const snap = await getDoc(doc(db, "meta", "backups"));
    return snap.exists() ? snap.data().list || [] : [];
  } catch { return []; }
}

export async function saveBackups(list) {
  await setDoc(doc(db, "meta", "backups"), { list });
}

// ── Admins ───────────────────────────────────────────────────

export async function getAdmins() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs
    .map(d => ({ uid: d.id, ...d.data() }))
    .filter(u => u.role === "admin");
}
