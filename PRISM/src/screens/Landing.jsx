// src/screens/Landing.jsx
import useStore from '../store/useStore';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
];

export default function Landing() {
  const { lang, setLang, setScreen } = useStore();

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: '2rem 1.5rem', gap: 0,
      }}>

        {/* Hex logo */}
        <div className="anim d1" style={{ width: 130, height: 130, position: 'relative', marginBottom: '1.8rem' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', animation: 'spinSlow 14s linear infinite',
              filter: 'drop-shadow(0 0 18px rgba(0,229,255,0.45))' }}>
            <defs>
              <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#FF9933"/>
                <stop offset="100%" stopColor="#00E5FF"/>
              </linearGradient>
            </defs>
            <polygon points="50,4 96,27 96,73 50,96 4,73 4,27"
              stroke="url(#hg1)" strokeWidth="1.8" fill="none"/>
            <polygon points="50,14 86,33 86,67 50,86 14,67 14,33"
              stroke="rgba(0,229,255,0.22)" strokeWidth="1" fill="none" strokeDasharray="5 5"/>
            <polygon points="50,24 76,39 76,61 50,76 24,61 24,39"
              stroke="rgba(255,153,51,0.18)" strokeWidth="1" fill="none" strokeDasharray="3 8"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 60 60" style={{ width: 58, height: 58,
              animation: 'spinSlow 14s linear infinite reverse',
              filter: 'drop-shadow(0 0 10px rgba(255,153,51,0.7))' }}>
              <polygon points="30,5 55,30 30,55 5,30" fill="none" stroke="#FF9933" strokeWidth="1.8"/>
              <polygon points="30,14 46,30 30,46 14,30"
                fill="rgba(255,153,51,0.12)" stroke="#FFD700" strokeWidth="1"/>
              <circle cx="30" cy="30" r="5" fill="#FF9933"/>
              <line x1="30" y1="14" x2="30" y2="46" stroke="rgba(255,215,0,0.4)" strokeWidth=".8"/>
              <line x1="14" y1="30" x2="46" y2="30" stroke="rgba(255,215,0,0.4)" strokeWidth=".8"/>
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <div className="anim d2" style={{
          fontFamily: 'var(--ff-h)', fontSize: 'clamp(3.2rem,8vw,5.5rem)',
          fontWeight: 700, letterSpacing: '.3em',
          background: 'linear-gradient(135deg,var(--saffron) 0%,var(--gold) 45%,var(--cyan) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', lineHeight: 1, marginBottom: '.35rem',
        }}>PRISM</div>

        <div className="anim d2" style={{
          fontFamily: 'var(--ff-h)', fontSize: '.8rem', letterSpacing: '.22em',
          color: 'var(--txt2)', textTransform: 'uppercase', marginBottom: '1.2rem',
        }}>Precision Interactive Skill Mastery</div>

        {/* Deco bar */}
        <div className="anim d3" style={{
          width: 180, height: 1,
          background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
          margin: '.2rem auto 1.2rem',
        }}/>

        <p className="anim d3" style={{
          fontSize: '1rem', color: 'var(--txt2)', maxWidth: 480,
          lineHeight: 1.75, fontWeight: 300, marginBottom: '1.6rem',
        }}>
          Zero-install WebXR vocational training with real-time multilingual AI coaching
          via Bhashini API — built for India's next-generation workforce.
        </p>

        {/* Language pills */}
        <div className="anim d4" style={{
          display: 'flex', gap: '.4rem', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '1.8rem',
        }}>
          {LANGS.map(l => (
            <button key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                padding: '.35rem .85rem',
                border: `1px solid ${lang === l.code ? 'var(--saffron)' : 'var(--border)'}`,
                background: lang === l.code ? 'rgba(255,153,51,0.1)' : 'transparent',
                color: lang === l.code ? 'var(--saffron)' : 'var(--txt2)',
                borderRadius: 20, cursor: 'pointer',
                fontFamily: 'var(--ff-b)', fontSize: '.78rem',
                transition: 'all .2s',
                boxShadow: lang === l.code ? 'var(--glow-s)' : 'none',
              }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-cta anim d5" onClick={() => setScreen('modules')}>
          <span>⚡ &nbsp;BEGIN TRAINING</span>
        </button>

        {/* Stats */}
        <div className="anim d5" style={{ display: 'flex', gap: '3.5rem', marginTop: '2.5rem' }}>
          {[
            { n: '22+', l: 'Languages' },
            { n: '8',   l: 'Sectors' },
            { n: '₹0',  l: 'Install Cost' },
            { n: '∞',   l: 'Retries' },
          ].map(({ n, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--ff-h)', fontSize: '2.1rem', fontWeight: 700, color: 'var(--cyan)', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '.68rem', color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '.12em', marginTop: '.15rem' }}>{l}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Spin animation */}
      <style>{`@keyframes spinSlow { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}