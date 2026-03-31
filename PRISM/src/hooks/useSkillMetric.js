// src/hooks/useSkillMetric.js
//
// Implements the Skill-Metric Engine described in the README:
//
//   Precision Score P = f(distance d, rotation r)
//
//   d = Euclidean distance between user's cursor world-position
//       and the step's targetCoords (3D)
//   r = angular difference between user's camera rotation
//       and the step's targetRot
//
//   P = clamp(100 - (d * DIST_PENALTY) - (r * ROT_PENALTY), 0, 100)
//
// If P < step.threshold on a HIGH-RISK step → Safety Violation is fired.
// A violation pauses the simulation and triggers audio feedback.

import { useCallback } from 'react';
import useStore from '../store/useStore';
import { logViolation } from '../services/firebase/firestore';

const DIST_PENALTY = 18;   // score points lost per unit of distance error
const ROT_PENALTY  = 0.4;  // score points lost per degree of rotation error

// ── Euclidean distance between two {x,y,z} points ────────────────────────────
function euclidean(a, b) {
  if (!a || !b) return 0;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ── Angular difference (degrees) ─────────────────────────────────────────────
function rotDiff(a, b) {
  if (!a || !b) return 0;
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  const dz = Math.abs(a.z - b.z);
  return (dx + dy + dz) / 3;
}

export function useSkillMetric() {
  const { sessionId, step, steps, metrics, addViolation, updateMetrics, setPaused, showToast } = useStore();

  /**
   * computePrecision
   * Called when the user interacts with a hotspot.
   *
   * @param {Object} cursorPos  — { x, y, z } from A-Frame cursor world position
   * @param {Object} cameraRot  — { x, y, z } from A-Frame camera rotation
   * @returns {number}          — Precision score 0–100
   */
  const computePrecision = useCallback((cursorPos, cameraRot) => {
    const currentStep = steps[step];
    if (!currentStep?.targetCoords) return 100;   // no spatial check for this step

    const d = euclidean(cursorPos,   currentStep.targetCoords);
    const r = rotDiff(cameraRot,     currentStep.targetRot || { x: 0, y: 0, z: 0 });
    const P = Math.max(0, Math.min(100, 100 - (d * DIST_PENALTY) - (r * ROT_PENALTY)));

    return Math.round(P);
  }, [step, steps]);

  /**
   * applyHotspotResult
   * Called after a CORRECT hotspot click.
   * Updates metrics, checks threshold, fires violations.
   *
   * @param {number} precision — from computePrecision()
   */
  const applyHotspotResult = useCallback(async (precision) => {
    const currentStep = steps[step];

    // Blend new precision into running metric (60% old, 40% new interaction)
    const newPrecision = Math.round(metrics.precision * 0.6 + precision * 0.4);
    const newSafety    = Math.min(100, metrics.safety + 3);

    updateMetrics({ precision: newPrecision, safety: newSafety });

    // ── Safety Violation check ─────────────────────────────────────────────
    if (
      currentStep?.highRisk &&
      currentStep?.threshold != null &&
      precision < currentStep.threshold
    ) {
      const violation = {
        step,
        type:      'LOW_PRECISION_HIGH_RISK',
        precision,
        threshold: currentStep.threshold,
        ts:        Date.now(),
      };

      addViolation(violation);
      setPaused(true);

      // Log to Firestore (non-blocking)
      logViolation(sessionId, violation).catch(() => {});

      showToast(`⚠️ Safety Violation — Precision too low (${precision}%). Simulation paused.`, 'warn');
      return { violated: true, precision };
    }

    return { violated: false, precision };
  }, [step, steps, metrics, sessionId, addViolation, updateMetrics, setPaused, showToast]);

  /**
   * applyWrongHotspot
   * Called when user clicks the WRONG object.
   */
  const applyWrongHotspot = useCallback(() => {
    updateMetrics({
      safety:    Math.max(0, metrics.safety    - 6),
      precision: Math.max(0, metrics.precision - 3),
    });
  }, [metrics, updateMetrics]);

  return { computePrecision, applyHotspotResult, applyWrongHotspot };
}