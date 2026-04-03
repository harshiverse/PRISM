// src/components/HUD/StepDots.jsx
// Progress dots with optional mode badge prefix, displayed in a single top-center bar.
// This prevents the overlap between the mode badge and the dots.

export default function StepDots({ total, current, modeBadge = null }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  return (
    <div style={{
      position: 'absolute', top: isMobile ? 8 : 14, left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', gap: '.5rem', alignItems: 'center',
      background: 'rgba(7,18,36,0.88)',
      border: '1px solid var(--border)',
      padding: isMobile ? '.35rem .6rem' : '.45rem .9rem', borderRadius: 20,
      backdropFilter: 'blur(8px)',
      maxWidth: isMobile ? '85vw' : 'none',
      flexWrap: 'nowrap',
    }}>
      {/* Optional mode badge inline */}
      {modeBadge && (
        <>
          <span style={{
            fontFamily: 'var(--ff-m)',
            fontSize: isMobile ? '.52rem' : '.6rem',
            color: modeBadge.color || '#00c9a7',
            letterSpacing: '.08em',
            whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: '.3rem',
          }}>
            {modeBadge.icon && <span style={{ fontSize: '.75rem' }}>{modeBadge.icon}</span>}
            {modeBadge.label}
          </span>
          <div style={{
            width: 1, height: 14,
            background: 'var(--border)',
            flexShrink: 0,
          }}/>
        </>
      )}

      {/* Step dots */}
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const now  = i === current;
        return (
          <div key={i} style={{
            width: isMobile ? 5 : 7,
            height: isMobile ? 5 : 7,
            borderRadius: '50%',
            background: done ? 'var(--green)' : now ? 'var(--saffron)' : 'var(--txt3)',
            transform: now ? 'scale(1.45)' : 'scale(1)',
            boxShadow: now ? '0 0 7px var(--saffron)' : 'none',
            transition: 'all .3s',
            flexShrink: 0,
          }}/>
        );
      })}
    </div>
  );
}