// src/services/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore }  from 'firebase/firestore';
import { getAuth }       from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId &&
  !firebaseConfig.apiKey.startsWith('your_'));

let app      = null;
let db       = null;
let auth     = null;
let analytics = null;

if (hasConfig) {
  try {
    app  = initializeApp(firebaseConfig);
    db   = getFirestore(app);
    auth = getAuth(app);
    // Analytics only works in browser environments (not SSR/Node)
    isSupported().then(yes => {
      if (yes) analytics = getAnalytics(app);
    });
  } catch (e) {
    console.warn('[PRISM] Firebase init failed:', e.message);
    app = db = auth = null;
  }
} else {
  console.warn('[PRISM] Firebase env vars missing — running without persistence.');
}

export { db, auth, analytics };
export default app;
