// src/screens/VRTraining.jsx
// A-Frame is loaded as a side-effect import (CDN via index.html is simpler,
// but we import here to keep everything in the module graph).
// IMPORTANT: A-Frame must be imported BEFORE any a-* JSX tags are evaluated.
// We handle this by using dangerouslySetInnerHTML for the scene to avoid
// React's reconciler clashing with A-Frame's custom element management.

import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { useTrainingSession } from '../hooks/useTrainingSession';
import { useTimer, formatTime } from '../hooks/useTimer';
import { speak, cancelSpeech } from '../services/bhashini';
import MetricPanel from '../components/HUD/MetricPanel';
import StepPanel   from '../components/HUD/StepPanel';
import StepDots    from '../components/HUD/StepDots';
import LanguagePanel from '../components/HUD/LanguagePanel';

const SCENE_HTML = `
<a-scene
  embedded
  renderer="colorManagement:true; physicallyCorrectLights:true; antialias:true"
  vr-mode-ui="enabled:true"
  loading-screen="dotsColor:#FF9933; backgroundColor:#020c1b"
  style="width:100%;height:100%;">

  <a-assets>
    <a-mixin id="glow-pulse"
      animation__a="property:material.emissiveIntensity;from:0.2;to:0.8;dur:900;dir:alternate;loop:true;easing:easeInOutSine">
    </a-mixin>
  </a-assets>

  <a-sky color="#06101e"></a-sky>
  <a-plane position="0 0 0" rotation="-90 0 0" width="22" height="22"
    material="color:#0b1928; roughness:0.85; metalness:0.15"></a-plane>
  <a-plane position="0 0.003 0" rotation="-90 0 0" width="22" height="22"
    material="color:#00E5FF; opacity:0.04; wireframe:true"></a-plane>
  <a-plane position="0 3.5 -8" width="22" height="7"
    material="color:#071422; roughness:0.95"></a-plane>
  <a-plane position="-8 3.5 0" rotation="0 90 0" width="16" height="7"
    material="color:#071422; roughness:0.95"></a-plane>
  <a-plane position="8 3.5 0" rotation="0 -90 0" width="16" height="7"
    material="color:#071422; roughness:0.95"></a-plane>

  <!-- Banner -->
  <a-entity position="0 6.2 -7.8">
    <a-plane width="10" height="0.7"
      material="color:#FF1744; opacity:0.18; emissive:#FF1744; emissiveIntensity:0.15"></a-plane>
    <a-text value="EMERGENCY SIMULATION  ·  CPR FIRST AID TRAINING  ·  PRISM HEALTHCARE"
      position="0 0 0.02" align="center" color="#FF6B6B" scale="0.45 0.45 0.45" wrap-count="80"></a-text>
  </a-entity>

  <!-- Ceiling lights -->
  <a-plane position="0 7 -4" rotation="90 0 0" width="6" height="0.3"
    material="color:#E0F0FF; emissive:#E0F0FF; emissiveIntensity:0.6; opacity:0.9"></a-plane>
  <a-plane position="0 7 -2" rotation="90 0 0" width="6" height="0.3"
    material="color:#E0F0FF; emissive:#E0F0FF; emissiveIntensity:0.6; opacity:0.9"></a-plane>

  <!-- Lighting -->
  <a-light type="ambient"     color="#0d2545" intensity="0.7"></a-light>
  <a-light type="directional" position="1 8 4" color="#D8ECFF" intensity="0.75"></a-light>
  <a-light type="point"       position="-3 4 0" color="#FF9933" intensity="0.25" distance="12"></a-light>
  <a-light type="point"       position="3 4 -5" color="#00E5FF" intensity="0.2"  distance="10"></a-light>

  <!-- Patient -->
  <a-entity id="patient" position="0 0 -3.2">
    <a-box position="0 0.14 0" width="0.52" height="0.28" depth="1.3"
      material="color:#E5C09A; roughness:0.9; metalness:0"></a-box>
    <a-sphere position="0 0.18 0.8" radius="0.17"
      material="color:#E5C09A; roughness:0.88"></a-sphere>
    <a-sphere position="0 0.28 0.8" radius="0.16" scale="1 0.5 1"
      material="color:#3D2000; roughness:0.95"></a-sphere>
    <a-box position=" 0.37 0.1 0.12" width="0.15" height="0.12" depth="0.85"
      material="color:#E5C09A; roughness:0.9"></a-box>
    <a-box position="-0.37 0.1 0.12" width="0.15" height="0.12" depth="0.85"
      material="color:#E5C09A; roughness:0.9"></a-box>
    <a-box position=" 0.15 0.1 -0.65" width="0.22" height="0.14" depth="0.95"
      material="color:#2D4A7A; roughness:0.9"></a-box>
    <a-box position="-0.15 0.1 -0.65" width="0.22" height="0.14" depth="0.95"
      material="color:#2D4A7A; roughness:0.9"></a-box>

    <!-- Chest hotspot -->
    <a-cylinder id="chest-hs" class="clickable"
      position="0 0.31 0.12" radius="0.18" height="0.06"
      material="color:#FF1744; opacity:0.55; emissive:#FF1744; emissiveIntensity:0.3"
      animation__p="property:material.opacity;from:0.3;to:0.75;dur:700;dir:alternate;loop:true"
      animation__s="property:scale;from:1 1 1;to:1.05 1 1.05;dur:700;dir:alternate;loop:true"
      data-hotspot="chest">
    </a-cylinder>
    <a-ring position="0 0.32 0.12" rotation="-90 0 0" radius-inner="0.2" radius-outer="0.24"
      material="color:#FF1744; opacity:0.4; emissive:#FF1744; emissiveIntensity:0.2"
      animation="property:rotation;to:-90 360 0;dur:4000;loop:true;easing:linear"></a-ring>
    <a-text value="▼ Interact\nChest" position="0 0.6 0.12"
      align="center" color="#FF6B6B" scale="0.3 0.3 0.3"></a-text>
  </a-entity>

  <!-- AED -->
  <a-entity id="aed" position="2.8 0 -2.4">
    <a-cylinder position="0 0.35 0" radius="0.035" height="0.7" color="#445566"></a-cylinder>
    <a-box class="clickable" position="0 0.72 0"
      width="0.42" height="0.32" depth="0.16"
      material="color:#E85500; roughness:0.35; metalness:0.5"
      data-hotspot="aed">
    </a-box>
    <a-plane position="0 0.74 0.085" width="0.26" height="0.16"
      material="color:#00E5FF; opacity:0.85; emissive:#00E5FF; emissiveIntensity:0.35"></a-plane>
    <a-text value="AED" position="0 0.74 0.09" align="center" color="#fff" scale="0.26 0.26 0.26"></a-text>
    <a-cylinder position="0 0.01 0" radius="0.2" height="0.025"
      material="color:#FF9933; opacity:0.45; emissive:#FF9933; emissiveIntensity:0.2"
      animation__p="property:material.opacity;from:0.25;to:0.7;dur:1100;dir:alternate;loop:true"></a-cylinder>
    <a-text value="AED\n▼ Interact" position="0 1.1 0"
      align="center" color="#FF9933" scale="0.3 0.3 0.3"></a-text>
  </a-entity>

  <!-- Success ring (toggled via JS) -->
  <a-entity id="success-fx" position="0 0.05 -3.2" visible="false">
    <a-torus radius="0.85" radius-tubular="0.025"
      material="color:#00E676; emissive:#00E676; emissiveIntensity:0.9; opacity:0.8"
      animation="property:rotation;from:0 0 0;to:0 360 0;dur:1600;loop:true;easing:linear"></a-torus>
    <a-torus radius="0.7" radius-tubular="0.015"
      material="color:#00E5FF; emissive:#00E5FF; emissiveIntensity:0.7; opacity:0.6"
      animation="property:rotation;from:0 0 0;to:0 -360 0;dur:2200;loop:true;easing:linear"></a-torus>
  </a-entity>

  <!-- First Aid Kit -->
  <a-entity id="kit" position="-2.8 0 -2">
    <a-box class="clickable" position="0 0.6 0"
      width="0.42" height="0.32" depth="0.28"
      material="color:#CC2222; roughness:0.55; metalness:0.1"
      data-hotspot="kit">
    </a-box>
    <!-- White cross -->
    <a-plane position="0 0.6 0.145" width="0.07" height="0.22"
      material="color:#fff; opacity:0.95"></a-plane>
    <a-plane position="0 0.6 0.145" width="0.22" height="0.07"
      material="color:#fff; opacity:0.95"></a-plane>
    <!-- Ground ring -->
    <a-cylinder position="0 0.01 0" radius="0.18" height="0.025"
      material="color:#CC2222; opacity:0.4; emissive:#CC2222; emissiveIntensity:0.2"
      animation__p="property:material.opacity;from:0.2;to:0.65;dur:950;dir:alternate;loop:true"></a-cylinder>
    <a-text value="First Aid Kit\n▼ Interact" position="0 1.05 0"
      align="center" color="#EF4444" scale="0.28 0.28 0.28"></a-text>
  </a-entity>

  <!-- Patient shoes -->
  <a-entity position="0 0 -3.2">
    <a-box position=" 0.15 0.07 -1.18" width="0.2" height="0.1" depth="0.22"
      material="color:#1a1a2e; roughness:0.9"></a-box>
    <a-box position="-0.15 0.07 -1.18" width="0.2" height="0.1" depth="0.22"
      material="color:#1a1a2e; roughness:0.9"></a-box>
  </a-entity>

  <!-- Wall monitor (left) -->
  <a-plane position="-7.85 2.5 -2" rotation="0 90 0" width="3.5" height="2.2"
    material="color:#071e3d; emissive:#071e3d; emissiveIntensity:0.4"></a-plane>
  <a-text value="SKILL-METRIC LIVE&#10;Safety    ██████████  100&#10;Precision ████████░░   80&#10;Speed     ███████░░░   72"
    position="-7.75 2.5 -2" rotation="0 90 0" align="center"
    color="#00E5FF" scale="0.3 0.3 0.3" wrap-count="35"></a-text>

  <!-- Camera rig -->
  <a-entity id="rig" position="0 1.62 1.6">
    <a-camera look-controls wasd-controls="enabled:true" fov="80">
      <a-cursor
        color="#FF9933" fuse="false"
        raycaster="objects:.clickable"
        material="color:#FF9933; shader:flat; opacity:0.85"
        geometry="primitive:ring; radiusInner:0.012; radiusOuter:0.018">
      </a-cursor>
    </a-camera>
  </a-entity>

</a-scene>
`;

