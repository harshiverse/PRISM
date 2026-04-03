// src/components/ScoreRing.jsx
// Animated score ring with SVG arc fill and counting number animation.

import { useState, useEffect, useRef } from 'react';

export default function ScoreRing({ score, size = 110 }) {
  const [display, setDisplay] = useState(0);
  const [mounted, setMounted] = useState(false);
  const animRef = useRef(null);

  const color = score >= 90 ? 'var(--green)' : score >= 75 ? 'var(--saffron)' : 'var(--red)';
  const rawColor = score >= 90 ? '#00E676' : score >= 75 ? '#FF9933' : '#FF1744';

  // SVG arc calculations
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animate count-up on mount
  useEffect(() => {
    setMounted(true);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * score));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  const dashOffset = circumference - (circumference * (mounted ? score : 0)) / 100;

  return (
    <div style={{
      width: size, height: size, position: 'relative',
      flexShrink: 0,
    }}>
      {/* SVG ring */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {/* Animated arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={rawColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25,0.46,0.45,0.94)',
            filter: `drop-shadow(0 0 6px ${rawColor}88)`,
          }}
        />
      </svg>

      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--ff-h)', fontSize: size * 0.22,
          fontWeight: 700, color, lineHeight: 1,
        }}>{display}</div>
        <div style={{
          fontSize: size * 0.065, color: 'var(--txt3)',
          textTransform: 'uppercase', letterSpacing: '.06em',
          marginTop: 2,
        }}>
          Skill Score
        </div>
      </div>
    </div>
  );
}