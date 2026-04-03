// src/services/audio.js
// Lightweight sound effects using Web Audio API.
// No external files needed — tones are synthesised on-the-fly.

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// ── Helper: play a tone at given frequency, duration, and shape ──────────────
function playTone(freq, duration = 0.15, type = 'sine', volume = 0.25) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio not available — silently fail
  }
}

// ── Click / tap SFX ──────────────────────────────────────────────────────────
export function sfxClick() {
  playTone(880, 0.08, 'sine', 0.15);
  setTimeout(() => playTone(1100, 0.06, 'sine', 0.1), 40);
}

// ── Hotspot interaction SFX ──────────────────────────────────────────────────
export function sfxInteract() {
  playTone(523.25, 0.1, 'sine', 0.2);    // C5
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.2), 80);   // E5
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.18), 160); // G5
}

// ── Success chime (ascending arpeggio) ───────────────────────────────────────
export function sfxSuccess() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.22, 'sine', 0.2 - i * 0.03), i * 100);
  });
}

// ── Violation / error buzzer ─────────────────────────────────────────────────
export function sfxViolation() {
  playTone(220, 0.3, 'sawtooth', 0.15);
  setTimeout(() => playTone(185, 0.4, 'sawtooth', 0.12), 200);
}

// ── Step advance "proceed" ───────────────────────────────────────────────────
export function sfxProceed() {
  playTone(440, 0.08, 'triangle', 0.12);
  setTimeout(() => playTone(554.37, 0.1, 'triangle', 0.1), 60);
}

// ── Button hover subtle tick ─────────────────────────────────────────────────
export function sfxHover() {
  playTone(2200, 0.03, 'sine', 0.06);
}

// ── Ambient hospital hum (low background drone) ─────────────────────────────
let ambientNode = null;
let ambientGain = null;

export function startAmbient() {
  if (ambientNode) return;
  try {
    const ctx = getCtx();
    ambientNode = ctx.createOscillator();
    ambientGain = ctx.createGain();
    ambientNode.type = 'sine';
    ambientNode.frequency.setValueAtTime(85, ctx.currentTime);
    ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
    ambientNode.connect(ambientGain).connect(ctx.destination);
    ambientNode.start();
  } catch (e) {}
}

export function stopAmbient() {
  if (ambientGain) {
    try {
      const ctx = getCtx();
      ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        ambientNode?.stop();
        ambientNode = null;
        ambientGain = null;
      }, 1200);
    } catch (e) {}
  }
}