export default function VRTraining() {
  const sceneRef  = useRef(null);
  const flashRef  = useRef(null);
  const store     = useStore();
  const { onHotspot, advanceStep, resumeAfterViolation } = useTrainingSession();

  // Run timer only while VR screen is active and not paused
  useTimer(store.screen === 'vr' && !store.paused);

  // ── Inject A-Frame scene & wire click events ──────────────────────────────
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.innerHTML = SCENE_HTML;

    // After A-Frame boots, wire hotspot clicks
    const scene = sceneRef.current.querySelector('a-scene');
    if (!scene) return;

    const handleClick = (e) => {
      const hotspot = e.target?.dataset?.hotspot;
      if (!hotspot) return;

      // Read cursor world position & camera rotation for precision calc
      const rig    = scene.querySelector('#rig a-camera') || scene.querySelector('a-camera');
      const cursor = scene.querySelector('a-cursor');

      const cameraRot = rig?.getAttribute('rotation')    || { x: 0, y: 0, z: 0 };
      // Approximate cursor world position from target object position
      const obj       = e.target.object3D;
      const cursorPos = obj
        ? { x: obj.position.x, y: obj.position.y, z: obj.position.z }
        : { x: 0, y: 0, z: 0 };

      onHotspot(hotspot, cursorPos, cameraRot);
      showSuccessFX(scene);
    };

    scene.addEventListener('click', handleClick);
    return () => scene.removeEventListener('click', handleClick);
  }, []);  // mount only — onHotspot is stable from zustand

  function showSuccessFX(scene) {
    const ring = scene?.querySelector('#success-fx');
    if (ring) {
      ring.setAttribute('visible', true);
      setTimeout(() => ring?.setAttribute('visible', false), 2200);
    }
    if (flashRef.current) {
      flashRef.current.style.opacity = '1';
      setTimeout(() => { if (flashRef.current) flashRef.current.style.opacity = '0'; }, 400);
    }
  }

  const currentStep = store.steps[store.step];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column' }}>

      {/* A-Frame container */}
      <div ref={sceneRef} style={{ flex: 1, position: 'relative' }}>
        {/* Action flash overlay */}
        <div ref={flashRef} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,230,118,0.12)',
          opacity: 0, pointerEvents: 'none', transition: 'opacity .3s',
          zIndex: 100,
        }}/>

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

        {/* HUD */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 200 }}>

          <LanguagePanel />

          {/* Step dots */}
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