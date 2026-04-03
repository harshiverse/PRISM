// src/screens/ModuleSelect.jsx
import { useState } from 'react';
import useStore from '../store/useStore';
import { useTrainingSession } from '../hooks/useTrainingSession';
import { MODULES } from '../data/modules';

const LANG_NAMES = { en: 'English', hi: 'हिंदी', ta: 'தமிழ்', bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी' };

// ── Mock live participant count ───────────────────────────────────────────────
const LIVE_USERS = 12;

export default function ModuleSelect() {
  const { lang, setScreen } = useStore();
  const { launch } = useTrainingSession();
  const [modal, setModal] = useState(null); // { type, mod }

  const openModal = (type, mod) => {
    // 'beginner' and 'ar' launch directly; 'practice', 'live' open modals
    if (type === 'beginner') { launch(mod.id, 'beginner'); return; }
    if (type === 'ar')       { launch(mod.id, 'ar');       return; }
    setModal({ type, mod });
  };
  const closeModal = () => setModal(null);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', background: '#0d1117' }}>

      {/* ── Topbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'rgba(7,18,36,0.97)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        flexShrink: 0, zIndex: 50,
      }}>
        <div style={{
          fontFamily: 'var(--ff-h)', fontSize: '1.45rem', fontWeight: 700,
          letterSpacing: '.25em',
          background: 'linear-gradient(135deg, var(--saffron), var(--cyan))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>PRISM</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <span style={{ fontSize: '.88rem', color: 'var(--txt3)', fontFamily: 'var(--ff-m)' }}>
            {lang.toUpperCase()} · {LANG_NAMES[lang]}
          </span>
          <span className="bhashini-badge" style={{ fontSize: '.75rem', padding: '.28rem .8rem' }}>
            <span className="dot-live"/>Bhashini
          </span>
          <button className="sm-btn" style={{ fontSize: '.88rem', padding: '.4rem 1rem' }}
            onClick={() => setScreen('landing')}>← Home</button>
        </div>
      </div>

      {/* ── Scroll area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2.4rem 2.4rem 3rem' }}>

        {/* Heading */}
        <div className="anim" style={{ marginBottom: '2.4rem' }}>
          <h2 style={{
            fontFamily: 'var(--ff-h)', fontSize: '2.5rem', fontWeight: 700,
            letterSpacing: '.02em', lineHeight: 1.1,
          }}>Select Training Module</h2>
          <p style={{ color: 'var(--txt2)', fontSize: '1.06rem', marginTop: '.5rem' }}>
            Choose a vocational sector to enter the immersive VR simulation
          </p>
        </div>

        {/* 2-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.6rem',
          alignItems: 'stretch',
        }}>
          {MODULES.map((mod, i) => (
            <ModCard
              key={mod.id}
              mod={mod}
              delay={Math.min(i + 1, 5)}
              onLaunch={() => mod.status === 'live' && launch(mod.id)}
              onMode={(type) => openModal(type, mod)}
            />
          ))}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal && (
        <ModalOverlay onClose={closeModal}>
          {modal.type === 'webxr'    && <WebXRModal    onClose={closeModal} onLaunch={() => { closeModal(); launch(modal.mod.id, 'ar'); }} />}
          {modal.type === 'practice' && <PracticeModal mod={modal.mod} onClose={closeModal} onLaunch={() => { closeModal(); launch(modal.mod.id, 'practice'); }} />}
          {modal.type === 'live'     && <LiveModal     mod={modal.mod} onClose={closeModal} />}
        </ModalOverlay>
      )}

      <style>{`
        @keyframes liveDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(1.5); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:translateY(18px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .mode-btn:hover { filter: brightness(1.18); transform: translateY(-1px); }
        .mod-card-wrap:hover .mod-card-inner {
          border-color: rgba(255,153,51,0.45) !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,.45), 0 0 20px rgba(255,153,51,0.12);
        }
        .mod-card-wrap.soon:hover .mod-card-inner {
          border-color: rgba(0,229,255,0.2) !important;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}

// ── Module Card ───────────────────────────────────────────────────────────────
function ModCard({ mod, delay, onLaunch, onMode }) {
  const isLive = mod.status === 'live';

  return (
    <div className={`anim d${delay} mod-card-wrap ${isLive ? '' : 'soon'}`}
      style={{ cursor: isLive ? 'pointer' : 'default', height: '100%' }}>
      <div className="mod-card-inner" style={{
        background: '#0d1f35',
        border: `1px solid ${isLive ? 'rgba(255,153,51,0.28)' : 'var(--border)'}`,
        borderRadius: 8,
        overflow: 'hidden',
        opacity: isLive ? 1 : 0.55,
        transition: 'all .28s ease',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top accent */}
        {isLive && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, var(--saffron), var(--gold), var(--cyan))',
            zIndex: 2,
          }}/>
        )}

        {/* Image */}
        <div style={{ width: '100%', height: 190, overflow: 'hidden', position: 'relative', background: '#071828' }}>
          <img
            src={mod.image}
            alt={mod.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: isLive ? 0.82 : 0.35,
              transition: 'opacity .3s',
            }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          {!isLive && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                background: 'rgba(0,229,255,0.12)',
                border: '1px solid rgba(0,229,255,0.3)',
                color: 'var(--cyan)', fontFamily: 'var(--ff-m)',
                fontSize: '.78rem', letterSpacing: '.12em',
                padding: '.4rem 1rem', borderRadius: 20,
              }}>COMING SOON</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '1.4rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--ff-h)', fontSize: '1.75rem', fontWeight: 700,
            lineHeight: 1.15, marginBottom: '.6rem',
            color: isLive ? 'var(--txt1)' : 'var(--txt2)',
          }}>{mod.title}</h3>

          <p style={{
            fontSize: '1rem', color: 'var(--txt2)',
            lineHeight: 1.65, marginBottom: '1.3rem',
            flex: 1,
          }}>{mod.description}</p>

          {/* Mode buttons */}
          {isLive ? (
            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
              <ModeBtn type="webxr"    onClick={() => onMode('webxr')} />
              <ModeBtn type="beginner" onClick={() => onMode('beginner')} />
              <ModeBtn type="practice" onClick={() => onMode('practice')} />
              <ModeBtn type="live"     onClick={() => onMode('live')} />
            </div>
          ) : (
            <span style={{
              fontFamily: 'var(--ff-m)', fontSize: '.75rem',
              color: 'var(--txt3)', letterSpacing: '.1em',
            }}>— Available Soon —</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mode Button ───────────────────────────────────────────────────────────────
const MODE_CONFIG = {
  webxr:    { label: '⬡ WebXR',        color: '#f5a623', badge: 'PRO',  free: false },
  beginner: { label: '▲ Beginner → Pro', color: '#00c9a7', badge: 'FREE', free: true  },
  practice: { label: '◈ Practice',      color: '#4f8ef7', badge: 'FREE', free: true  },
  live:     { label: 'Live',            color: '#ff4757', badge: 'FREE', free: true  },
};

function ModeBtn({ type, onClick }) {
  const cfg = MODE_CONFIG[type];
  return (
    <button
      className="mode-btn"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: '.4rem',
        padding: '.42rem .9rem',
        background: `${cfg.color}18`,
        border: `1px solid ${cfg.color}55`,
        color: cfg.color,
        borderRadius: 5, cursor: 'pointer',
        fontFamily: 'var(--ff-b)', fontWeight: 600, fontSize: '.82rem',
        transition: 'all .18s ease',
        position: 'relative',
      }}
    >
      {/* Live pulsing dot */}
      {type === 'live' && (
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#ff4757',
          boxShadow: '0 0 6px #ff4757',
          animation: 'liveDot 1.2s ease-in-out infinite',
          display: 'inline-block',
        }}/>
      )}
      {cfg.label}
      {/* FREE / PRO badge */}
      <span style={{
        fontSize: '.62rem', fontFamily: 'var(--ff-m)',
        background: cfg.free ? 'rgba(0,230,118,0.15)' : 'rgba(245,166,35,0.2)',
        color: cfg.free ? 'var(--green)' : '#f5a623',
        border: `1px solid ${cfg.free ? 'rgba(0,230,118,0.3)' : 'rgba(245,166,35,0.4)'}`,
        borderRadius: 3, padding: '0 .3rem',
        letterSpacing: '.06em',
      }}>{cfg.badge}</span>
    </button>
  );
}

