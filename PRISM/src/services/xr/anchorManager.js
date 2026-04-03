// src/services/xr/anchorManager.js
// Manages WebXR Anchors — locks a virtual object to a real-world position.
// In Pro mode, once the user taps to place the model, it's anchored to the
// floor and stays there even as the user physically walks around it.
//
// Requirements: session requested with requiredFeatures: ['anchors']

export class AnchorManager {
  constructor() {
    this.anchors = new Map(); // id → XRAnchor
  }

  // Place an anchor at the position from a hit-test result
  async placeAnchor(id, hitResult, frame) {
    if (!frame.createAnchor) {
      console.warn('[AnchorManager] Anchors not supported — using hit pose directly');
      return null;
    }
    try {
      const anchor = await frame.createAnchor(hitResult.getPose(frame.referenceSpace)?.transform, frame.referenceSpace);
      this.anchors.set(id, anchor);
      return anchor;
    } catch (e) {
      console.warn('[AnchorManager] createAnchor failed:', e.message);
      return null;
    }
  }

  // Get the current world-space pose of an anchor (updates as ARCore refines tracking)
  getAnchorPose(id, frame, referenceSpace) {
    const anchor = this.anchors.get(id);
    if (!anchor) return null;
    return frame.getPose(anchor.anchorSpace, referenceSpace);
  }

  deleteAnchor(id) {
    const anchor = this.anchors.get(id);
    anchor?.delete();
    this.anchors.delete(id);
  }

  deleteAll() {
    this.anchors.forEach(a => a?.delete());
    this.anchors.clear();
  }
}
