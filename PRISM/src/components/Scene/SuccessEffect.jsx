// src/components/Scene/SuccessEffect.jsx
// Green + cyan double-torus success ring that appears on correct interaction.
// Replaces the A-Frame #success-fx entity.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function SuccessEffect({ visible }) {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((_, delta) => {
    if (!visible) return;
    if (outerRef.current) outerRef.current.rotation.y += delta * 2.5;
    if (innerRef.current) innerRef.current.rotation.y -= delta * 1.8;
  });

  if (!visible) return null;

  return (
    <group position={[0, 0.05, -3.2]}>
      {/* Outer green torus */}
      <mesh ref={outerRef}>
        <torusGeometry args={[0.85, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#00E676"
          emissive="#00E676"
          emissiveIntensity={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner cyan torus */}
      <mesh ref={innerRef}>
        <torusGeometry args={[0.7, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.7}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
