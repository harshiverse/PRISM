// src/services/firebase/firebase.js
// Safe Firebase init — no-ops gracefully when env vars are absent.

import { initializeApp } from 'firebase/app';
import { getFirestore }  from 'firebase/firestore';
import { getAuth }       from 'firebase/auth';

const apiKey     = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId  = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const hasConfig  = !!(apiKey && projectId && !apiKey.startsWith('your_'));

let app  = null;
let db   = null;
let auth = null;

if (hasConfig) {
  try {
    app  = initializeApp({
      apiKey,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    });
    db   = getFirestore(app);
    auth = getAuth(app);
  } catch (e) {
    console.warn('[PRISM] Firebase init failed:', e.message);
    app = db = auth = null;
  }
} else {
  console.warn('[PRISM] Firebase env vars missing — Firestore disabled. Add keys to .env to enable.');
}

export { db, auth };
export default app;
