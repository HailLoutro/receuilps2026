// ━━━ AUTH SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #1: createUser est une opération admin-only, ne touche pas l'auth courante
// FIX #2: les clients ont des credentials en Firestore (pas Firebase Auth)

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/** Login admin via Firebase Auth */
export async function loginAdmin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getProfile(cred.user.uid);
  return { uid: cred.user.uid, email: cred.user.email, ...profile };
}

/** Login client via Firestore lookup (pas Firebase Auth) */
export async function loginClient(slug, username, password) {
  const snap = await getDoc(doc(db, "clients", slug));
  if (!snap.exists()) return null;
  const client = snap.data();
  if (client.username === username && client.password === password) {
    return { type: "client", ...client };
  }
  return null;
}

export async function getProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

/** Crée un compte admin Firebase Auth + profil Firestore */
export async function createAdmin({ email, password, name }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile = { role: "admin", name, createdAt: new Date().toISOString() };
  await setDoc(doc(db, "users", cred.user.uid), profile);
  return { uid: cred.user.uid, email: cred.user.email, ...profile };
}

export async function logoutUser() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const profile = await getProfile(fbUser.uid);
      callback({ uid: fbUser.uid, email: fbUser.email, ...profile });
    } else {
      callback(null);
    }
  });
}
