// ━━━ AUTH SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Admins  → Firebase Auth email/password → users/{uid} { role: "admin" }
// Clients → Firebase Anonymous Auth → lire clients/{slug} → vérifier mdp
//           → écrire users/{uid} { role: "client", slug }
//
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// ── Admin login (Firebase Auth email/password) ───────────────
export async function loginAdmin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getProfile(cred.user.uid);
  return { uid: cred.user.uid, email: cred.user.email, ...profile };
}

// ── Client login (Anonymous Auth + Firestore verification) ───
export async function loginClient(slug, username, password) {
  // 1. Connexion anonyme pour obtenir un token Firebase
  const cred = await signInAnonymously(auth);
  const uid = cred.user.uid;

  try {
    // 2. Lire le document client dans Firestore
    const snap = await getDoc(doc(db, "clients", slug));
    if (!snap.exists()) {
      await signOut(auth);
      return null;
    }

    const client = snap.data();

    // 3. Vérifier les credentials
    if (client.username !== username || client.password !== password) {
      await signOut(auth);
      return null;
    }

    // 4. Enregistrer le profil client dans users/{uid}
    //    (nécessaire pour que les règles Firestore reconnaissent ce client)
    await setDoc(doc(db, "users", uid), {
      role: "client",
      slug: slug,
      name: client.name,
      createdAt: new Date().toISOString(),
    });

    return { type: "client", uid, slug, name: client.name, username };
  } catch (err) {
    console.error("loginClient error:", err);
    // Cleanup en cas d'erreur
    try { await signOut(auth); } catch {}
    return null;
  }
}

// ── Profile ──────────────────────────────────────────────────
export async function getProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

// ── Créer un admin (Firebase Auth + Firestore profile) ───────
export async function createAdmin({ email, password, name }) {
  // Note: createUserWithEmailAndPassword va changer le current user.
  // On doit sauvegarder la session courante et la restaurer après.
  // En production, utiliser Firebase Admin SDK côté serveur.
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile = { role: "admin", name, createdAt: new Date().toISOString() };
  await setDoc(doc(db, "users", cred.user.uid), profile);
  return { uid: cred.user.uid, email: cred.user.email, ...profile };
}

// ── Logout ───────────────────────────────────────────────────
export async function logoutUser() {
  const user = auth.currentUser;
  if (user) {
    // Si c'est un client anonyme, nettoyer son profil users/{uid}
    if (user.isAnonymous) {
      try { await deleteDoc(doc(db, "users", user.uid)); } catch {}
    }
    await signOut(auth);
  }
}

// ── Auth state listener ──────────────────────────────────────
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const profile = await getProfile(fbUser.uid);
      if (profile) {
        callback({
          uid: fbUser.uid,
          email: fbUser.email,
          isAnonymous: fbUser.isAnonymous,
          ...profile,
        });
      } else {
        // User Firebase sans profil Firestore (anonymous pas encore enregistré)
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}