// ── Modal Overlay ─────────────────────────────────────────────────────────────
function ModalOverlay({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(2,12,27,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0d1f35',
        border: '1px solid var(--border)',
        borderRadius: 10, padding: '2rem 2.2rem',
        maxWidth: 480, width: '100%',
        position: 'relative',
        animation: 'modalIn .28s ease',
        boxShadow: '0 24px 80px rgba(0,0,0,.6)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'transparent', border: 'none',
          color: 'var(--txt3)', fontSize: '1.3rem',
          cursor: 'pointer', lineHeight: 1,
          transition: 'color .15s',
        }}>×</button>
        {children}
      </div>
    </div>
  );
}

// ── Modal: WebXR ──────────────────────────────────────────────────────────────
function WebXRModal({ onClose, onLaunch }) {
  return (
    <>
      <div style={{ fontSize: '2.2rem', marginBottom: '.8rem' }}>🥽</div>
      <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: '1.35rem', marginBottom: '.6rem', color: '#f5a623' }}>
        WebXR Mode — PRO
      </h3>
      <p style={{ color: 'var(--txt2)', fontSize: '.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        WebXR Mode requires a premium subscription. Connect your VR headset for a fully immersive simulation.
        Upgrade to PRO to unlock spatial tracking, haptic feedback, and full 6DoF interaction.
      </p>
      <div style={{ display: 'flex', gap: '.8rem' }}>
        <button style={{
          flex: 1, padding: '.7rem', background: '#f5a623', color: '#0d1117',
          border: 'none', borderRadius: 5, fontFamily: 'var(--ff-h)',
          fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
          transition: 'filter .2s',
        }}
          onMouseEnter={e => e.target.style.filter = 'brightness(1.1)'}
          onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
          onClick={onLaunch}
        >⚡ Launch AR Session</button>
        <button onClick={onClose} style={{
          padding: '.7rem 1.2rem', background: 'transparent',
          border: '1px solid var(--border)', color: 'var(--txt2)',
          borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--ff-b)',
          transition: 'border-color .2s',
        }}>Cancel</button>
      </div>
    </>
  );
}

