// src/hooks/useARSession.js
// Manages the full WebXR immersive-ar session lifecycle for Pro mode.
//
// Flow:
//   1. checkARSupport() — gate on device capability
//   2. startSession()   — request immersive-ar with hit-test + anchors
//   3. Each rAF frame:  — run hit-test, expose reticle pose
//   4. placeModel()     — anchor the 3D model to the detected surface
//   5. endSession()     — clean up
//
// The actual rendering is done by A-Frame (injected into a container div).
// This hook manages the XRSession and exposes state to ARTraining.jsx.

import { useState, useRef, useCallback } from 'react';
import { checkARSupport, createHitTester, poseFromHitResult } from '../services/xr/hitTest';
import { AnchorManager } from '../services/xr/anchorManager';
import { ProximityChecker } from '../services/xr/proximityCheck';

export function useARSession() {
  const [arSupported,   setArSupported]   = useState(null);  // null=unknown, true, false
  const [arReason,      setArReason]      = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [modelPlaced,   setModelPlaced]   = useState(false);
  const [reticlePose,   setReticlePose]   = useState(null);  // {position, orientation}
  const [viewerPos,     setViewerPos]     = useState({ x:0, y:0, z:0 });
  const [stability,     setStability]     = useState(100);

  const sessionRef    = useRef(null);
  const refSpaceRef   = useRef(null);
  const hitTesterRef  = useRef(null);
  const anchorMgr     = useRef(new AnchorManager());
  const proxChecker   = useRef(new ProximityChecker());
  const rafIdRef      = useRef(null);

  // ── Check support ─────────────────────────────────────────────────────────
  const checkSupport = useCallback(async () => {
    const { supported, reason } = await checkARSupport();
    setArSupported(supported);
    setArReason(reason || '');
    return supported;
  }, []);

  // ── Start AR session ──────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    if (!navigator.xr) return;
    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['anchors', 'dom-overlay'],
        domOverlay: { root: document.getElementById('ar-overlay') },
      });

      sessionRef.current  = session;
      const refSpace      = await session.requestReferenceSpace('local');
      const viewerSpace   = await session.requestReferenceSpace('viewer');
      refSpaceRef.current = refSpace;
      hitTesterRef.current = await createHitTester(session, viewerSpace);

      session.addEventListener('end', () => {
        setSessionActive(false);
        setModelPlaced(false);
        proxChecker.current.reset();
      });

      // ── rAF loop ──────────────────────────────────────────────────────────
      const onFrame = (time, frame) => {
        rafIdRef.current = session.requestAnimationFrame(onFrame);

        // Viewer position (for proximity + stability)
        const viewerPose = frame.getViewerPose(refSpace);
        if (viewerPose) {
          const t = viewerPose.transform.position;
          const pos = { x: t.x, y: t.y, z: t.z };
          setViewerPos(pos);
          setStability(proxChecker.current.trackStability(pos));
        }

        // Hit-test reticle
        const hits = hitTesterRef.current?.getResults(frame);
        if (hits?.length) {
          const pose = poseFromHitResult(hits[0], refSpace);
          setReticlePose(pose);
        } else {
          setReticlePose(null);
        }
      };

      rafIdRef.current = session.requestAnimationFrame(onFrame);
      setSessionActive(true);
    } catch (e) {
      console.error('[useARSession] Failed to start AR session:', e);
      setArReason(e.message);
    }
  }, []);

  // ── Place model at current reticle position ───────────────────────────────
  const placeModel = useCallback(async (frame, hitResult) => {
    if (!frame || !hitResult) return;
    await anchorMgr.current.placeAnchor('model', hitResult, frame);
    setModelPlaced(true);
  }, []);

  // ── Proximity check for a hotspot ─────────────────────────────────────────
  const checkProximity = useCallback((hotspotWorldPos) => {
    return proxChecker.current.check(viewerPos, hotspotWorldPos);
  }, [viewerPos]);

  // ── End session ───────────────────────────────────────────────────────────
  const endSession = useCallback(() => {
    if (rafIdRef.current) sessionRef.current?.cancelAnimationFrame(rafIdRef.current);
    hitTesterRef.current?.cancel();
    anchorMgr.current.deleteAll();
    sessionRef.current?.end().catch(() => {});
    sessionRef.current = null;
    setSessionActive(false);
    setModelPlaced(false);
  }, []);

  return {
    arSupported, arReason,
    sessionActive, modelPlaced,
    reticlePose, viewerPos, stability,
    checkSupport, startSession, placeModel, checkProximity, endSession,
  };
}
