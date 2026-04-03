// src/services/xr/proximityCheck.js
// Pro mode "distance-based" interaction logic.
// The user must physically move their phone within REACH_THRESHOLD metres
// of a hotspot's world position to interact with it.
//
// Also detects hand-shake: measures variance of viewer position over a
// rolling window and returns a stability score (0–100).

const REACH_THRESHOLD = 0.5;   // metres — must be within 50cm to interact
const SHAKE_WINDOW    = 30;     // frames to measure stability over

export class ProximityChecker {
  constructor() {
    this._posHistory = [];   // rolling buffer of {x,y,z}
  }

  // ── Distance check ────────────────────────────────────────────────────────
  // viewerPos: {x,y,z} from XRFrame viewer pose
  // hotspotPos: {x,y,z} world-space position of the hotspot
  // Returns: { inRange: bool, distance: number (metres) }
  check(viewerPos, hotspotPos) {
    const dx = viewerPos.x - hotspotPos.x;
    const dy = viewerPos.y - hotspotPos.y;
    const dz = viewerPos.z - hotspotPos.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return { inRange: distance <= REACH_THRESHOLD, distance: +distance.toFixed(3) };
  }

  // ── Stability tracker ─────────────────────────────────────────────────────
  // Call once per XRFrame with the current viewer position.
  // Returns stability score 0–100 (100 = perfectly still, 0 = very shaky).
  trackStability(viewerPos) {
    this._posHistory.push({ ...viewerPos });
    if (this._posHistory.length > SHAKE_WINDOW) this._posHistory.shift();
    if (this._posHistory.length < 5) return 100;

    // Compute variance across x, y, z
    const mean = this._posHistory.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y, z: acc.z + p.z }),
      { x: 0, y: 0, z: 0 }
    );
    const n = this._posHistory.length;
    mean.x /= n; mean.y /= n; mean.z /= n;

    const variance = this._posHistory.reduce((acc, p) => {
      return acc + (p.x - mean.x) ** 2 + (p.y - mean.y) ** 2 + (p.z - mean.z) ** 2;
    }, 0) / n;

    // Map variance to 0–100 score (variance > 0.01m² = very shaky)
    const stability = Math.max(0, Math.min(100, Math.round(100 - (variance / 0.0001) * 100)));
    return stability;
  }

  reset() { this._posHistory = []; }
}
