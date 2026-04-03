// src/App.jsx
// Screen router with animated page transitions via framer-motion.

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useStore       from './store/useStore';
import Landing        from './screens/Landing';
import ModuleSelect   from './screens/ModuleSelect';
import VRTraining     from './screens/VRTraining';
import BeginnerTraining from './screens/BeginnerTraining';
import ARTraining     from './screens/ARTraining';
import Dashboard      from './screens/Dashboard';
import Toast          from './components/Toast';
import AuthModal      from './components/AuthModal';

const pageVariants = {
  initial:  { opacity: 0, y: 16, scale: 0.99 },
  animate:  { opacity: 1, y: 0,  scale: 1 },
  exit:     { opacity: 0, y: -12, scale: 0.99 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.25, 0.46, 0.45, 0.94],
};

// Training screens use a faster, subtler transition (no layout shift)
const trainingVariants = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1 },
  exit:     { opacity: 0 },
};

const trainingTransition = {
  duration: 0.25,
  ease: 'easeOut',
};

function PageWrap({ children, isTraining = false }) {
  return (
    <motion.div
      variants={isTraining ? trainingVariants : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={isTraining ? trainingTransition : pageTransition}
      style={{ position: 'fixed', inset: 0, zIndex: 10 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const screen = useStore(s => s.screen);

  // Warn if env vars are missing
  useEffect(() => {
    if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_firebase_api_key') {
      console.warn('[PRISM] Firebase env vars not set — Firestore persistence disabled.');
    }
    if (!import.meta.env.VITE_BHASHINI_API_KEY || import.meta.env.VITE_BHASHINI_API_KEY === 'your_bhashini_api_key_here') {
      console.warn('[PRISM] Bhashini API key not set — falling back to Web Speech API for TTS.');
    }
  }, []);

  return (
    <>
      {/* Always-on animated background */}
      <div className="grid-bg"/>

      {/* Screens — animated transitions */}
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <PageWrap key="landing">
            <Landing />
          </PageWrap>
        )}
        {screen === 'modules' && (
          <PageWrap key="modules">
            <ModuleSelect />
          </PageWrap>
        )}
        {screen === 'vr' && (
          <PageWrap key="vr" isTraining>
            <VRTraining />
          </PageWrap>
        )}
        {screen === 'beginner' && (
          <PageWrap key="beginner" isTraining>
            <BeginnerTraining />
          </PageWrap>
        )}
        {screen === 'ar' && (
          <PageWrap key="ar" isTraining>
            <ARTraining />
          </PageWrap>
        )}
        {screen === 'dashboard' && (
          <PageWrap key="dashboard">
            <Dashboard />
          </PageWrap>
        )}
      </AnimatePresence>

      {/* Global toast notification */}
      <Toast />

      {/* Auth modal (login/signup) */}
      <AuthModal />
    </>
  );
}