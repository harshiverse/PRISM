// src/components/Scene/SceneLighting.jsx
// Shared lighting setup for all training modes.
// Uses a combination of ambient, directional, point, and spot lights
// to create a convincing hospital/clinical atmosphere.

export default function SceneLighting({ accentColor = '#FF9933' }) {
  return (
    <>
      {/* Base ambient — bright enough to see geometry */}
      <ambientLight color="#b8d4f0" intensity={1.2} />

      {/* Main overhead directional — simulates ceiling fluorescent */}
      <directionalLight
        position={[0, 8, -2]}
        color="#E8F4FF"
        intensity={1.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Secondary fill light from the front-right */}
      <directionalLight
        position={[4, 5, 4]}
        color="#D8ECFF"
        intensity={0.6}
      />

      {/* Accent point light — saffron/mode color wash */}
      <pointLight
        position={[-3, 3, -1]}
        color={accentColor}
        intensity={0.8}
        distance={15}
        decay={2}
      />

      {/* Cyan accent from back-right — cool hospital feel */}
      <pointLight
        position={[3, 3, -5]}
        color="#00E5FF"
        intensity={0.6}
        distance={14}
        decay={2}
      />

      {/* Overhead spot on patient area — draws the eye */}
      <spotLight
        position={[0, 6, -3.2]}
        target-position={[0, 0, -3.2]}
        color="#E0F0FF"
        intensity={2.0}
        angle={0.5}
        penumbra={0.6}
        distance={12}
        decay={2}
      />

      {/* Hemisphere light for natural fill */}
      <hemisphereLight
        args={['#87CEEB', '#1a2744', 0.4]}
      />
    </>
  );
}
