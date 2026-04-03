// src/screens/BeginnerTraining.jsx
// Beginner → Pro mode — R3F scene with gyroscope-driven camera.
// The user tilts/rotates their phone to look around the scene.
// Hotspots are triggered by tap (R3F onClick).
// Works on all devices — iOS and Android.

import { useRef, useState, useCallback, useEffect } from 'react';
import useStore from '../store/useStore';
import { useTrainingSession } from '../hooks/useTrainingSession';
import { useTimer } from '../hooks/useTimer';
import { useGyroscope } from '../hooks/useGyroscope';
import { speak, cancelSpeech } from '../services/bhashini';
import TrainingCanvas from '../components/Scene/TrainingCanvas';
import SceneLoader    from '../components/Scene/SceneLoader';
import MetricPanel    from '../components/HUD/MetricPanel';
import StepPanel      from '../components/HUD/StepPanel';
import StepDots       from '../components/HUD/StepDots';
import LanguagePanel  from '../components/HUD/LanguagePanel';

export default function BeginnerTraining() {
  const flashRef = useRef(null);
  const store    = useStore();
  const { onHotspot, advanceStep, resumeAfterViolation } = useTrainingSession();
  const { supported, granted, requestPermission } = useGyroscope();
  const [showPermPrompt, setShowPermPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useTimer(store.screen === 'beginner' && !store.paused);

  // Check if iOS permission is needed
  useEffect(() => {
    const needsPermission =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function';
    if (needsPermission && !granted) setShowPermPrompt(true);
  }, [granted]);

  // Handle hotspot interaction from R3F scene
  const handleInteract = useCallback((type, worldPos) => {
    onHotspot(type, worldPos, { x: 0, y: 0, z: 0 });
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
          mode="beginner"
          onInteract={handleInteract}
          showSuccess={showSuccess}
        />
        <SceneLoader />

        {/* Flash overlay */}
        <div ref={flashRef} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,201,167,0.14)',
          opacity: 0, pointerEvents: 'none', transition: 'opacity .3s', zIndex: 100,
        }} />

        {/* iOS permission prompt */}
        {showPermPrompt && !granted && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 400,
            background: 'rgba(2,12,27,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: '#0d1f35', border: '1px solid #00c9a7',
              borderRadius: 10, padding: '2rem 2.2rem',
              maxWidth: 360, textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ fontFamily: 'var(--ff-h)', color: '#00c9a7', marginBottom: '.6rem' }}>
                Enable Gyroscope
              </h3>
              <p style={{ color: 'var(--txt2)', fontSize: '.9rem', lineHeight: 1.65, marginBottom: '1.4rem' }}>
                Beginner Mode uses your phone's gyroscope to let you look around the scene by tilting your device.
                Tap below to grant sensor access.
              </p>
              <button
                onClick={async () => {
                  const ok = await requestPermission();
                  if (ok) setShowPermPrompt(false);
                }}
                style={{
                  width: '100%', padding: '.75rem',
                  background: '#00c9a7', color: '#0d1117',
                  border: 'none', borderRadius: 5,
                  fontFamily: 'var(--ff-h)', fontWeight: 700,
                  fontSize: '1rem', cursor: 'pointer',
                }}>
                Allow Gyroscope Access
              </button>
            </div>
          </div>
        )}

        {/* Safety violation overlay */}
        {store.paused && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,23,68,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, backdropFilter: 'blur(2px)',
          }}>
            <div style={{
              background: 'var(--bg-card)', border: '2px solid var(--red)',
              borderRadius: 6, padding: '2rem 2.5rem', textAlign: 'center', maxWidth: 420,
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontFamily: 'var(--ff-h)', color: 'var(--red)', fontSize: '1.5rem', marginBottom: '.6rem' }}>
                Safety Violation
              </h3>
              <p style={{ color: 'var(--txt2)', fontSize: '.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Review the step instructions carefully before proceeding.
              </p>
              <button onClick={resumeAfterViolation} style={{
                padding: '.7rem 2rem', background: 'var(--red)',
                color: '#fff', border: 'none', fontFamily: 'var(--ff-h)',
                fontWeight: 600, fontSize: '1rem', cursor: 'pointer', borderRadius: 3,
              }}>▶ Resume</button>
            </div>
          </div>
        )}

        {/* Gyroscope status indicator */}
        {!supported && (
          <div style={{
            position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(255,183,0,0.12)', border: '1px solid rgba(255,183,0,0.3)',
            borderRadius: 20, padding: '.3rem .9rem', zIndex: 250,
            fontFamily: 'var(--ff-m)', fontSize: '.68rem', color: 'var(--amber)',
            pointerEvents: 'none',
          }}>
            ⚠ Gyroscope not detected — use mouse to look around
          </div>
        )}

        {/* HUD */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 200 }}>

          <StepDots
            total={store.steps.length}
            current={store.step}
            modeBadge={{ icon: '📱', label: 'BEG', color: '#00c9a7' }}
          />

          <MetricPanel metrics={store.metrics} elapsed={store.elapsed} />

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
