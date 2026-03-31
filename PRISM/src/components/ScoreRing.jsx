// src/components/ScoreRing.jsx
export default function ScoreRing({ score }) {
  const color = score >= 90 ? 'var(--green)' : score >= 75 ? 'var(--saffron)' : 'var(--red)';
  return (
    <div style={{
      width: 96, height: 96, borderRadius: '50%',
      border: `2.5px solid ${color}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-card)',
      boxShadow: `0 0 24px ${color}55`,
      flexShrink: 0,
    }}>
      <div style={{
        fontFamily: 'var(--ff-h)', fontSize: '1.9rem',
        fontWeight: 700, color, lineHeight: 1,
      }}>{score}</div>
      <div style={{ fontSize: '.6rem', color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        Skill Score
      </div>
    </div>
  );
}