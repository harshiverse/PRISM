// src/components/Scene/TrainingCanvas.jsx
// Top-level R3F Canvas wrapper for all training modes.
// Renders the full hospital scene with mode-specific camera controls.
//
// Props:
//   mode:          'practice' | 'beginner' | 'ar'
//   onInteract:    (hotspotType, worldPos) => void
//   showSuccess:   boolean — toggles the success effect ring
//   children:      additional elements to render inside the Canvas

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

import SceneLighting  from './SceneLighting';
import HospitalRoom   from './HospitalRoom';
import Patient        from './Patient';
import ChestHotspot   from './ChestHotspot';
import AEDStation     from './AEDStation';
import FirstAidKit    from './FirstAidKit';
import SuccessEffect  from './SuccessEffect';
import WallMonitor    from './WallMonitor';
import GyroscopeCamera from './GyroscopeCamera';

// Banner config per mode
const MODE_BANNERS = {
  practice: {
    text: 'EMERGENCY SIMULATION  ·  CPR FIRST AID TRAINING  ·  PRISM HEALTHCARE',
    color: '#FF1744',
  },
  beginner: {
    text: 'BEGINNER MODE  ·  GYROSCOPE VIEWER  ·  TILT YOUR PHONE TO LOOK AROUND',
    color: '#00c9a7',
  },
  ar: {
    text: 'AR PRO MODE  ·  SPATIAL TRACKING ACTIVE',
    color: '#f5a623',
  },
};

// Accent color per mode (affects point light + hotspot ring colours)
const MODE_ACCENTS = {
  practice: '#FF9933',
  beginner: '#00c9a7',
  ar: '#f5a623',
};

export default function TrainingCanvas({
  mode = 'practice',
  onInteract,
  showSuccess = false,
  children,
}) {
  const banner = MODE_BANNERS[mode] || MODE_BANNERS.practice;
  const accent = MODE_ACCENTS[mode] || MODE_ACCENTS.practice;
  const hotspotColor = mode === 'beginner' ? '#00c9a7' : '#FF1744';

  return (
    <Canvas
      camera={{
        fov: 75,
        position: [0, 1.6, 2],
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#0a1628');
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* Environment for indirect lighting (adds subtle reflections + fill) */}
        <Environment preset="night" />

        {/* Lighting */}
        <SceneLighting accentColor={accent} />

        {/* Fog — adds depth perception */}
        <fog attach="fog" args={['#0a1628', 8, 22]} />

        {/* Room environment */}
        <HospitalRoom
          bannerText={banner.text}
          bannerColor={banner.color}
        />

        {/* Wall monitor */}
        <WallMonitor />

        {/* Patient model */}
        <Patient />

        {/* Interactive hotspots */}
        <ChestHotspot onInteract={onInteract} color={hotspotColor} />
        <AEDStation onInteract={onInteract} accentColor={accent} />
        <FirstAidKit onInteract={onInteract} />

        {/* Success effect */}
        <SuccessEffect visible={showSuccess} />

        {/* Camera controls — mode dependent */}
        {(mode === 'practice' || (mode === 'beginner')) && (
          <OrbitControls
            target={[0, 0.3, -3]}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.1}
            minDistance={1}
            maxDistance={8}
            enableDamping
            dampingFactor={0.08}
          />
        )}
        {mode === 'beginner' && <GyroscopeCamera />}

        {/* Additional children (mode-specific extras) */}
        {children}
      </Suspense>
    </Canvas>
  );
}
