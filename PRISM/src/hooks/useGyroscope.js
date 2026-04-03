// src/hooks/useGyroscope.js
// Reads DeviceOrientationEvent (alpha, beta, gamma) and maps it to
// camera rotation angles for the Beginner 360° gyroscope viewer.
//
// Works on:  Android Chrome, iOS Safari (requires permission prompt on iOS 13+)
// Does NOT require WebXR — pure sensor API.
//
// Returns:
//   { alpha, beta, gamma }  — raw device angles (degrees)
//   { yaw, pitch, roll }    — remapped for A-Frame camera rotation
//   supported               — boolean
//   requestPermission()     — call on user gesture for iOS

import { useState, useEffect, useCallback, useRef } from 'react';

export function useGyroscope() {
  const [angles, setAngles]       = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [supported, setSupported] = useState(false);
  const [granted, setGranted]     = useState(false);
  const smoothRef                 = useRef({ alpha: 0, beta: 0, gamma: 0 });

  // ── Smoothing factor (0 = no smoothing, 1 = frozen) ──────────────────────
  const SMOOTH = 0.15;

  const handleOrientation = useCallback((e) => {
    const raw = { alpha: e.alpha ?? 0, beta: e.beta ?? 0, gamma: e.gamma ?? 0 };

    // Exponential smoothing to reduce jitter
    smoothRef.current = {
      alpha: smoothRef.current.alpha + SMOOTH * (raw.alpha - smoothRef.current.alpha),
      beta:  smoothRef.current.beta  + SMOOTH * (raw.beta  - smoothRef.current.beta),
      gamma: smoothRef.current.gamma + SMOOTH * (raw.gamma - smoothRef.current.gamma),
    };

    setAngles({ ...smoothRef.current });
  }, []);

  useEffect(() => {
    if (typeof DeviceOrientationEvent !== 'undefined') {
      setSupported(true);
    }
  }, []);

  // Auto-attach on non-iOS (no permission needed)
  useEffect(() => {
    if (!supported) return;
    const needsPermission =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function';

    if (!needsPermission) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      setGranted(true);
      return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }
  }, [supported, handleOrientation]);

  // iOS 13+ permission request — must be called from a user gesture
  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent?.requestPermission !== 'function') {
      // Not iOS — just attach
      window.addEventListener('deviceorientation', handleOrientation, true);
      setGranted(true);
      return true;
    }
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setGranted(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [handleOrientation]);

  // ── Map device angles → A-Frame camera rotation ───────────────────────────
  // A-Frame uses: rotation="pitch yaw roll" (x y z in degrees)
  // Device:  alpha = compass heading (0-360, yaw around vertical axis)
  //          beta  = front-back tilt (-180 to 180, pitch)
  //          gamma = left-right tilt (-90 to 90, roll)
  const cameraRotation = {
    x: clamp(angles.beta  - 90, -85, 85),   // pitch: tilt phone up/down
    y: -angles.alpha,                         // yaw:   rotate left/right
    z: clamp(angles.gamma,     -45, 45),      // roll:  tilt sideways
  };

  return { angles, cameraRotation, supported, granted, requestPermission };
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
