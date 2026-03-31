// src/components/HUD/StepDots.jsx
export default function StepDots({ total, current }) {
  return (
    <div style={{
      position: 'absolute', top: 14, left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', gap: '.4rem', alignItems: 'center',
      background: 'rgba(7,18,36,0.88)',
      border: '1px solid var(--border)',
      padding: '.5rem .9rem', borderRadius: 20,
      backdropFilter: 'blur(8px)',
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const now  = i === current;
        return (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: done ? 'var(--green)' : now ? 'var(--saffron)' : 'var(--txt3)',
            transform: now ? 'scale(1.45)' : 'scale(1)',
            boxShadow: now ? '0 0 7px var(--saffron)' : 'none',
            transition: 'all .3s',
          }}/>
        );
      })}
    </div>
  );
}