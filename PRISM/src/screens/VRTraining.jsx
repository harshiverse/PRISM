// src/screens/VRTraining.jsx
// Practice mode — R3F scene with OrbitControls for mouse look.
// Replaces the previous A-Frame dangerouslySetInnerHTML approach.

import { useRef, useState, useCallback } from 'react';
import useStore from '../store/useStore';
import { useTrainingSession } from '../hooks/useTrainingSession';
import { useTimer } from '../hooks/useTimer';
import { speak, cancelSpeech } from '../services/bhashini';
import TrainingCanvas from '../components/Scene/TrainingCanvas';
import SceneLoader    from '../components/Scene/SceneLoader';
import MetricPanel    from '../components/HUD/MetricPanel';
import StepPanel      from '../components/HUD/StepPanel';
import StepDots       from '../components/HUD/StepDots';
import LanguagePanel  from '../components/HUD/LanguagePanel';

export default function VRTraining() {
  const flashRef = useRef(null);
  const store    = useStore();
  const { onHotspot, advanceStep, resumeAfterViolation } = useTrainingSession();
  const [showSuccess, setShowSuccess] = useState(false);

  // Run timer only while VR screen is active and not paused
  useTimer(store.screen === 'vr' && !store.paused);

  // Handle hotspot interaction from R3F scene
  const handleInteract = useCallback((type, worldPos) => {
    const cameraRot = { x: 0, y: 0, z: 0 }; // OrbitControls doesn't map to fixed rotation
    onHotspot(type, worldPos, cameraRot);
    triggerSuccessFX();
  }, [onHotspot]);

  function triggerSuccessFX() {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2200);
    if (flashRef.current) {
      flashRef.current.style.opacity = '1';
      setTimeout(() => { if (flashRef.current) flashRef.current.style.opacity = '0'; }, 400);
    }
  }

  const currentStep = store.steps[store.step];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column' }}>

      {/* R3F Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <TrainingCanvas
          mode="practice"
          onInteract={handleInteract}
          showSuccess={showSuccess}
        />
        <SceneLoader />

        {/* Action flash overlay */}
        <div ref={flashRef} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,230,118,0.12)',
          opacity: 0, pointerEvents: 'none', transition: 'opacity .3s',
          zIndex: 100,
        }} />

        {/* Safety violation pause overlay */}
        {store.paused && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,23,68,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, backdropFilter: 'blur(2px)',
          }}>
            <div style={{
              background: 'var(--bg-card)', border: '2px solid var(--red)',
              borderRadius: 6, padding: '2rem 2.5rem', textAlign: 'center',
              maxWidth: 420,
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontFamily: 'var(--ff-h)', color: 'var(--red)', fontSize: '1.5rem', marginBottom: '.6rem' }}>
                Safety Violation
              </h3>
              <p style={{ color: 'var(--txt2)', fontSize: '.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Precision was too low on a high-risk step. Review the instructions and proceed carefully.
              </p>
              <button onClick={resumeAfterViolation} style={{
                padding: '.7rem 2rem', background: 'var(--red)',
                color: '#fff', border: 'none', fontFamily: 'var(--ff-h)',
                fontWeight: 600, fontSize: '1rem', cursor: 'pointer', borderRadius: 3,
              }}>
                ▶ Resume Training
              </button>
            </div>
          </div>
        )}

        {/* HUD overlays */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 200 }}>

          <LanguagePanel />

          <StepDots total={store.steps.length} current={store.step} />

          <MetricPanel
            metrics={store.metrics}
            elapsed={store.elapsed}
          />

          <StepPanel
            step={store.step}
            total={store.steps.length}
            stepData={currentStep}
            lang={store.lang}
            onSpeak={(callbacks) => currentStep && speak(
              store.lang === 'en' ? currentStep.en : (currentStep.translations?.[store.lang] || currentStep.en),
              store.lang,
              callbacks,
            )}
            onNext={advanceStep}
          />

          <button
            onClick={() => { cancelSpeech(); store.setScreen('modules'); }}
            style={{
              position: 'absolute', bottom: 110, left: 14,
              padding: '.42rem .9rem', background: 'transparent',
              border: '1px solid var(--border)', color: 'var(--txt2)',
              fontSize: '.78rem', cursor: 'pointer', borderRadius: 2,
              pointerEvents: 'all', fontFamily: 'var(--ff-b)', transition: 'all .2s',
            }}>
            ← Exit Training
          </button>
        </div>
      </div>
    </div>
  );
}