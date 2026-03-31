// src/hooks/useTimer.js
import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

export function useTimer(active) {
  const { tickTimer, updateMetrics, metrics } = useStore();
  const ref = useRef(null);

  useEffect(() => {
    if (!active) { clearInterval(ref.current); return; }

    ref.current = setInterval(() => {
      tickTimer();
      // Slow speed decay after 25 s — mirrors original prototype behaviour
      const elapsed = useStore.getState().elapsed;
      if (elapsed > 25) {
        updateMetrics({
          speed: Math.max(35, useStore.getState().metrics.speed - 0.04),
        });
      }
    }, 1000);

    return () => clearInterval(ref.current);
  }, [active]);
}

export function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}