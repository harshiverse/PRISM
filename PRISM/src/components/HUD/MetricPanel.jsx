// src/components/HUD/MetricPanel.jsx
import { formatTime } from '../../hooks/useTimer';

const METRICS = [
  { key: 'safety',    label: 'SAFETY',    color: 'var(--green)' },
  { key: 'precision', label: 'PRECISION', color: 'var(--cyan)'  },
  { key: 'speed',     label: 'SPEED',     color: 'var(--amber)' },
];

export default function MetricPanel({ metrics, elapsed }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  return (
    <div style={{
      position: 'absolute', top: isMobile ? 8 : 14, right: isMobile ? 8 : 14,
      background: 'rgba(7,18,36,0.92)',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
      padding: isMobile ? '.6rem .7rem' : '.9rem 1.05rem',
      borderRadius: 3,
      pointerEvents: 'all',
      minWidth: isMobile ? 140 : 195,
      transform: isMobile ? 'scale(0.85)' : 'none',
      transformOrigin: 'top right',
    }}>
      <div style={{
        fontFamily: 'var(--ff-m)', fontSize: '.58rem',
        color: 'var(--txt3)', textTransform: 'uppercase',
        letterSpacing: '.12em', marginBottom: '.5rem',
      }}>⚡ SKILL-METRIC</div>

      {METRICS.map(({ key, label, color }) => {
        const val = Math.round(metrics[key]);
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '.55rem', marginBottom: '.55rem' }}>
            <span style={{ fontFamily: 'var(--ff-m)', fontSize: '.62rem', color: 'var(--txt2)', width: 58 }}>{label}</span>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${val}%`, height: '100%', background: color, borderRadius: 2, transition: 'width .5s ease' }}/>
            </div>
            <span style={{ fontFamily: 'var(--ff-m)', fontSize: '.7rem', width: 28, textAlign: 'right', color }}>{val}</span>
          </div>
        );
      })}

      <div style={{
        marginTop: '.7rem', paddingTop: '.6rem',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--ff-m)', fontSize: '.6rem', color: 'var(--txt3)' }}>ELAPSED</span>
        <span style={{ fontFamily: 'var(--ff-m)', fontSize: '.75rem', color: 'var(--saffron)' }}>
          {formatTime(elapsed)}
        </span>
      </div>
    </div>
  );
}