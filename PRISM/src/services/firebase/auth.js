// src/services/firebase/auth.js
// Firebase Authentication service — Email/Password + Google sign-in.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

// ── Sign Up (email/password) ──────────────────────────────────────────────────
export async function signUpWithEmail(email, password, displayName) {
  if (!auth) throw new Error('Firebase not initialized');
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

// ── Sign In (email/password) ──────────────────────────────────────────────────
export async function signInWithEmail(email, password) {
  if (!auth) throw new Error('Firebase not initialized');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ── Sign In with Google ───────────────────────────────────────────────────────
export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase not initialized');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// ── Sign Out ──────────────────────────────────────────────────────────────────
export async function logOut() {
  if (!auth) return;
  await signOut(auth);
}

// ── Auth State Listener ───────────────────────────────────────────────────────
export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