// ── Modal: Beginner → Pro ─────────────────────────────────────────────────────
function BeginnerModal({ mod, onClose }) {
  return (
    <>
      <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: '1.3rem', marginBottom: '.3rem', color: '#00c9a7' }}>
        Beginner → Pro Path
      </h3>
      <p style={{ color: 'var(--txt2)', fontSize: '.88rem', marginBottom: '1.4rem' }}>{mod.title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', marginBottom: '1.6rem' }}>
        {mod.learningPath.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: i === 0 ? '#00c9a7' : 'rgba(0,201,167,0.12)',
              border: `2px solid ${i === 0 ? '#00c9a7' : 'rgba(0,201,167,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--ff-m)', fontSize: '.72rem',
              color: i === 0 ? '#0d1117' : '#00c9a7', fontWeight: 700,
            }}>{i + 1}</div>
            {i < mod.learningPath.length - 1 && (
              <div style={{
                position: 'absolute', left: 13, marginTop: 28,
                width: 2, height: 20, background: 'rgba(0,201,167,0.2)',
              }}/>
            )}
            <span style={{ fontSize: '.9rem', color: i === 0 ? 'var(--txt1)' : 'var(--txt2)' }}>{step}</span>
          </div>
        ))}
      </div>
      <button style={{
        width: '100%', padding: '.75rem', background: '#00c9a7', color: '#0d1117',
        border: 'none', borderRadius: 5, fontFamily: 'var(--ff-h)',
        fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
        transition: 'filter .2s',
      }}
        onMouseEnter={e => e.target.style.filter = 'brightness(1.1)'}
        onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
        onClick={onClose}
      >▶ Start Step 1</button>
    </>
  );
}

// ── Modal: Practice ───────────────────────────────────────────────────────────
function PracticeModal({ onClose, onLaunch }) {
  return (
    <>
      <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: '1.3rem', marginBottom: '.6rem', color: '#4f8ef7' }}>
        Practice Mode
      </h3>
      <div style={{
        background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
        borderRadius: 8, padding: '1.1rem', marginBottom: '1.2rem',
        display: 'flex', alignItems: 'center', gap: '1.2rem',
      }}>
        <div style={{ fontSize: '2.8rem', flexShrink: 0 }}>📱</div>
        <div>
          <div style={{ fontFamily: 'var(--ff-h)', fontSize: '.88rem', color: '#4f8ef7', marginBottom: '.3rem' }}>
            Phone as Controller & Viewport
          </div>
          <div style={{ fontSize: '.82rem', color: 'var(--txt2)', lineHeight: 1.6 }}>
            Point your phone's camera to look around the scene. Tilt to navigate. Tap to interact.
          </div>
        </div>
      </div>
      <p style={{ color: 'var(--txt2)', fontSize: '.92rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        No headset needed. Practice Mode runs entirely in your browser — your smartphone becomes both your controller and your viewport for a hands-free experience.
      </p>
      <button style={{
        width: '100%', padding: '.75rem', background: '#4f8ef7', color: '#fff',
        border: 'none', borderRadius: 5, fontFamily: 'var(--ff-h)',
        fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
        transition: 'filter .2s',
      }}
        onMouseEnter={e => e.target.style.filter = 'brightness(1.15)'}
        onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
        onClick={onLaunch}
      >▶ Start Practice</button>
    </>
  );
}

// ── Modal: Live ───────────────────────────────────────────────────────────────
function LiveModal({ mod, onClose }) {
  const [tab, setTab] = useState('join');
  const [challengeName, setChallengeName] = useState('');
  const [inviteCode] = useState(() => Math.random().toString(36).slice(2,8).toUpperCase());

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--ff-h)', fontSize: '1.3rem', color: '#ff4757' }}>Live Challenge</h3>
        <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem',
          background: 'rgba(255,71,87,0.12)', border: '1px solid rgba(255,71,87,0.3)',
          borderRadius: 20, padding: '.2rem .65rem',
          fontFamily: 'var(--ff-m)', fontSize: '.7rem', color: '#ff4757',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4757',
            animation: 'liveDot 1.2s ease-in-out infinite', display: 'inline-block' }}/>
          {LIVE_USERS} online
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.3rem' }}>
        {['join','create'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '.5rem',
            background: tab === t ? 'rgba(255,71,87,0.15)' : 'transparent',
            border: `1px solid ${tab === t ? '#ff4757' : 'var(--border)'}`,
            color: tab === t ? '#ff4757' : 'var(--txt2)',
            borderRadius: 5, cursor: 'pointer',
            fontFamily: 'var(--ff-b)', fontWeight: 600, fontSize: '.88rem',
            transition: 'all .18s',
          }}>{t === 'join' ? '🎮 Join Challenge' : '➕ Create Challenge'}</button>
        ))}
      </div>

      {tab === 'join' ? (
        <>
          <div style={{
            background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.18)',
            borderRadius: 8, padding: '1.1rem', marginBottom: '1.3rem',
          }}>
            <div style={{ fontFamily: 'var(--ff-m)', fontSize: '.72rem', color: 'var(--txt3)', marginBottom: '.5rem' }}>
              LOBBY — {mod.title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--txt2)', fontSize: '.9rem' }}>Active participants</span>
              <span style={{ fontFamily: 'var(--ff-h)', fontSize: '1.5rem', color: '#ff4757' }}>{LIVE_USERS}</span>
            </div>
            <div style={{ marginTop: '.7rem', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <div style={{ width: '60%', height: '100%', background: '#ff4757', borderRadius: 2,
                animation: 'none' }}/>
            </div>
            <div style={{ fontFamily: 'var(--ff-m)', fontSize: '.68rem', color: 'var(--txt3)', marginTop: '.4rem' }}>
              Next round starts in 02:34
            </div>
          </div>
          <button style={{
            width: '100%', padding: '.75rem', background: '#ff4757', color: '#fff',
            border: 'none', borderRadius: 5, fontFamily: 'var(--ff-h)',
            fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'filter .2s',
          }}
            onMouseEnter={e => e.target.style.filter = 'brightness(1.12)'}
            onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
            onClick={onClose}
          >⚡ Join Live Challenge</button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontFamily: 'var(--ff-m)', fontSize: '.72rem', color: 'var(--txt3)',
              display: 'block', marginBottom: '.4rem', letterSpacing: '.08em' }}>
              CHALLENGE NAME
            </label>
            <input
              value={challengeName}
              onChange={e => setChallengeName(e.target.value)}
              placeholder="e.g. CPR Speed Run"
              style={{
                width: '100%', padding: '.6rem .8rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)', borderRadius: 5,
                color: 'var(--txt1)', fontFamily: 'var(--ff-b)', fontSize: '.9rem',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{ fontFamily: 'var(--ff-m)', fontSize: '.72rem', color: 'var(--txt3)',
              display: 'block', marginBottom: '.4rem', letterSpacing: '.08em' }}>
              INVITE CODE
            </label>
            <div style={{
              padding: '.6rem .8rem',
              background: 'rgba(255,71,87,0.08)',
              border: '1px solid rgba(255,71,87,0.25)', borderRadius: 5,
              fontFamily: 'var(--ff-m)', fontSize: '1.1rem',
              color: '#ff4757', letterSpacing: '.2em',
            }}>{inviteCode}</div>
          </div>
          <button style={{
            width: '100%', padding: '.75rem', background: '#ff4757', color: '#fff',
            border: 'none', borderRadius: 5, fontFamily: 'var(--ff-h)',
            fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'filter .2s',
          }}
            onMouseEnter={e => e.target.style.filter = 'brightness(1.12)'}
            onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
            onClick={onClose}
          >🚀 Create Challenge</button>
        </>
      )}
    </>
  );
}
