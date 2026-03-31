// src/components/Toast.jsx
import { useEffect } from 'react';
import useStore from '../store/useStore';

const COLORS = {
  ok:   { border: 'var(--green)', color: 'var(--green)' },
  warn: { border: 'var(--amber)', color: 'var(--amber)' },
  err:  { border: 'var(--red)',   color: 'var(--red)'   },
};

export default function Toast() {
  const { toast, clearToast } = useStore();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast?.id]);

  if (!toast) return null;

  const { border, color } = COLORS[toast.type] || COLORS.ok;

  return (
    <div style={{
      position: 'fixed', top: 18, right: 18, zIndex: 9999,
      background: 'var(--bg-surface)',
      border: `1px solid ${border}`,
      color, padding: '.65rem 1.1rem',
      borderRadius: 3, fontSize: '.8rem',
      fontFamily: 'var(--ff-m)',
      animation: 'fadeUp .28s ease',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 24px rgba(0,0,0,.4)',
    }}>
      {toast.msg}
    </div>
  );
}