// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTH SERVICE — Gestion authentification Firebase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Firebase Auth gère les comptes utilisateurs (admin + clients).
// Chaque compte a un custom claim "role" : "admin" ou "client"
// et un claim "slug" pour les clients (identifie leur espace).
//
// ➜ Pour la création du 1er admin, utilisez la console Firebase
//    ou le script seeds/create-admin.js fourni.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/**
 * Login avec email/password.
 * Retourne les données user depuis Firestore (role, name, slug...).
 */
export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(cred.user.uid);
  return { uid: cred.user.uid, email: cred.user.email, ...profile };
}

/**
 * Récupère le profil utilisateur depuis Firestore.
 * Collection: users/{uid}
 */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data();
}

/**
 * Crée un compte utilisateur (admin ou client).
 * Utilisé par le panneau admin pour créer des clients.
 */
export async function createUser({ email, password, role, name, slug }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile = {
    role,       // "admin" | "client"
    name,       // Nom affiché
    slug,       // Slug client (null pour admin)
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", cred.user.uid), profile);
  return { uid: cred.user.uid, email: cred.user.email, ...profile };
}

/**
 * Déconnexion.
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Écoute les changements d'état d'authentification.
 * Retourne une fonction unsubscribe.
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      callback({ uid: firebaseUser.uid, email: firebaseUser.email, ...profile });
    } else {
      callback(null);
    }
  });
}
