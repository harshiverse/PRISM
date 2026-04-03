// src/components/Scene/FirstAidKit.jsx
// First Aid Kit object at position [-2.8, 0, -2].

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import Hotspot from './Hotspot';

export default function FirstAidKit({ onInteract }) {
  const glowRef = useRef();

  useFrame(() => {
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.2 + 0.45 * (0.5 + 0.5 * Math.sin(Date.now() * 0.0035));
    }
  });

  return (
    <group position={[-2.8, 0, -2]}>
      {/* Kit box — clickable */}
      <Hotspot
        position={[0, 0.6, 0]}
        color="#CC2222"
        label="First Aid Kit\nInteract"
        hotspotType="kit"
        onInteract={onInteract}
        labelOffset={[0, 0.48, 0]}
      />

      {/* Red box body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.42, 0.32, 0.28]} />
        <meshStandardMaterial color="#CC2222" roughness={0.55} metalness={0.1} />
      </mesh>

      {/* White cross — vertical bar */}
      <mesh position={[0, 0.6, 0.145]}>
        <planeGeometry args={[0.07, 0.22]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      {/* White cross — horizontal bar */}
      <mesh position={[0, 0.6, 0.145]}>
        <planeGeometry args={[0.22, 0.07]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      {/* Ground glow ring */}
      <mesh
        ref={glowRef}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.18, 0.18, 0.025, 32]} />
        <meshStandardMaterial
          color="#CC2222"
          transparent
          opacity={0.4}
          emissive="#CC2222"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
