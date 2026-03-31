// src/components/HUD/LanguagePanel.jsx
import useStore from '../../store/useStore';

const LANGS = [
  { code: 'en', label: 'EN  English' },
  { code: 'hi', label: 'HI  हिंदी'  },
  { code: 'ta', label: 'TA  தமிழ்'  },
  { code: 'bn', label: 'BN  বাংলা'  },
  { code: 'te', label: 'TE  తెలుగు' },
];

export default function LanguagePanel() {
  const { lang, setLang, showToast } = useStore();

  const switchLang = (code) => {
    setLang(code);
    const found = LANGS.find(l => l.code === code);
    showToast(`🌐 ${found?.label.split('  ')[1] || code} — Bhashini Active`);
  };

  return (
    <div style={{
      position: 'absolute', top: 14, left: 14,
      background: 'rgba(7,18,36,0.92)',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
      padding: '.75rem .9rem', borderRadius: 3,
      pointerEvents: 'all', minWidth: 130,
    }}>
      <div style={{
        fontFamily: 'var(--ff-m)', fontSize: '.58rem',
        color: 'var(--txt3)', textTransform: 'uppercase',
        letterSpacing: '.12em', marginBottom: '.5rem',
      }}>
        🌐 BHASHINI
      </div>

      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLang(code)}
          style={{
            display: 'block', width: '100%',
            padding: '.22rem .5rem',
            background: lang === code ? 'rgba(255,153,51,0.08)' : 'transparent',
            border: `1px solid ${lang === code ? 'var(--saffron)' : 'transparent'}`,
            color: lang === code ? 'var(--saffron)' : 'var(--txt2)',
            borderRadius: 2, cursor: 'pointer',
            fontFamily: 'var(--ff-b)', fontSize: '.72rem',
            textAlign: 'left', transition: 'all .18s',
            marginBottom: '.15rem',
          }}>
          {label}
        </button>
      ))}
    </div>
  );
}