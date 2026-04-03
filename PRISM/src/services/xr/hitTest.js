// src/services/xr/hitTest.js
// Wraps the WebXR Hit-Test API.
// Finds real-world surfaces (floor, table) using ARCore/WebXR.
//
// Usage:
//   const ht = await createHitTester(xrSession, xrReferenceSpace);
//   // inside rAF loop:
//   const results = ht.getResults(xrFrame);
//   if (results.length) { const pose = results[0].getPose(refSpace); }
//
// Requirements:
//   - Chrome Android 81+ with ARCore installed
//   - Session requested with: requiredFeatures: ['hit-test']
//   - HTTPS context

export async function createHitTester(session, viewerSpace) {
  // Request a hit-test source relative to the viewer (phone camera)
  const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
  return {
    getResults: (frame) => frame.getHitTestResults(hitTestSource),
    cancel: () => hitTestSource.cancel(),
  };
}

// ── Check WebXR AR support ────────────────────────────────────────────────────
export async function checkARSupport() {
  if (!navigator.xr) return { supported: false, reason: 'WebXR not available in this browser' };
  try {
    const supported = await navigator.xr.isSessionSupported('immersive-ar');
    return {
      supported,
      reason: supported ? null : 'immersive-ar not supported on this device (requires Android + ARCore)',
    };
  } catch (e) {
    return { supported: false, reason: e.message };
  }
}

// ── Extract position + orientation from an XRHitTestResult ───────────────────
export function poseFromHitResult(hitResult, referenceSpace) {
  const pose = hitResult.getPose(referenceSpace);
  if (!pose) return null;
  const m = pose.transform.matrix;
  return {
    position: {
      x: m[12],
      y: m[13],
      z: m[14],
    },
    orientation: pose.transform.orientation,
    matrix: m,
  };
}
