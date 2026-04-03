// src/components/Toast.jsx
// Stacking toast notification system with dismiss and slide-in animation.
// Keeps up to 3 toasts visible at once, auto-dismisses after 3.5s.

import { useState, useEffect, useCallback, useRef } from 'react';
import useStore from '../store/useStore';

const TYPE_STYLES = {
  ok:   { border: 'var(--green)', color: 'var(--green)', icon: '✅' },
  warn: { border: 'var(--amber)', color: 'var(--amber)', icon: '⚠️' },
  err:  { border: 'var(--red)',   color: 'var(--red)',   icon: '❌' },
};

const MAX_VISIBLE = 3;

export default function Toast() {
  const { toast, clearToast } = useStore();
  const [stack, setStack] = useState([]);
  const stackRef = useRef(stack);
  stackRef.current = stack;

  // Push incoming toasts onto the local stack
  useEffect(() => {
    if (!toast) return;
    const item = { ...toast, ts: Date.now() };
    setStack(prev => {
      const next = [item, ...prev].slice(0, MAX_VISIBLE + 1);
      return next;
    });
    // clear store so the same toast.id doesn't re-trigger
    clearToast();
  }, [toast?.id]);

  // Auto-dismiss timer for each toast
  useEffect(() => {
    if (stack.length === 0) return;
    const oldest = stack[stack.length - 1];
    const age = Date.now() - oldest.ts;
    const remaining = Math.max(100, 3500 - age);
    const t = setTimeout(() => {
      setStack(prev => prev.slice(0, -1));
    }, remaining);
    return () => clearTimeout(t);
  }, [stack]);

  const dismiss = useCallback((id) => {
    setStack(prev => prev.filter(t => t.id !== id));
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  if (stack.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: isMobile ? 8 : 18,
      right: isMobile ? 8 : 18,
      zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '.5rem',
      maxWidth: isMobile ? 'calc(100vw - 16px)' : 380,
      pointerEvents: 'none',
    }}>
      {stack.slice(0, MAX_VISIBLE).map((item, i) => {
        const style = TYPE_STYLES[item.type] || TYPE_STYLES.ok;
        return (
          <div
            key={item.id}
            style={{
              background: 'rgba(11,25,40,0.96)',
              border: `1px solid ${style.border}`,
              color: style.color,
              padding: '.55rem .9rem',
              paddingRight: '2rem',
              borderRadius: 4,
              fontSize: isMobile ? '.72rem' : '.8rem',
              fontFamily: 'var(--ff-m)',
              boxShadow: '0 4px 24px rgba(0,0,0,.5)',
              pointerEvents: 'all',
              animation: 'toastIn .28s ease forwards',
              opacity: i === MAX_VISIBLE - 1 && stack.length > MAX_VISIBLE ? 0.5 : 1,
              position: 'relative',
              maxWidth: '100%',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              lineHeight: 1.5,
              display: 'flex', alignItems: 'flex-start', gap: '.5rem',
            }}
          >
            <span style={{ flexShrink: 0, fontSize: '.85rem' }}>{style.icon}</span>
            <span style={{ flex: 1 }}>{item.msg}</span>

            {/* Dismiss button */}
            <button
              onClick={() => dismiss(item.id)}
              style={{
                position: 'absolute', top: 4, right: 6,
                background: 'none', border: 'none',
                color: 'var(--txt3)', cursor: 'pointer',
                fontSize: '.85rem', lineHeight: 1, padding: 2,
                transition: 'color .15s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--txt1)'}
              onMouseLeave={e => e.target.style.color = 'var(--txt3)'}
            >×</button>
          </div>
        );
      })}

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}