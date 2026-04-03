// src/components/Scene/Hotspot.jsx
// Reusable interactive hotspot with pulsing glow, rotating ring, and label.
// Made larger and more visible than the original version.

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export default function Hotspot({
  position = [0, 0, 0],
  color = '#FF1744',
  label = 'Interact',
  hotspotType,          // 'chest' | 'aed' | 'kit'
  onInteract,           // (type, worldPos) => void
  labelOffset = [0, 0.45, 0],
}) {
  const ringRef = useRef();
  const outerRingRef = useRef();
  const cylinderRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Pulsing opacity + rotating ring animation
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 1.5;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y -= delta * 0.8;
      outerRingRef.current.material.opacity = 0.15 + 0.15 * (0.5 + 0.5 * Math.sin(Date.now() * 0.003));
    }
    if (cylinderRef.current) {
      const mat = cylinderRef.current.material;
      mat.opacity = 0.4 + 0.4 * (0.5 + 0.5 * Math.sin(Date.now() * 0.004));
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    const wp = new THREE.Vector3();
    e.object.getWorldPosition(wp);
    onInteract?.(hotspotType, { x: wp.x, y: wp.y, z: wp.z });
  };

  return (
    <group position={position}>
      {/* Clickable pulsing cylinder — larger for easier clicking */}
      <mesh
        ref={cylinderRef}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.65}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.5}
        />
      </mesh>

      {/* Inner rotating ring indicator */}
      <mesh ref={ringRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.24, 0.29, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.5}
          emissive={color}
          emissiveIntensity={0.4}
          side={2}
        />
      </mesh>

      {/* Outer larger ring — ambient glow */}
      <mesh ref={outerRingRef} position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.32, 0.38, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.2}
          emissive={color}
          emissiveIntensity={0.3}
          side={2}
        />
      </mesh>

      {/* Point light — makes hotspot cast a glow on nearby surfaces */}
      <pointLight
        color={color}
        intensity={hovered ? 1.5 : 0.4}
        distance={2}
        decay={2}
      />

      {/* Label */}
      <Text
        position={labelOffset}
        fontSize={0.09}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {`▼ ${label}`}
      </Text>
    </group>
  );
}
