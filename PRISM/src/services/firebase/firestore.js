// src/services/firestore.js
// All Firestore read/write operations for PRISM.
//
// Collections:
//   sessions/{sessionId}   — one training run
//   users/{userId}/history — references to sessions
//
// A "session" document shape:
// {
//   userId:     string | 'anonymous',
//   moduleId:   string,          // 'healthcare-cpr'
//   language:   string,          // 'hi'
//   startedAt:  Timestamp,
//   finishedAt: Timestamp | null,
//   elapsedSec: number,
//   scores:     number[],        // per-step scores
//   finalScore: number,
//   metrics: {
//     safety:    number,
//     precision: number,
//     speed:     number,
//   },
//   violations: {                // safety violation log
//     step:    number,
//     type:    string,
//     ts:      number,
//   }[],
// }

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ── Create a new session document when training starts ──────────────────────
export async function createSession({ userId = 'anonymous', moduleId, language }) {
  if (!db) return null;
  try {
    const ref = await addDoc(collection(db, 'sessions'), {
      userId,
      moduleId,
      language,
      startedAt:  serverTimestamp(),
      finishedAt: null,
      elapsedSec: 0,
      scores:     [],
      finalScore: 0,
      metrics:    { safety: 100, precision: 100, speed: 78 },
      violations: [],
    });
    return ref.id;
  } catch (err) {
    console.error('[Firestore] createSession failed:', err);
    return null;
  }
}

// ── Update session with final results when training completes ────────────────
export async function finalizeSession(sessionId, payload) {
  if (!db || !sessionId) return;
  try {
    await updateDoc(doc(db, 'sessions', sessionId), {
      ...payload,
      finishedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('[Firestore] finalizeSession failed:', err);
  }
}

// ── Log a safety violation mid-session ──────────────────────────────────────
export async function logViolation(sessionId, violation) {
  if (!db || !sessionId) return;
  try {
    const ref  = doc(db, 'sessions', sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const current = snap.data().violations || [];
    await updateDoc(ref, { violations: [...current, violation] });
  } catch (err) {
    console.error('[Firestore] logViolation failed:', err);
  }
}

// ── Fetch the N most recent sessions (leaderboard / history) ─────────────────
export async function getRecentSessions(limitN = 10) {
  if (!db) return [];
  try {
    const q    = query(collection(db, 'sessions'), orderBy('startedAt', 'desc'), limit(limitN));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[Firestore] getRecentSessions failed:', err);
    return [];
  }
}

// ── Fetch a single session by ID ─────────────────────────────────────────────
export async function getSession(sessionId) {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'sessions', sessionId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error('[Firestore] getSession failed:', err);
    return null;
  }
}