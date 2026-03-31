// src/screens/ModuleSelect.jsx
import useStore from '../store/useStore';
import { useTrainingSession } from '../hooks/useTrainingSession';
import { MODULES } from '../data/modules';

const LANG_NAMES = { en: 'English', hi: 'हिंदी', ta: 'தமிழ்', bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी' };

export default function ModuleSelect() {
  const { lang, setScreen } = useStore();
  const { launch } = useTrainingSession();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
      <div className="topbar">
        <div className="topbar-logo">PRISM</div>
        <div className="topbar-right">
          <span style={{ fontSize: '.78rem', color: 'var(--txt3)', fontFamily: 'var(--ff-m)' }}>
            {lang.toUpperCase()} · {LANG_NAMES[lang]}
          </span>
          <span className="bhashini-badge"><span className="dot-live"/>Bhashini</span>
          <button className="sm-btn" onClick={() => setScreen('landing')}>← Home</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
        <div className="anim" style={{ marginBottom: '1.8rem' }}>
          <h2 style={{ fontFamily: 'var(--ff-h)', fontSize: '2.2rem', fontWeight: 600 }}>
            Select Training Module
          </h2>
          <p style={{ color: 'var(--txt2)', fontSize: '.9rem', marginTop: '.35rem' }}>
            Choose a vocational sector to enter the immersive VR simulation
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px,1fr))',
          gap: '1.2rem', maxWidth: 1100,
        }}>
          {MODULES.map((mod, i) => (
            <ModCard
              key={mod.id}
              mod={mod}
              delay={i + 1}
              onLaunch={() => mod.status === 'live' && launch(mod.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ModCard({ mod, delay, onLaunch }) {
  const isLive = mod.status === 'live';

  return (
    <div
      className={`anim d${delay}`}
      onClick={onLaunch}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isLive ? 'var(--saffron)' : 'var(--border)'}`,
        borderRadius: 3, padding: '1.4rem',
        cursor: isLive ? 'pointer' : 'default',
        opacity: isLive ? 1 : 0.45,
        transition: 'all .28s',
        position: 'relative', overflow: 'hidden',
        boxShadow: isLive ? 'var(--glow-s)' : 'none',
      }}
    >
      {/* Top accent bar */}
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg,var(--saffron),var(--gold))',
        }}/>
      )}

      <div style={{
        width: 44, height: 44, borderRadius: 3,
        background: mod.iconBg, color: mod.iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', marginBottom: '.9rem',
      }}>
        {mod.icon}
      </div>

      <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '.4rem' }}>
        {mod.title}
      </h3>
      <p style={{ fontSize: '.83rem', color: 'var(--txt2)', lineHeight: 1.55 }}>
        {mod.description}
      </p>

      <div style={{ display: 'flex', gap: '.35rem', marginTop: '.9rem', flexWrap: 'wrap' }}>
        {mod.tags.map((tag, j) => (
          <span key={j} className={`tag ${mod.tagColors[j] || 'tc'}`}>{tag}</span>
        ))}
      </div>
    </div>
  );
}