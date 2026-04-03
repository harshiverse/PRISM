// src/components/Scene/GyroscopeCamera.jsx
// Applies gyroscope-driven rotation to the camera each frame.
// Used in Beginner mode — only activates when real gyroscope data is received.
// On desktop (no real gyroscope), this is a no-op so OrbitControls can work.

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGyroscope } from '../../hooks/useGyroscope';
import * as THREE from 'three';

export default function GyroscopeCamera() {
  const { camera } = useThree();
  const { cameraRotation, granted, angles } = useGyroscope();
  const hasRealData = useRef(false);

  useFrame(() => {
    if (!granted) return;

    // Detect if we're getting real gyroscope data (not all zeros from desktop)
    // Once we see non-zero alpha/beta/gamma, we know it's a real device
    if (!hasRealData.current) {
      if (
        Math.abs(angles.alpha) > 1 ||
        Math.abs(angles.beta) > 1 ||
        Math.abs(angles.gamma) > 1
      ) {
        hasRealData.current = true;
      } else {
        return; // Still all zeros — let OrbitControls handle camera
      }
    }

    // Convert degrees to radians and apply to camera
    const euler = new THREE.Euler(
      THREE.MathUtils.degToRad(cameraRotation.x),
      THREE.MathUtils.degToRad(cameraRotation.y),
      THREE.MathUtils.degToRad(cameraRotation.z),
      'YXZ'
    );
    camera.quaternion.setFromEuler(euler);
  });

  return null;
}
