// ━━━ DATABASE SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, query, orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

const cache = {};

// ── Template ─────────────────────────────────────────────────

export async function getTemplate() {
  if (cache.template) return cache.template;
  try {
    const snap = await getDoc(doc(db, "template", "current"));
    const val = snap.exists() ? snap.data() : null;
    cache.template = val;
    return val;
  } catch (err) {
    console.warn("getTemplate error:", err);
    return null;
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

export async function getClients() {
  try {
    const snap = await getDocs(collection(db, "clients"));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cache.clients = list;
    return list;
  } catch (err) {
    console.warn("getClients error:", err);
    return cache.clients || [];
  }
}

export async function createClient({ name, slug, username, password }) {
  const data = { name, slug, username, password, createdAt: new Date().toISOString() };
  await setDoc(doc(db, "clients", slug), data);
  delete cache.clients;
}

export async function deleteClient(slug) {
  // Supprimer les données client d'abord (subcollection)
  // try/catch car le doc peut ne pas exister
  try {
    await deleteDoc(doc(db, "clients", slug, "data", "recueil"));
  } catch (err) {
    console.warn("deleteClient data cleanup:", err.message);
    // Pas grave, on continue
  }

  // Supprimer le document client principal
  await deleteDoc(doc(db, "clients", slug));
  delete cache.clients;
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
    console.warn("getClientData error:", err);
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
  } catch (err) {
    console.warn("getBackups error:", err);
    return [];
  }
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
  } catch (err) {
    console.warn("getAdmins error:", err);
    return [];
  }
}
