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
import { sfxInteract, sfxViolation, sfxSuccess, sfxProceed } from '../services/audio';

// Map moduleId → step data files (expand as new modules are added)
const MODULE_STEPS = {
  'healthcare-cpr': CPR_STEPS,
  'ev-diagnostics':  CPR_STEPS, // placeholder until ev steps are authored
  'arduino':         CPR_STEPS, // placeholder until arduino steps are authored
};

// Map mode → screen name
const MODE_SCREEN = {
  practice: 'vr',
  beginner: 'beginner',
  ar:       'ar',
  live:     'vr',   // live uses same VR scene for now; lobby handled in ModuleSelect
};

export function useTrainingSession() {
  const store = useStore();
  const { computePrecision, applyHotspotResult, applyWrongHotspot } = useSkillMetric();

  // ── Launch ────────────────────────────────────────────────────────────────
  const launch = useCallback(async (moduleId = 'healthcare-cpr', mode = 'practice') => {
    const steps = MODULE_STEPS[moduleId] || CPR_STEPS;
    store.initTraining(steps);
    store.setMode(mode);

    const targetScreen = MODE_SCREEN[mode] || 'vr';
    store.setScreen(targetScreen);

    const sessionId = await createSession({
      userId:   'anonymous',
      moduleId,
      language: store.lang,
      mode,
    });
    store.setSession(sessionId, moduleId);

    const modeLabels = {
      practice: '🏥 Practice Mode — VR Simulation Started',
      beginner: '📱 Beginner Mode — Gyroscope Viewer Started',
      ar:       '🥽 AR Pro Mode — Spatial Tracking Active',
      live:     '⚡ Live Mode — Joining Challenge',
    };
    store.showToast(modeLabels[mode] || '▶ Training Started');
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
        sfxInteract();
        store.showToast(`✅ Correct! Precision: ${precision}%`);
        // Brief delay for success FX, then advance
        setTimeout(advanceStep, 750);
      }
      // If violated: simulation is paused; user must click "Resume" in HUD
    } else {
      applyWrongHotspot();
      sfxViolation();
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
    sfxProceed();
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

    sfxSuccess();
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
  const retry = useCallback(() => launch(store.moduleId, store.mode), [launch, store.moduleId, store.mode]);

  return { launch, onHotspot, advanceStep, resumeAfterViolation, retry };
}