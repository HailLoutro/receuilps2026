// ━━━ AUTH SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// STRATÉGIE ROBUSTE :
//
// Admin  → Firebase Auth email/password classique
//
// Client → Auto-provisioning :
//   1. Lire clients/{slug} dans Firestore (règle: lecture publique)
//   2. Vérifier username + password côté client
//   3. signIn Firebase Auth avec email synthétique {slug}@client.ps
//   4. Si le compte Auth n'existe pas → le créer à la volée
//   5. Écrire users/{uid} avec role=client pour les règles Firestore
//
// L'admin ne crée AUCUN compte Firebase Auth pour les clients.
// Il écrit juste dans Firestore. Le client se provisionne lui-même.
//

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, secondaryAuth, db } from "../config/firebase";

// Email synthétique pour Firebase Auth (les clients n'ont pas de vrais emails)
const toAuthEmail = (slug) => `${slug}@client.ps`;

// ══════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════

export async function loginAdmin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// Créer un admin via l'app secondaire (ne déconnecte pas l'admin courant)
export async function createAdminAccount(email, password, name) {
  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    role: "admin",
    name,
    email,
    createdAt: new Date().toISOString(),
  });
  await signOut(secondaryAuth);
  return { uid: cred.user.uid, email, name };
}

// ══════════════════════════════════════════════════════════════
// CLIENT — AUTO-PROVISIONING
// ══════════════════════════════════════════════════════════════

export async function loginClient(slug, username, password) {
  // ÉTAPE 1 : Lire le doc client dans Firestore (règle: lecture publique)
  let clientDoc;
  try {
    const snap = await getDoc(doc(db, "clients", slug));
    if (!snap.exists()) {
      console.error(`Client "${slug}" introuvable dans Firestore`);
      return null;
    }
    clientDoc = snap.data();
  } catch (err) {
    console.error("Erreur lecture client Firestore:", err.code, err.message);
    return null;
  }

  // ÉTAPE 2 : Vérifier les credentials
  if (clientDoc.username !== username || clientDoc.password !== password) {
    console.error("Username ou password incorrect");
    return null;
  }

  // ÉTAPE 3 : Se connecter à Firebase Auth (ou créer le compte)
  const authEmail = toAuthEmail(slug);
  let cred;

  try {
    // Essayer de se connecter
    cred = await signInWithEmailAndPassword(auth, authEmail, password);
  } catch (err) {
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
      // Le compte Firebase Auth n'existe pas encore → le créer
      try {
        cred = await createUserWithEmailAndPassword(auth, authEmail, password);
      } catch (createErr) {
        if (createErr.code === "auth/email-already-in-use") {
          // Le compte existe mais le password a changé dans Firestore
          // On ne peut pas le modifier sans Admin SDK
          console.error("Le compte Auth existe avec un ancien mot de passe. Supprimez-le dans Firebase Console > Authentication.");
          return null;
        }
        console.error("Erreur création compte Auth:", createErr.code, createErr.message);
        return null;
      }
    } else {
      console.error("Erreur signIn Auth:", err.code, err.message);
      return null;
    }
  }

  // ÉTAPE 4 : Écrire/mettre à jour le profil dans users/{uid}
  try {
    await setDoc(doc(db, "users", cred.user.uid), {
      role: "client",
      slug,
      name: clientDoc.name,
      username,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erreur écriture profil:", err.code, err.message);
    // On continue quand même, le login a fonctionné
  }

  return {
    type: "client",
    uid: cred.user.uid,
    slug,
    name: clientDoc.name,
    username,
  };
}

// ══════════════════════════════════════════════════════════════
// COMMUN
// ══════════════════════════════════════════════════════════════

export async function getProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const profile = await getProfile(fbUser.uid);
      if (profile) {
        callback({ uid: fbUser.uid, email: fbUser.email, ...profile });
      } else {
        // User Firebase sans profil (ne devrait pas arriver)
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}
