// src/screens/ARTraining.jsx
// WebXR PRO mode — Augmented Reality with spatial tracking.
// The camera feed shows the real world; a 3D model is anchored to the floor.
// Requires: Android Chrome + ARCore. iOS not supported for this mode.
//
// This screen keeps the raw WebXR hook (useARSession) for session management,
// but renders the 3D training model via R3F Canvas.

import { useEffect, useRef, useState, useCallback } from 'react';
import useStore from '../store/useStore';
import { useTrainingSession } from '../hooks/useTrainingSession';
import { useTimer } from '../hooks/useTimer';
import { useARSession } from '../hooks/useARSession';
import { speak, cancelSpeech } from '../services/bhashini';
import TrainingCanvas from '../components/Scene/TrainingCanvas';
import SceneLoader    from '../components/Scene/SceneLoader';
import MetricPanel    from '../components/HUD/MetricPanel';
import StepPanel      from '../components/HUD/StepPanel';
import StepDots       from '../components/HUD/StepDots';

export default function ARTraining() {
  const store   = useStore();
  const { advanceStep, resumeAfterViolation, onHotspot } = useTrainingSession();
  const {
    arSupported, arReason,
    sessionActive, modelPlaced,
    reticlePose, stability,
    checkSupport, startSession, endSession,
  } = useARSession();

  const [checking, setChecking] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const flashRef = useRef(null);

  useTimer(store.screen === 'ar' && !store.paused && sessionActive);

  // Check AR support on mount
  useEffect(() => {
    checkSupport().finally(() => setChecking(false));
    return () => endSession();
  }, []);

  const handleInteract = useCallback((type, worldPos) => {
    onHotspot(type, worldPos, { x: 0, y: 0, z: 0 });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2200);
  }, [onHotspot]);

  const currentStep = store.steps[store.step];

  // Not supported fallback
  if (checking) {
    return <ARStatusScreen icon="⏳" title="Checking AR Support…" subtitle="Verifying device capabilities" />;
  }

  if (arSupported === false) {
    return (
      <ARStatusScreen
        icon="🥽"
        title="AR Not Available"
        subtitle={arReason || 'This device does not support WebXR AR mode.'}
        detail="WebXR AR requires Android Chrome with ARCore installed. iOS is not supported for Pro mode."
        action={{ label: '← Back to Modules', onClick: () => store.setScreen('modules') }}
        warn
      />
    );
  }

  // Pre-session: prompt to start
  if (!sessionActive) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10,
        background: '#020c1b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: '#0d1f35', border: '1px solid #f5a623',
          borderRadius: 10, padding: '2.5rem 2.8rem',
          maxWidth: 420, textAlign: 'center',
          boxShadow: '0 0 40px rgba(245,166,35,0.15)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥽</div>
          <h2 style={{ fontFamily: 'var(--ff-h)', color: '#f5a623', fontSize: '1.5rem', marginBottom: '.6rem' }}>
            WebXR Pro Mode
          </h2>
          <p style={{ color: 'var(--txt2)', fontSize: '.95rem', lineHeight: 1.7, marginBottom: '.8rem' }}>
            Your camera will activate. Point it at a flat surface — the floor or a table.
            A life-sized 3D model will appear anchored to your real environment.
          </p>
          <p style={{ color: 'var(--txt3)', fontSize: '.82rem', lineHeight: 1.6, marginBottom: '1.6rem' }}>
            Walk around the model to inspect it from all angles. Move within reach of hotspots to interact.
            Your physical stability affects your Precision Score.
          </p>
          <div style={{ display: 'flex', gap: '.8rem' }}>
            <button
              onClick={startSession}
              style={{
                flex: 1, padding: '.8rem',
                background: '#f5a623', color: '#0d1117',
                border: 'none', borderRadius: 5,
                fontFamily: 'var(--ff-h)', fontWeight: 700,
                fontSize: '1rem', cursor: 'pointer',
                transition: 'filter .2s',
              }}
              onMouseEnter={e => e.target.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
            >
              ⚡ Launch AR Session
            </button>
            <button
              onClick={() => store.setScreen('modules')}
              style={{
                padding: '.8rem 1.2rem', background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--txt2)',
                borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--ff-b)',
              }}
            >Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // Active AR session
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>

      {/* R3F scene overlaid on AR camera feed */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <TrainingCanvas
          mode="ar"
          onInteract={handleInteract}
          showSuccess={showSuccess}
        />
        <SceneLoader />
      </div>

      {/* DOM overlay */}
      <div id="ar-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 200 }}>

        {/* Flash */}
        <div ref={flashRef} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(245,166,35,0.12)',
          opacity: 0, pointerEvents: 'none', transition: 'opacity .3s',
        }} />

        {/* Pro mode badge */}
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.35)',
          borderRadius: 20, padding: '.35rem 1rem',
          fontFamily: 'var(--ff-m)', fontSize: '.68rem', color: '#f5a623',
          letterSpacing: '.1em', pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: '.5rem',
        }}>
          <span>🥽</span> WEBXR PRO — AR ACTIVE
        </div>

        {/* Stability meter */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(7,18,36,0.88)', border: '1px solid var(--border)',
          borderRadius: 3, padding: '.7rem .9rem', minWidth: 140,
          pointerEvents: 'all',
        }}>
          <div style={{ fontFamily: 'var(--ff-m)', fontSize: '.58rem', color: 'var(--txt3)', marginBottom: '.4rem', letterSpacing: '.1em' }}>
            HAND STABILITY
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: '.3rem' }}>
            <div style={{
              width: `${stability}%`, height: '100%', borderRadius: 3,
              background: stability > 70 ? 'var(--green)' : stability > 40 ? 'var(--amber)' : 'var(--red)',
              transition: 'width .3s ease',
            }} />
          </div>
          <div style={{ fontFamily: 'var(--ff-m)', fontSize: '.7rem',
            color: stability > 70 ? 'var(--green)' : stability > 40 ? 'var(--amber)' : 'var(--red)' }}>
            {stability}% stable
          </div>
        </div>

        {/* Reticle hint */}
        {!modelPlaced && (
          <div style={{
            position: 'absolute', bottom: 200, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(7,18,36,0.88)', border: '1px solid rgba(245,166,35,0.3)',
            borderRadius: 20, padding: '.45rem 1.2rem',
            fontFamily: 'var(--ff-m)', fontSize: '.75rem', color: '#f5a623',
            pointerEvents: 'none',
            opacity: reticlePose ? 1 : 0.5,
          }}>
            {reticlePose ? '✓ Surface detected — tap to place model' : '⟳ Slowly scan the floor…'}
          </div>
        )}

        <StepDots total={store.steps.length} current={store.step} />

        <MetricPanel metrics={store.metrics} elapsed={store.elapsed} />

        <StepPanel
          step={store.step}
          total={store.steps.length}
          stepData={currentStep}
          lang={store.lang}
          onSpeak={(callbacks) => currentStep && speak(
            store.lang === 'en' ? currentStep.en : (currentStep.translations?.[store.lang] || currentStep.en),
            store.lang, callbacks,
          )}
          onNext={advanceStep}
        />

        <button
          onClick={() => { endSession(); cancelSpeech(); store.setScreen('modules'); }}
          style={{
            position: 'absolute', bottom: 110, left: 14,
            padding: '.42rem .9rem', background: 'transparent',
            border: '1px solid var(--border)', color: 'var(--txt2)',
            fontSize: '.78rem', cursor: 'pointer', borderRadius: 2,
            pointerEvents: 'all', fontFamily: 'var(--ff-b)',
          }}>
          ← Exit AR
        </button>
      </div>
    </div>
  );
}

// Simple status/error screen
function ARStatusScreen({ icon, title, subtitle, detail, action, warn }) {
  const store = useStore();
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10, background: '#020c1b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#0d1f35',
        border: `1px solid ${warn ? 'var(--amber)' : 'var(--border)'}`,
        borderRadius: 10, padding: '2.5rem', maxWidth: 400, textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ fontFamily: 'var(--ff-h)', color: warn ? 'var(--amber)' : 'var(--txt1)', fontSize: '1.3rem', marginBottom: '.5rem' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--txt2)', fontSize: '.9rem', lineHeight: 1.65, marginBottom: detail ? '.6rem' : '1.4rem' }}>
          {subtitle}
        </p>
        {detail && (
          <p style={{ color: 'var(--txt3)', fontSize: '.8rem', lineHeight: 1.6, marginBottom: '1.4rem' }}>
            {detail}
          </p>
        )}
        {action && (
          <button onClick={action.onClick} style={{
            padding: '.7rem 1.8rem', background: 'var(--saffron)', color: 'var(--bg-deep)',
            border: 'none', borderRadius: 5, fontFamily: 'var(--ff-h)',
            fontWeight: 700, cursor: 'pointer',
          }}>{action.label}</button>
        )}
      </div>
    </div>
  );
}
