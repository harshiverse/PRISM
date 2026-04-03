// src/components/Scene/Patient.jsx
// Patient model: body, head, hair, arms, legs, shoes.
// Placed on a stretcher/gurney for realism.
// Positioned at [0, 0, -3.2] in world space.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Patient() {
  const breathRef = useRef();

  // Subtle breathing animation on the torso
  useFrame(({ clock }) => {
    if (breathRef.current) {
      breathRef.current.scale.y = 1 + Math.sin(clock.elapsedTime * 1.2) * 0.03;
    }
  });

  return (
    <group position={[0, 0, -3.2]}>
      {/* Stretcher / gurney base */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.75, 0.06, 1.8]} />
        <meshStandardMaterial color="#2a3f55" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Stretcher legs */}
      {[[-0.3, 0.09, 0.7], [0.3, 0.09, 0.7], [-0.3, 0.09, -0.7], [0.3, 0.09, -0.7]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
          <meshStandardMaterial color="#445566" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Torso — with breathing animation */}
      <mesh ref={breathRef} position={[0, 0.32, 0]}>
        <boxGeometry args={[0.52, 0.22, 1.2]} />
        <meshStandardMaterial color="#E8CBA0" roughness={0.85} metalness={0} />
      </mesh>

      {/* Hospital gown overlay on torso */}
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[0.54, 0.18, 1.22]} />
        <meshStandardMaterial color="#6BA3C7" roughness={0.9} metalness={0} transparent opacity={0.85} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.38, 0.78]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#E8CBA0" roughness={0.85} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.47, 0.78]} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#3D2000" roughness={0.95} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.37, 0.28, 0.12]}>
        <boxGeometry args={[0.14, 0.1, 0.75]} />
        <meshStandardMaterial color="#E8CBA0" roughness={0.85} />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.37, 0.28, 0.12]}>
        <boxGeometry args={[0.14, 0.1, 0.75]} />
        <meshStandardMaterial color="#E8CBA0" roughness={0.85} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.14, 0.28, -0.6]}>
        <boxGeometry args={[0.2, 0.12, 0.9]} />
        <meshStandardMaterial color="#2D4A7A" roughness={0.9} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.14, 0.28, -0.6]}>
        <boxGeometry args={[0.2, 0.12, 0.9]} />
        <meshStandardMaterial color="#2D4A7A" roughness={0.9} />
      </mesh>

      {/* Right shoe */}
      <mesh position={[0.14, 0.24, -1.1]}>
        <boxGeometry args={[0.18, 0.08, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>

      {/* Left shoe */}
      <mesh position={[-0.14, 0.24, -1.1]}>
        <boxGeometry args={[0.18, 0.08, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>
    </group>
  );
}
