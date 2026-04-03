// src/components/AuthModal.jsx
// Login / Sign-up modal with Email+Password and Google OAuth.

import { useState } from 'react';
import useStore from '../store/useStore';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../services/firebase/auth';

export default function AuthModal() {
  const { authModal, setAuthModal, setUser, showToast } = useStore();
  const [isLogin, setIsLogin] = useState(authModal === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await signInWithEmail(email, pass);
      } else {
        user = await signUpWithEmail(email, pass, name);
      }
      setUser(user);
      showToast(`Welcome${user.displayName ? ', ' + user.displayName : ''}!`);
      setAuthModal(null);
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'Email already registered'
        : err.code === 'auth/wrong-password' ? 'Incorrect password'
        : err.code === 'auth/user-not-found' ? 'No account found with this email'
        : err.code === 'auth/weak-password' ? 'Password must be at least 6 characters'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : err.message || 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      setUser(user);
      showToast(`Welcome, ${user.displayName || 'User'}!`);
      setAuthModal(null);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div onClick={() => setAuthModal(null)} style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(2,12,27,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(145deg, #0d1f35 0%, #091625 100%)',
        border: '1px solid rgba(0,229,255,0.15)',
        borderRadius: 14,
        padding: '2.2rem 2.4rem',
        maxWidth: 420, width: '100%',
        position: 'relative',
        animation: 'modalIn .28s ease',
        boxShadow: '0 24px 80px rgba(0,0,0,.6), 0 0 40px rgba(0,229,255,0.06)',
      }}>
        {/* Close */}
        <button onClick={() => setAuthModal(null)} style={{
          position: 'absolute', top: 14, right: 16,
          background: 'none', border: 'none', color: 'var(--txt3)',
          fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1,
        }}>×</button>

        {/* Header */}
        <div style={{
          fontFamily: 'var(--ff-h)', fontSize: '1.5rem', fontWeight: 700,
          marginBottom: '.3rem',
          background: 'linear-gradient(135deg, var(--saffron), var(--cyan))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>{isLogin ? 'Welcome Back' : 'Create Account'}</div>
        <p style={{ color: 'var(--txt3)', fontSize: '.82rem', marginBottom: '1.5rem' }}>
          {isLogin ? 'Sign in to access your training progress' : 'Join PRISM to start your skill journey'}
        </p>

        {/* Google */}
        <button onClick={handleGoogle} disabled={loading} style={{
          width: '100%', padding: '.7rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem',
          color: 'var(--txt1)', fontFamily: 'var(--ff-b)', fontSize: '.88rem',
          transition: 'all .2s',
          marginBottom: '1.2rem',
          opacity: loading ? 0.5 : 1,
        }}
          onMouseEnter={e => { if (!loading) e.target.style.borderColor = 'var(--cyan)'; }}
          onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          <span style={{ fontSize: '.7rem', color: 'var(--txt3)', fontFamily: 'var(--ff-m)', letterSpacing: '.08em' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
          {!isLogin && (
            <input
              type="text" placeholder="Full Name" value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
              required
            />
          )}
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password" placeholder="Password" value={pass}
            onChange={e => setPass(e.target.value)}
            style={inputStyle}
            required minLength={6}
          />

          {error && (
            <div style={{
              background: 'rgba(255,23,68,0.08)', border: '1px solid rgba(255,23,68,0.25)',
              borderRadius: 6, padding: '.5rem .7rem',
              fontSize: '.78rem', color: 'var(--red)',
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '.75rem',
            background: 'linear-gradient(135deg, var(--saffron) 0%, var(--gold) 100%)',
            color: 'var(--bg-deep)', border: 'none', borderRadius: 8,
            fontFamily: 'var(--ff-h)', fontWeight: 700, fontSize: '1rem',
            letterSpacing: '.1em', cursor: 'pointer',
            transition: 'filter .2s, transform .15s',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 0 20px rgba(255,153,51,0.25)',
          }}
            onMouseEnter={e => { if (!loading) e.target.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
          >
            {loading ? '...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle */}
        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '.82rem', color: 'var(--txt3)' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggle} style={{
            background: 'none', border: 'none', color: 'var(--cyan)',
            cursor: 'pointer', fontFamily: 'var(--ff-b)', fontSize: '.82rem',
            textDecoration: 'underline', textUnderlineOffset: 2,
          }}>{isLogin ? 'Sign Up' : 'Sign In'}</button>
        </p>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(18px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  padding: '.65rem .85rem',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--txt1)',
  fontFamily: 'var(--ff-b)',
  fontSize: '.88rem',
  outline: 'none',
  transition: 'border-color .2s',
};
