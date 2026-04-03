// src/screens/Landing.jsx
// Full landing page: Navbar → Hero → Bhashini AI Section → Featured Modules → CTA → Footer

import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { MODULES } from '../data/modules';
import { onAuthChange, logOut } from '../services/firebase/auth';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
];

export default function Landing() {
  const { lang, setLang, setScreen, setAuthModal, user, setUser } = useStore();
  const [scrolled, setScrolled] = useState(false);

  // Listen for auth state
  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return unsub;
  }, [setUser]);

  // Track scroll for navbar shadow
  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop > 20);
  };

  return (
    <div
      onScroll={handleScroll}
      style={{
        position: 'fixed', inset: 0, zIndex: 10,
        overflowY: 'auto', overflowX: 'hidden',
        scrollBehavior: 'smooth',
      }}
    >

      {/* ═══════════════════════════════════════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '.75rem 2rem',
        background: scrolled ? 'rgba(2,12,27,0.95)' : 'rgba(2,12,27,0.6)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        transition: 'all .3s ease',
      }}>
        {/* Left — Logo */}
        <div style={{
          fontFamily: 'var(--ff-h)', fontSize: '1.35rem', fontWeight: 700,
          letterSpacing: '.25em',
          background: 'linear-gradient(135deg, var(--saffron), var(--cyan))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', cursor: 'pointer',
        }}>PRISM</div>

        {/* Center — Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
          {['Features', 'Modules', 'About'].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} style={{
              color: 'var(--txt2)', fontSize: '.85rem', fontFamily: 'var(--ff-b)',
              textDecoration: 'none', transition: 'color .2s', fontWeight: 500,
            }}
              onMouseEnter={e => e.target.style.color = 'var(--txt1)'}
              onMouseLeave={e => e.target.style.color = 'var(--txt2)'}
            >{label}</a>
          ))}
        </div>

        {/* Right — Bhashini badge + Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
          {/* Bhashini live badge */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: '.35rem',
            padding: '.22rem .7rem',
            background: 'rgba(0,229,255,0.06)',
            border: '1px solid rgba(0,229,255,0.18)',
            borderRadius: 20,
            fontFamily: 'var(--ff-m)', fontSize: '.65rem',
            color: 'var(--cyan)', letterSpacing: '.08em',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 6px var(--green)',
              animation: 'livePulse 1.4s ease-in-out infinite',
            }}/>
            Bhashini AI
          </span>

          {user ? (
            /* Logged in — avatar + sign out */
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--saffron), var(--cyan))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.75rem', fontWeight: 700, color: 'var(--bg-deep)',
                fontFamily: 'var(--ff-h)',
                overflow: 'hidden',
              }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                ) : (
                  (user.displayName || user.email || 'U')[0].toUpperCase()
                )}
              </div>
              <span style={{ fontSize: '.82rem', color: 'var(--txt2)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button onClick={logOut} style={{
                padding: '.3rem .65rem', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 5,
                color: 'var(--txt3)', fontSize: '.72rem', cursor: 'pointer',
                fontFamily: 'var(--ff-b)', transition: 'all .2s',
              }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.color = 'var(--red)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--txt3)'; }}
              >Sign Out</button>
            </div>
          ) : (
            /* Logged out — Login + Sign Up */
            <>
              <button onClick={() => setAuthModal('login')} style={{
                padding: '.38rem .9rem', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 6,
                color: 'var(--txt2)', fontSize: '.82rem', cursor: 'pointer',
                fontFamily: 'var(--ff-b)', fontWeight: 500,
                transition: 'all .2s',
              }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.color = 'var(--cyan)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--txt2)'; }}
              >Login</button>
              <button onClick={() => setAuthModal('signup')} style={{
                padding: '.38rem .9rem',
                background: 'linear-gradient(135deg, var(--saffron), var(--gold))',
                border: 'none', borderRadius: 6,
                color: 'var(--bg-deep)', fontSize: '.82rem', cursor: 'pointer',
                fontFamily: 'var(--ff-h)', fontWeight: 700,
                letterSpacing: '.06em',
                transition: 'filter .2s',
                boxShadow: '0 0 12px rgba(255,153,51,0.2)',
              }}
                onMouseEnter={e => e.target.style.filter = 'brightness(1.1)'}
                onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
              >Sign Up</button>
            </>
          )}
        </div>
      </nav>


      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '5rem 2rem 4rem',
        position: 'relative',
      }}>
        {/* Hex logo */}
        <div className="anim d1" style={{ width: 120, height: 120, position: 'relative', marginBottom: '1.6rem' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', animation: 'spinSlow 14s linear infinite',
              filter: 'drop-shadow(0 0 18px rgba(0,229,255,0.45))' }}>
            <defs>
              <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF9933"/>
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
            <svg viewBox="0 0 60 60" style={{ width: 55, height: 55,
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
          fontFamily: 'var(--ff-h)', fontSize: 'clamp(3rem,7vw,5rem)',
          fontWeight: 700, letterSpacing: '.3em',
          background: 'linear-gradient(135deg,var(--saffron) 0%,var(--gold) 45%,var(--cyan) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', lineHeight: 1, marginBottom: '.35rem',
        }}>PRISM</div>

        <div className="anim d2" style={{
          fontFamily: 'var(--ff-h)', fontSize: '.78rem', letterSpacing: '.22em',
          color: 'var(--txt2)', textTransform: 'uppercase', marginBottom: '1rem',
        }}>Precision Interactive Skill Mastery</div>

        {/* Deco bar */}
        <div className="anim d3" style={{
          width: 180, height: 1,
          background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
          margin: '.2rem auto 1.2rem',
        }}/>

        <p className="anim d3" style={{
          fontSize: '1.05rem', color: 'var(--txt2)', maxWidth: 540,
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
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          BHASHINI AI COACHING SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{
        padding: '4rem 2.5rem',
        textAlign: 'center',
      }}>
        <h2 className="anim" style={{
          fontFamily: 'var(--ff-h)', fontSize: '2rem', fontWeight: 700,
          marginBottom: '.6rem',
        }}>
          Real-Time <span style={{ color: 'var(--saffron)' }}>Bhashini AI</span> Coaching
        </h2>
        <p style={{
          color: 'var(--txt2)', fontSize: '.92rem', maxWidth: 600,
          margin: '0 auto 2.5rem', lineHeight: 1.7,
        }}>
          Overcome language barriers. PRISM integrates with India's Bhashini API to provide
          instant, contextual voice and text coaching in regional languages during complex XR tasks.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.2rem', maxWidth: 960, margin: '0 auto',
        }}>
          {BHASHINI_FEATURES.map((f, i) => (
            <div key={i} className={`anim d${i + 1}`} style={{
              background: '#091a2e',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '1.8rem 1.5rem',
              textAlign: 'left',
              transition: 'all .25s ease',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = f.accentBorder;
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,.3), 0 0 15px ${f.accentGlow}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: f.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', marginBottom: '1rem',
                boxShadow: `0 0 12px ${f.accentGlow}`,
              }}>{f.icon}</div>

              <h3 style={{
                fontFamily: 'var(--ff-h)', fontSize: '1.1rem', fontWeight: 700,
                color: 'var(--txt1)', marginBottom: '.5rem',
              }}>{f.title}</h3>
              <p style={{
                fontSize: '.82rem', color: 'var(--txt2)', lineHeight: 1.65,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURED TRAINING MODULES
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="modules" style={{
        padding: '4rem 2.5rem',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <h2 className="anim" style={{
              fontFamily: 'var(--ff-h)', fontSize: '2rem', fontWeight: 700,
              marginBottom: '.4rem',
            }}>Featured Training Modules</h2>
            <p style={{
              color: 'var(--cyan)', fontSize: '.82rem', fontFamily: 'var(--ff-m)',
              letterSpacing: '.05em',
            }}>Industry-standard curriculum mapped to national skill frameworks.</p>
          </div>
          <button onClick={() => setScreen('modules')} style={{
            background: 'none', border: 'none',
            color: 'var(--saffron)', fontSize: '.82rem', fontFamily: 'var(--ff-m)',
            cursor: 'pointer', letterSpacing: '.05em',
            transition: 'color .2s',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--saffron)'}
          >View All Categories →</button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.2rem',
        }}>
          {MODULES.slice(0, 3).map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} delay={i + 1} onStart={() => setScreen('modules')} />
          ))}

          {/* Explore catalog card */}
          <div
            className="anim d4"
            onClick={() => setScreen('modules')}
            style={{
              background: '#091a2e',
              border: '1px dashed rgba(0,229,255,0.2)',
              borderRadius: 10,
              padding: '2rem 1.5rem',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all .25s ease',
              minHeight: 280,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--cyan)';
              e.currentTarget.style.background = '#0b1f35';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)';
              e.currentTarget.style.background = '#091a2e';
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              border: '2px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', color: 'var(--cyan)',
              marginBottom: '.8rem',
            }}>+</div>
            <div style={{
              fontFamily: 'var(--ff-h)', fontSize: '1.05rem', fontWeight: 700,
              color: 'var(--txt1)', marginBottom: '.3rem',
            }}>Explore Catalog</div>
            <div style={{
              fontSize: '.75rem', color: 'var(--txt3)', fontFamily: 'var(--ff-m)',
            }}>{MODULES.length} more modules</div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="about" style={{
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Glow background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(79,70,229,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 30px rgba(99,102,241,0.3)',
          }}>
            <span style={{ fontSize: '1.6rem' }}>⚡</span>
          </div>

          <h2 className="anim" style={{
            fontFamily: 'var(--ff-h)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700, marginBottom: '.8rem', lineHeight: 1.2,
          }}>Ready to upskill the workforce?</h2>

          <p style={{
            color: 'var(--txt2)', fontSize: '.92rem',
            maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7,
          }}>
            No VR headsets required. No heavy downloads. PRISM runs directly in any modern
            web browser, bringing enterprise-grade simulation to everyone.
          </p>

          <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setScreen('modules')} style={{
              padding: '.8rem 1.8rem',
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              color: '#fff', border: 'none', borderRadius: 8,
              fontFamily: 'var(--ff-h)', fontWeight: 700, fontSize: '.92rem',
              cursor: 'pointer', letterSpacing: '.08em',
              transition: 'filter .2s, transform .15s',
              boxShadow: '0 0 20px rgba(99,102,241,0.3)',
            }}
              onMouseEnter={e => { e.target.style.filter = 'brightness(1.15)'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.filter = 'brightness(1)'; e.target.style.transform = 'translateY(0)'; }}
            >Launch Free Trial</button>
            <button style={{
              padding: '.8rem 1.8rem',
              background: 'transparent',
              color: 'var(--txt1)', border: '1px solid var(--border)', borderRadius: 8,
              fontFamily: 'var(--ff-h)', fontWeight: 700, fontSize: '.92rem',
              cursor: 'pointer', letterSpacing: '.08em',
              transition: 'all .2s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--txt2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'transparent'; }}
            >Contact Enterprise Sales</button>
          </div>

          <p style={{
            marginTop: '1.5rem', fontSize: '.68rem',
            color: 'var(--txt3)', fontFamily: 'var(--ff-m)',
            letterSpacing: '.05em', textTransform: 'uppercase',
          }}>
            Compatible with Chrome, Edge, Firefox & Safari (WebGL 2.0 required)
          </p>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem 2.5rem',
        borderTop: '1px solid var(--border)',
        background: 'rgba(2,12,27,0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          {/* Small hex icon */}
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--saffron), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.55rem', color: 'var(--bg-deep)', fontWeight: 700,
            fontFamily: 'var(--ff-h)',
          }}>P</div>
          <span style={{
            fontFamily: 'var(--ff-h)', fontSize: '.85rem', fontWeight: 700,
            letterSpacing: '.12em', color: 'var(--txt2)',
          }}>PRISM XR</span>
        </div>

        <span style={{
          fontSize: '.72rem', color: 'var(--txt3)', fontFamily: 'var(--ff-m)',
        }}>
          © 2026 Precision Interactive Skill Mastery. Built for Bharat.
        </span>

        <div style={{ display: 'flex', gap: '.8rem' }}>
          {/* Twitter/X */}
          <a href="#" style={{ color: 'var(--txt3)', transition: 'color .2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--txt1)'}
            onMouseLeave={e => e.target.style.color = 'var(--txt3)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" style={{ color: 'var(--txt3)', transition: 'color .2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--txt1)'}
            onMouseLeave={e => e.target.style.color = 'var(--txt3)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
        </div>
      </footer>


      {/* Inline keyframes */}
      <style>{`
        @keyframes spinSlow { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}


// ── Module Card (for Featured section) ────────────────────────────────────────
function ModuleCard({ mod, delay, onStart }) {
  const isPlayable = mod.status === 'live';
  const duration = mod.learningPath?.length
    ? `${(mod.learningPath.length * 0.8).toFixed(1)} hours`
    : 'TBD';

  return (
    <div
      className={`anim d${delay}`}
      style={{
        background: '#091a2e',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'all .25s ease',
        cursor: 'pointer',
      }}
      onClick={onStart}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,153,51,0.35)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,.4), 0 0 15px rgba(255,153,51,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ width: '100%', height: 160, overflow: 'hidden', position: 'relative', background: '#071828' }}>
        <img
          src={mod.image}
          alt={mod.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        {!isPlayable && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)',
            borderRadius: 4, padding: '.15rem .45rem',
            fontFamily: 'var(--ff-m)', fontSize: '.58rem', color: 'var(--cyan)',
            letterSpacing: '.08em',
          }}>SOON</div>
        )}
        {/* Top accent */}
        {isPlayable && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, var(--saffron), var(--gold), var(--cyan))',
          }}/>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '1.1rem 1.2rem 1.2rem' }}>
        <h3 style={{
          fontFamily: 'var(--ff-h)', fontSize: '1.05rem', fontWeight: 700,
          marginBottom: '.35rem', color: 'var(--txt1)', lineHeight: 1.2,
        }}>{mod.title}</h3>
        <p style={{
          fontSize: '.78rem', color: 'var(--txt2)', lineHeight: 1.55,
          marginBottom: '.8rem',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{mod.description}</p>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '.7rem', color: 'var(--txt3)', fontFamily: 'var(--ff-m)',
            display: 'flex', alignItems: 'center', gap: '.35rem',
          }}>
            <span style={{ fontSize: '.6rem' }}>⏱</span>
            {duration}
          </span>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,153,51,0.1)',
            border: '1px solid rgba(255,153,51,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--saffron)', fontSize: '.8rem',
            transition: 'all .2s',
          }}>▶</div>
        </div>
      </div>
    </div>
  );
}


// ── Bhashini Feature Data ─────────────────────────────────────────────────────
const BHASHINI_FEATURES = [
  {
    icon: '🌐',
    title: 'Multilingual Overlay',
    desc: 'Heads-up display text translates instantly to Hindi, Tamil, Telugu, and 8 other languages based on user preferences.',
    iconBg: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,229,255,0.05))',
    accentBorder: 'rgba(0,229,255,0.35)',
    accentGlow: 'rgba(0,229,255,0.15)',
  },
  {
    icon: '🔊',
    title: 'Spatial Voice Guidance',
    desc: 'AI-generated voice instructions sound spatially accurate within the 3D environment, guiding hands-on tasks naturally.',
    iconBg: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))',
    accentBorder: 'rgba(99,102,241,0.4)',
    accentGlow: 'rgba(99,102,241,0.15)',
  },
  {
    icon: '🎯',
    title: 'Contextual Correction',
    desc: 'The AI analyzes your virtual movements and provides immediate, culturally nuanced feedback to correct mistakes.',
    iconBg: 'linear-gradient(135deg, rgba(255,153,51,0.15), rgba(255,153,51,0.05))',
    accentBorder: 'rgba(255,153,51,0.35)',
    accentGlow: 'rgba(255,153,51,0.15)',
  },
];