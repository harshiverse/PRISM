// src/components/Scene/AEDStation.jsx
// AED (Automated External Defibrillator) station object.
// Position matches the A-Frame original: [2.8, 0, -2.4].

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import Hotspot from './Hotspot';

export default function AEDStation({ onInteract, accentColor = '#FF9933' }) {
  const glowRef = useRef();

  useFrame(() => {
    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.25 + 0.45 * (0.5 + 0.5 * Math.sin(Date.now() * 0.003));
    }
  });

  return (
    <group position={[2.8, 0, -2.4]}>
      {/* Stand pole */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 16]} />
        <meshStandardMaterial color="#445566" />
      </mesh>

      {/* AED box — clickable */}
      <Hotspot
        position={[0, 0.72, 0]}
        color={accentColor}
        label="AED\nInteract"
        hotspotType="aed"
        onInteract={onInteract}
        labelOffset={[0, 0.4, 0]}
      />

      {/* AED body overlay (orange box around hotspot) */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.42, 0.32, 0.16]} />
        <meshStandardMaterial color="#E85500" roughness={0.35} metalness={0.5} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.74, 0.085]}>
        <planeGeometry args={[0.26, 0.16]} />
        <meshStandardMaterial
          color="#00E5FF"
          transparent
          opacity={0.85}
          emissive="#00E5FF"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* AED text */}
      <Text
        position={[0, 0.74, 0.09]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        AED
      </Text>

      {/* Ground glow ring */}
      <mesh ref={glowRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.025, 32]} />
        <meshStandardMaterial
          color={accentColor}
          transparent
          opacity={0.45}
          emissive={accentColor}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
