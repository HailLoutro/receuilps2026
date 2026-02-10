// ━━━ DATABASE SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";

const cache = {};

// ── Template ─────────────────────────────────────────────────

export async function getTemplate() {
  // TOUJOURS lire Firestore (pas de cache pour le template — évite les templates "disparus")
  try {
    const snap = await getDoc(doc(db, "template", "current"));
    if (snap.exists()) {
      const val = snap.data();
      // Vérification basique que c'est un vrai template
      if (val && val.pages && val.pages.length > 0) {
        cache.template = val;
        return val;
      }
    }
    return null;
  } catch (err) {
    console.warn("getTemplate:", err);
    // En cas d'erreur réseau, retourner le cache s'il existe
    return cache.template || null;
  }
}

export async function saveTemplate(data) {
  cache.template = data;
  await setDoc(doc(db, "template", "current"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ── Clients ──────────────────────────────────────────────────
// L'admin écrit UNIQUEMENT dans Firestore.
// Le compte Firebase Auth est créé automatiquement au premier login client.

export async function getClients() {
  try {
    const snap = await getDocs(collection(db, "clients"));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cache.clients = list;
    return list;
  } catch (err) {
    console.warn("getClients:", err);
    return cache.clients || [];
  }
}

export async function createClient({ name, slug, username, password }) {
  // Juste écrire dans Firestore — PAS de Firebase Auth ici
  await setDoc(doc(db, "clients", slug), {
    name,
    slug,
    username,
    password,
    createdAt: new Date().toISOString(),
  });
  delete cache.clients;
}

export async function deleteClient(slug) {
  // 1. Supprimer les données (subcollection)
  try {
    await deleteDoc(doc(db, "clients", slug, "data", "recueil"));
  } catch (err) {
    console.warn("deleteClient data:", err.message);
  }

  // 2. Supprimer le doc client
  await deleteDoc(doc(db, "clients", slug));
  delete cache.clients;

  // Note: le compte Firebase Auth {slug}@client.ps reste orphelin.
  // Il sera nettoyé manuellement ou via Cloud Function.
  // Ça n'empêche rien de fonctionner.
}

// ── Client Data ──────────────────────────────────────────────

export async function getClientData(slug) {
  const key = `cdata-${slug}`;
  if (cache[key]) return cache[key];
  try {
    const snap = await getDoc(doc(db, "clients", slug, "data", "recueil"));
    const val = snap.exists() ? snap.data() : {};
    cache[key] = val;
    return val;
  } catch (err) {
    console.warn("getClientData:", err);
    return {};
  }
}

export async function saveClientData(slug, data) {
  cache[`cdata-${slug}`] = data;
  await setDoc(doc(db, "clients", slug, "data", "recueil"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ── Backups ──────────────────────────────────────────────────

export async function getBackups() {
  try {
    const snap = await getDoc(doc(db, "meta", "backups"));
    return snap.exists() ? (snap.data().list || []) : [];
  } catch { return []; }
}

export async function saveBackups(list) {
  await setDoc(doc(db, "meta", "backups"), { list });
}

// ── Admins ───────────────────────────────────────────────────

export async function getAdmins() {
  try {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs
      .map(d => ({ uid: d.id, ...d.data() }))
      .filter(u => u.role === "admin");
  } catch { return []; }
}
