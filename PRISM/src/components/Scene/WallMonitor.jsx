// src/components/Scene/WallMonitor.jsx
// Left-wall display panel showing a PRISM logo and static readout.
// Uses emissive materials so it glows and is clearly visible.

import { Text } from '@react-three/drei';

export default function WallMonitor() {
  return (
    <group>
      {/* Monitor bezel */}
      <mesh position={[-7.85, 2.5, -2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[3.6, 2.4, 0.08]} />
        <meshStandardMaterial color="#1a2a3e" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Monitor screen background */}
      <mesh position={[-7.8, 2.5, -2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.3, 2.0]} />
        <meshStandardMaterial
          color="#041020"
          emissive="#041830"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Screen header */}
      <Text
        position={[-7.75, 3.2, -2]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.12}
        color="#00E5FF"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        ⚡ PRISM SKILL-METRIC
      </Text>

      {/* Divider line */}
      <mesh position={[-7.76, 3.0, -2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.8, 0.01]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Status lines */}
      <Text
        position={[-7.75, 2.7, -2]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.09}
        color="#00E676"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
      >
        {'SAFETY     ████████████  100%'}
      </Text>

      <Text
        position={[-7.75, 2.4, -2]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.09}
        color="#00E5FF"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
      >
        {'PRECISION  ████████████  100%'}
      </Text>

      <Text
        position={[-7.75, 2.1, -2]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.09}
        color="#FFB300"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
      >
        {'SPEED      ████████░░░░   78%'}
      </Text>

      {/* Status footer */}
      <Text
        position={[-7.75, 1.7, -2]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.07}
        color="#3A5A7A"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        SESSION ACTIVE — MONITORING
      </Text>

      {/* Monitor glow effect */}
      <pointLight
        position={[-7.5, 2.5, -2]}
        color="#00E5FF"
        intensity={0.3}
        distance={3}
        decay={2}
      />
    </group>
  );
}
