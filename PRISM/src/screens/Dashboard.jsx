// src/screens/Dashboard.jsx
import { useEffect, useRef, useState } from 'react';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import useStore from '../store/useStore';
import { useTrainingSession } from '../hooks/useTrainingSession';
import { getRecentSessions } from '../services/firebase/firestore';
import { formatTime } from '../hooks/useTimer';
import ScoreRing from '../components/ScoreRing';
import CPR_STEPS from '../data/steps/healthcare';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LANG_NAMES = { en: 'English', hi: 'हिंदी', ta: 'தமிழ்', bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी' };

const BADGES = [
  { icon: '🛡️', label: 'Safety First',   condition: (m) => m.safety    >= 90, earned: true  },
  { icon: '⚡', label: 'Quick Response', condition: (m) => m.speed     >= 80, earned: false },
  { icon: '❤️', label: 'Life Saver',     condition: ()  => true,               earned: true  },
  { icon: '🏆', label: 'Gold Standard',  condition: (m) => m.precision >= 95, earned: false },
  { icon: '⏱️', label: 'Speed Expert',   condition: (m) => m.speed     >= 90, earned: false },
  { icon: '🔬', label: 'AED Certified',  condition: ()  => true,               earned: true  },
];

export default function Dashboard() {
  const store   = useStore();
  const { retry } = useTrainingSession();
  const chartRef  = useRef(null);
  const chartInst = useRef(null);
  const [history, setHistory] = useState([]);

  const metrics    = store.metrics;
  const finalScore = store.getFinalScore();
  const saf = Math.round(metrics.safety);
  const prc = Math.round(metrics.precision);
  const spd = Math.round(metrics.speed);

  // Fetch recent sessions from Firestore for history panel
  useEffect(() => {
    getRecentSessions(5).then(setHistory).catch(() => {});
  }, []);

  // Build chart
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInst.current) chartInst.current.destroy();

    const scores = store.scores.length > 0
      ? [...store.scores, ...Array(Math.max(0, CPR_STEPS.length - store.scores.length)).fill(null)]
      : CPR_STEPS.map(() => 68 + Math.round(Math.random() * 27));

    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: CPR_STEPS.map((_, i) => `S${i + 1}`),
        datasets: [{
          label: 'Score',
          data: scores,
          backgroundColor: scores.map(s =>
            s == null        ? 'rgba(255,255,255,0.05)' :
            s >= 90          ? 'rgba(0,230,118,0.65)'   :
            s >= 75          ? 'rgba(0,229,255,0.6)'    :
                               'rgba(255,153,51,0.6)'
          ),
          borderColor: scores.map(s =>
            s == null ? 'transparent' :
            s >= 90   ? '#00E676'     :
            s >= 75   ? '#00E5FF'     :
                        '#FF9933'
          ),
          borderWidth: 1, borderRadius: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(7,18,36,0.96)',
            borderColor: 'rgba(0,229,255,0.3)', borderWidth: 1,
            titleColor: '#E8F4FD', bodyColor: '#7BACC8',
            callbacks: { label: ctx => ` Score: ${ctx.parsed.y ?? 'N/A'} / 100` },
          },
        },
        scales: {
          y: {
            min: 0, max: 100,
            grid:  { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#3A5A7A', font: { family: 'Space Mono', size: 9 } },
          },
          x: {
            grid:  { color: 'rgba(255,255,255,0.03)' },
            ticks: { color: '#3A5A7A', font: { family: 'Space Mono', size: 9 } },
          },
        },
      },
    });

    return () => chartInst.current?.destroy();
  }, [store.scores]);

  const earnedBadges = BADGES.map(b => ({ ...b, earned: b.condition(metrics) }));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-logo">PRISM</div>
        <div className="topbar-right">
          <span style={{ fontSize: '.78rem', color: 'var(--txt3)', fontFamily: 'var(--ff-m)' }}>
            {store.lang.toUpperCase()} · {LANG_NAMES[store.lang]}
          </span>
          <button className="sm-btn" onClick={() => store.setScreen('modules')}>← Modules</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>

          {/* Header */}
          <div className="anim" style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: '1.8rem',
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--ff-h)', fontSize: '2rem', fontWeight: 600, lineHeight: 1.1 }}>
                Training Complete 🎉
              </h2>
              <p style={{ color: 'var(--txt2)', fontSize: '.88rem', marginTop: '.3rem' }}>
                Healthcare &amp; First Aid — CPR Module
              </p>
              <small style={{ color: 'var(--txt3)', fontSize: '.75rem' }}>
                Language: {LANG_NAMES[store.lang]} &nbsp;·&nbsp; Bhashini API
              </small>
            </div>
            <ScoreRing score={finalScore} />
          </div>

          {/* Main grid */}
          <div className="anim d1" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '1.2rem', marginBottom: '1.2rem',
          }}>

            {/* Performance breakdown */}
            <DashCard title="Performance Breakdown">
              {[
                { name: 'Safety Compliance',    val: saf, color: 'var(--green)' },
                { name: 'Compression Precision', val: prc, color: 'var(--cyan)'  },
                { name: 'Response Speed',        val: spd, color: 'var(--amber)' },
                { name: 'Protocol Sequence',     val: 100, color: 'var(--green)' },
                { name: 'AED Deployment',        val: 90,  color: 'var(--teal)'  },
              ].map(({ name, val, color }) => (
                <div key={name} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '.5rem 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '.85rem', color: 'var(--txt2)' }}>{name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem' }}>
                    <div style={{ width: 72, height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${val}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 1s ease' }}/>
                    </div>
                    <span style={{ fontFamily: 'var(--ff-m)', fontSize: '.78rem', minWidth: 34, textAlign: 'right', color }}>
                      {val}%
                    </span>
                  </div>
                </div>
              ))}
            </DashCard>

            {/* Badges */}
            <DashCard title="Badges Earned">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.8rem' }}>
                {earnedBadges.map(({ icon, label, earned }) => (
                  <div key={label} style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '.3rem',
                    padding: '.7rem .4rem',
                    background: earned ? 'rgba(255,215,0,0.05)' : 'var(--bg-surface)',
                    border: `1px solid ${earned ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 3, textAlign: 'center',
                  }}>
                    <span style={{ fontSize: '1.6rem', opacity: earned ? 1 : 0.3 }}>{icon}</span>
                    <span style={{
                      fontSize: '.62rem',
                      color: earned ? 'var(--gold)' : 'var(--txt3)',
                      fontFamily: 'var(--ff-m)',
                    }}>{label}</span>
                  </div>
                ))}
              </div>
            </DashCard>

            {/* Chart — full width */}
            <DashCard title="Step-by-Step Performance" fullWidth>
              <canvas ref={chartRef} height={100}/>
            </DashCard>

            {/* Violations log */}
            {store.violations.length > 0 && (
              <DashCard title="Safety Violations" fullWidth>
                {store.violations.map((v, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '1rem', alignItems: 'center',
                    padding: '.45rem 0', borderBottom: '1px solid var(--border)',
                    fontSize: '.82rem',
                  }}>
                    <span style={{ color: 'var(--red)', fontFamily: 'var(--ff-m)', fontSize: '.7rem' }}>⚠️ Step {v.step + 1}</span>
                    <span style={{ color: 'var(--txt2)' }}>{v.type.replace(/_/g, ' ')}</span>
                    <span style={{ color: 'var(--txt3)', marginLeft: 'auto', fontFamily: 'var(--ff-m)', fontSize: '.68rem' }}>
                      Precision: {v.precision}% (min {v.threshold}%)
                    </span>
                  </div>
                ))}
              </DashCard>
            )}

            {/* Recent sessions from Firestore */}
            {history.length > 0 && (
              <DashCard title="📡 Recent Sessions (Firestore)" fullWidth>
                {history.map((s) => (
                  <div key={s.id} style={{
                    display: 'flex', gap: '1rem', alignItems: 'center',
                    padding: '.45rem 0', borderBottom: '1px solid var(--border)',
                    fontSize: '.82rem',
                  }}>
                    <span style={{ color: 'var(--cyan)', fontFamily: 'var(--ff-m)', fontSize: '.7rem', minWidth: 70 }}>
                      {s.language?.toUpperCase() || 'EN'}
                    </span>
                    <span style={{ color: 'var(--txt2)' }}>{s.moduleId}</span>
                    <span style={{ color: 'var(--saffron)', marginLeft: 'auto', fontFamily: 'var(--ff-m)' }}>
                      {s.finalScore ?? '--'} pts
                    </span>
                    <span style={{ color: 'var(--txt3)', fontFamily: 'var(--ff-m)', fontSize: '.68rem' }}>
                      {s.elapsedSec ? formatTime(s.elapsedSec) : '--:--'}
                    </span>
                  </div>
                ))}
              </DashCard>
            )}

          </div>

          {/* Actions */}
          <div className="anim d2" style={{ display: 'flex', gap: '.9rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.3rem' }}>
            <button
              onClick={retry}
              style={{
                padding: '.7rem 1.8rem', background: 'transparent',
                color: 'var(--cyan)', border: '1px solid var(--cyan)',
                fontFamily: 'var(--ff-h)', fontSize: '.95rem',
                letterSpacing: '.1em', cursor: 'pointer', transition: 'all .2s',
              }}>
              ↺ Retry Module
            </button>

            <button
              onClick={() => store.setScreen('modules')}
              style={{
                padding: '.7rem 1.8rem',
                background: 'var(--saffron)', color: 'var(--bg-deep)',
                border: 'none', fontFamily: 'var(--ff-h)',
                fontWeight: 600, fontSize: '.95rem',
                letterSpacing: '.1em', cursor: 'pointer',
                clipPath: 'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)',
                transition: 'background .2s',
              }}>
              → Next Module
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span style={{ fontSize: '.72rem', color: 'var(--txt3)', fontFamily: 'var(--ff-m)' }}>COMPLETION TIME</span>
              <span style={{ fontFamily: 'var(--ff-m)', color: 'var(--saffron)', fontSize: '.88rem' }}>
                {formatTime(store.elapsed)}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function DashCard({ title, children, fullWidth }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 3, padding: '1.3rem',
      gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <h3 style={{
        fontFamily: 'var(--ff-h)', fontSize: '.88rem', fontWeight: 600,
        color: 'var(--txt2)', textTransform: 'uppercase', letterSpacing: '.12em',
        marginBottom: '1rem',
      }}>{title}</h3>
      {children}
    </div>
  );
}