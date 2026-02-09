// ━━━ STORAGE SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Couche cache mémoire devant Firestore pour éviter
// les lectures répétées sur un même document.

import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const cache = {};

export async function get(path, fallback = null) {
  if (cache[path] !== undefined) return cache[path];
  try {
    const snap = await getDoc(doc(db, ...path.split("/")));
    const val = snap.exists() ? snap.data() : fallback;
    cache[path] = val;
    return val;
  } catch (err) {
    console.warn("storage.get error:", path, err);
    return fallback;
  }
}

export async function set(path, value) {
  cache[path] = value;
  try {
    await setDoc(doc(db, ...path.split("/")), {
      ...value,
      _updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("storage.set error:", path, err);
  }
}

export async function del(path) {
  delete cache[path];
  try {
    await deleteDoc(doc(db, ...path.split("/")));
  } catch (err) {
    console.warn("storage.del error:", path, err);
  }
}

export function invalidate(path) {
  delete cache[path];
}
