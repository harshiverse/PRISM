// src/store/useStore.js
// Global state managed with Zustand.
// Replaces the vanilla-JS `S` object from the prototype.

import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ── Navigation ──────────────────────────────────────────
  screen: 'landing',   // 'landing' | 'modules' | 'vr' | 'dashboard'
  setScreen: (s) => set({ screen: s }),

  // ── Language ─────────────────────────────────────────────
  lang: 'en',
  setLang: (l) => set({ lang: l }),

  // ── Active session ───────────────────────────────────────
  sessionId:  null,    // Firestore document ID
  moduleId:   null,
  setSession: (id, moduleId) => set({ sessionId: id, moduleId }),

  // ── Training state ───────────────────────────────────────
  step:      0,
  totalSteps: 9,
  steps:     [],       // loaded from data file

  scores:    [],       // per-step score (0–100)
  violations: [],      // { step, type, ts }

  metrics: {
    safety:    100,
    precision: 100,
    speed:     78,
  },

  // Click counters for multi-click steps
  clicks: {},

  // Timer
  elapsed:   0,
  startTs:   null,
  timerRef:  null,

  // Paused by safety violation
  paused: false,

  // Toast
  toast: null,   // { msg, type }

  // ── Actions ──────────────────────────────────────────────

  initTraining: (steps) => set({
    step:       0,
    steps,
    scores:     [],
    violations: [],
    clicks:     {},
    metrics:    { safety: 100, precision: 100, speed: 78 },
    elapsed:    0,
    startTs:    Date.now(),
    paused:     false,
  }),

  setStep: (n) => set({ step: n }),

  recordStepScore: (score) => set((s) => ({ scores: [...s.scores, score] })),

  updateMetrics: (patch) =>
    set((s) => ({ metrics: { ...s.metrics, ...patch } })),

  addViolation: (v) =>
    set((s) => ({ violations: [...s.violations, v] })),

  incrementClick: (stepIdx) =>
    set((s) => ({
      clicks: { ...s.clicks, [stepIdx]: (s.clicks[stepIdx] || 0) + 1 },
    })),

  setPaused: (v) => set({ paused: v }),

  tickTimer: () =>
    set((s) => ({ elapsed: Math.floor((Date.now() - s.startTs) / 1000) })),

  showToast: (msg, type = 'ok') => {
    set({ toast: { msg, type, id: Date.now() } });
  },

  clearToast: () => set({ toast: null }),

  // Compute final score from metrics
  getFinalScore: () => {
    const m = get().metrics;
    return Math.round(m.safety * 0.4 + m.precision * 0.4 + m.speed * 0.2);
  },
}));

export default useStore;