// src/App.jsx
// Screen router — renders the correct screen based on Zustand store state.
// A-Frame conflicts with React's reconciler if you try to mount/unmount
// a-scene repeatedly; we use CSS visibility instead of unmounting for the
// VR screen (handled inside VRTraining via the sceneRef innerHTML approach).

import { useEffect } from 'react';
import useStore    from './store/useStore';
import Landing     from './screens/Landing';
import ModuleSelect from './screens/ModuleSelect';
import VRTraining  from './screens/VRTraining';
import Dashboard   from './screens/Dashboard';
import Toast       from './components/Toast';

export default function App() {
  const screen = useStore(s => s.screen);

  // Warn if env vars are missing
  useEffect(() => {
    if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_firebase_api_key') {
      console.warn('[PRISM] Firebase env vars not set — Firestore persistence disabled. Copy .env.example → .env and fill in your keys.');
    }
    if (!import.meta.env.VITE_BHASHINI_API_KEY || import.meta.env.VITE_BHASHINI_API_KEY === 'your_bhashini_api_key_here') {
      console.warn('[PRISM] Bhashini API key not set — falling back to Web Speech API for TTS.');
    }
  }, []);

  return (
    <>
      {/* Always-on animated background */}
      <div className="grid-bg"/>

      {/* Screens — conditional render */}
      {screen === 'landing'   && <Landing />}
      {screen === 'modules'   && <ModuleSelect />}
      {screen === 'vr'        && <VRTraining />}
      {screen === 'dashboard' && <Dashboard />}

      {/* Global toast notification */}
      <Toast />
    </>
  );
}