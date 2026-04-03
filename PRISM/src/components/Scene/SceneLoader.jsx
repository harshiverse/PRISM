// src/components/Scene/SceneLoader.jsx
// Loading overlay shown while R3F canvas + HDR environment loads.
// Uses drei's useProgress to track loading state.

import { useProgress } from '@react-three/drei';
import { useState, useEffect } from 'react';

export default function SceneLoader() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);

  // Fade out after loading completes
  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setShow(false), 600);
      return () => clearTimeout(t);
    }
  }, [active, progress]);

  if (!show) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 500,
      background: 'rgba(2,12,27,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.5s ease',
      opacity: (!active && progress >= 100) ? 0 : 1,
      pointerEvents: (!active && progress >= 100) ? 'none' : 'all',
    }}>
      {/* Spinning hex logo */}
      <div style={{ width: 80, height: 80, marginBottom: '1.5rem' }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%', height: '100%',
            animation: 'spinSlow 3s linear infinite',
            filter: 'drop-shadow(0 0 14px rgba(0,229,255,0.5))',
          }}>
          <defs>
            <linearGradient id="lg-loader" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF9933"/>
              <stop offset="100%" stopColor="#00E5FF"/>
            </linearGradient>
          </defs>
          <polygon points="50,4 96,27 96,73 50,96 4,73 4,27"
            stroke="url(#lg-loader)" strokeWidth="2" fill="none"/>
          <polygon points="50,20 80,37 80,63 50,80 20,63 20,37"
            stroke="rgba(0,229,255,0.3)" strokeWidth="1" fill="none"
            strokeDasharray="4 6"/>
        </svg>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--ff-h)', fontSize: '1.2rem',
        fontWeight: 700, letterSpacing: '.25em',
        background: 'linear-gradient(135deg, var(--saffron), var(--cyan))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', marginBottom: '.6rem',
      }}>PRISM</div>

      {/* Progress bar */}
      <div style={{
        width: 180, height: 3,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2, overflow: 'hidden', marginBottom: '.5rem',
      }}>
        <div style={{
          width: `${Math.round(progress)}%`, height: '100%',
          background: 'linear-gradient(90deg, var(--saffron), var(--cyan))',
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }}/>
      </div>

      {/* Status text */}
      <div style={{
        fontFamily: 'var(--ff-m)', fontSize: '.68rem',
        color: 'var(--txt3)', letterSpacing: '.1em',
      }}>
        {progress < 100 ? `LOADING SCENE — ${Math.round(progress)}%` : 'INITIALIZING…'}
      </div>

      <style>{`@keyframes spinSlow { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
