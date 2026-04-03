// src/components/Scene/HospitalRoom.jsx
// Room geometry: floor, wireframe grid, walls, ceiling lights, emergency banner.
// Colors chosen to be clearly distinct from the scene background (#06101e).

import { Text } from '@react-three/drei';

export default function HospitalRoom({ bannerText, bannerColor = '#FF1744' }) {
  const defaultBanner =
    'EMERGENCY SIMULATION  ·  CPR FIRST AID TRAINING  ·  PRISM HEALTHCARE';

  return (
    <group>
      {/* Floor — lighter than background so it's visible */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#1a2d42" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Wireframe grid overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[22, 22, 22, 22]} />
        <meshStandardMaterial
          color="#00E5FF"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Back wall — distinct from background */}
      <mesh position={[0, 3.5, -8]}>
        <planeGeometry args={[22, 7]} />
        <meshStandardMaterial color="#0f2035" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-8, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#0e1e33" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Right wall */}
      <mesh position={[8, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#0e1e33" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Wall trim / baseboard — subtle accent line along back wall */}
      <mesh position={[0, 0.15, -7.95]}>
        <boxGeometry args={[22, 0.3, 0.05]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.15}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Ceiling — helps define the space */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, -4]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#081525" roughness={0.95} />
      </mesh>

      {/* Ceiling light strips */}
      <mesh position={[0, 6.95, -4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 0.4]} />
        <meshStandardMaterial
          color="#E0F0FF"
          emissive="#E0F0FF"
          emissiveIntensity={1.2}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh position={[0, 6.95, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 0.4]} />
        <meshStandardMaterial
          color="#E0F0FF"
          emissive="#E0F0FF"
          emissiveIntensity={1.2}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh position={[0, 6.95, -6]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 0.3]} />
        <meshStandardMaterial
          color="#DDEEFF"
          emissive="#DDEEFF"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Floor edge glow lines — define the room boundary */}
      <mesh position={[0, 0.01, -7.95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 0.06]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.6}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Emergency banner */}
      <group position={[0, 6.2, -7.85]}>
        <mesh>
          <planeGeometry args={[10, 0.7]} />
          <meshStandardMaterial
            color={bannerColor}
            transparent
            opacity={0.25}
            emissive={bannerColor}
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.18}
          color={bannerColor === '#FF1744' ? '#FF6B6B' : bannerColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={9}
        >
          {bannerText || defaultBanner}
        </Text>
      </group>
    </group>
  );
}
