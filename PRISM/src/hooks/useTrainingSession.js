// src/hooks/useTrainingSession.js
// Orchestrates a full training run:
//   1. Creates a Firestore session on launch
//   2. Manages step progression with metric updates
//   3. Finalizes session on completion
//   4. Handles safety violation pauses

import { useCallback } from 'react';
import useStore from '../store/useStore';
import { createSession, finalizeSession } from '../services/firebase/firestore';
import { useSkillMetric } from './useSkillMetric';
import CPR_STEPS from '../data/steps/healthcare';

export function useTrainingSession() {
  const store = useStore();
  const { computePrecision, applyHotspotResult, applyWrongHotspot } = useSkillMetric();

  // ── Launch ────────────────────────────────────────────────────────────────
  const launch = useCallback(async (moduleId = 'healthcare-cpr') => {
    store.initTraining(CPR_STEPS);
    store.setScreen('vr');

    const sessionId = await createSession({
      userId:   'anonymous',   // swap for auth.currentUser.uid when auth added
      moduleId,
      language: store.lang,
    });
    store.setSession(sessionId, moduleId);
    store.showToast('🏥 Healthcare CPR Simulation Started');
  }, [store]);

  // ── Hotspot interaction ───────────────────────────────────────────────────
  const onHotspot = useCallback(async (type, cursorPos, cameraRot) => {
    if (store.paused) {
      store.showToast('⚠️ Simulation paused — resolve safety violation first', 'warn');
      return;
    }

    const currentStep = store.steps[store.step];
    if (!currentStep) return;

    if (currentStep.hotspot === type) {
      // Multi-click steps (e.g. 30 compressions = 3 clicks)
      if (currentStep.multiClick) {
        store.incrementClick(store.step);
        const clicks = (store.clicks[store.step] || 0) + 1;
        if (clicks < currentStep.multiClick) {
          store.showToast(`💪 ${clicks}/${currentStep.multiClick} — keep rhythm!`);
          return;
        }
      }

      // Compute spatial precision
      const precision = computePrecision(cursorPos, cameraRot);
      const { violated } = await applyHotspotResult(precision);

      if (!violated) {
        store.showToast(`✅ Correct! Precision: ${precision}%`);
        // Brief delay for success FX, then advance
        setTimeout(advanceStep, 750);
      }
      // If violated: simulation is paused; user must click "Resume" in HUD
    } else {
      applyWrongHotspot();
      store.showToast('⚠️ Wrong object — check the current step!', 'warn');
    }
  }, [store, computePrecision, applyHotspotResult, applyWrongHotspot]);

  // ── Advance step ──────────────────────────────────────────────────────────
  const advanceStep = useCallback(() => {
    const { step, steps, metrics, recordStepScore, setStep, updateMetrics } = useStore.getState();

    // Record score for completed step
    const score = Math.round(metrics.safety * 0.4 + metrics.precision * 0.4 + metrics.speed * 0.2);
    recordStepScore(score);

    if (step >= steps.length - 1) {
      finish();
      return;
    }

    setStep(step + 1);
    // Small random speed fluctuation between steps
    updateMetrics({
      speed: Math.max(35, Math.min(100, metrics.speed + (Math.random() * 8 - 3.5))),
    });
  }, []);

  // ── Resume after safety violation ─────────────────────────────────────────
  const resumeAfterViolation = useCallback(() => {
    store.setPaused(false);
    store.showToast('▶️ Simulation resumed — proceed carefully');
  }, [store]);

  // ── Finish ────────────────────────────────────────────────────────────────
  const finish = useCallback(async () => {
    const { sessionId, metrics, scores, elapsed } = useStore.getState();
    const finalScore = Math.round(metrics.safety * 0.4 + metrics.precision * 0.4 + metrics.speed * 0.2);

    store.showToast('🎉 Module Complete! Generating report…');

    await finalizeSession(sessionId, {
      elapsedSec: elapsed,
      scores,
      finalScore,
      metrics,
    });

    setTimeout(() => store.setScreen('dashboard'), 1600);
  }, [store]);

  // ── Retry ─────────────────────────────────────────────────────────────────
  const retry = useCallback(() => launch(store.moduleId), [launch, store.moduleId]);

  return { launch, onHotspot, advanceStep, resumeAfterViolation, retry };
}