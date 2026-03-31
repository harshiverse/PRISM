// src/components/HUD/StepPanel.jsx
import { useState } from 'react';
import { cancelSpeech } from '../../services/bhashini';

export default function StepPanel({ step, total, stepData, lang, onSpeak, onNext }) {
  const [speaking, setSpeaking] = useState(false);

  if (!stepData) return null;

  const nativeLine = lang !== 'en' && stepData.translations?.[lang]
    ? stepData.translations[lang]
    : lang !== 'en' ? 'अनुवाद — Bhashini loading…' : null;

  const handleSpeak = () => {
    if (speaking) { cancelSpeech(); setSpeaking(false); return; }
    setSpeaking(true);
    onSpeak({ onEnd: () => setSpeaking(false) });
  };

  return (
    <div style={{
      position: 'absolute', bottom: 16, left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(7,18,36,0.94)',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(14px)',
      padding: '1.1rem 1.6rem',
      width: '92%', maxWidth: 640,
      borderRadius: 3, pointerEvents: 'all',
    }}>
      <div style={{
        fontFamily: 'var(--ff-m)', fontSize: '.65rem',
        color: 'var(--saffron)', letterSpacing: '.1em', marginBottom: '.25rem',
      }}>
        STEP {String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      <div style={{
        fontFamily: 'var(--ff-h)', fontSize: '1.35rem',
        fontWeight: 600, marginBottom: '.2rem',
      }}>
        {stepData.title}
      </div>

      <div style={{ fontSize: '.87rem', color: 'var(--txt2)', lineHeight: 1.55 }}>
        {stepData.en}
      </div>

      {nativeLine && (
        <div style={{
          fontSize: '.95rem', color: 'var(--amber)',
          marginTop: '.35rem', lineHeight: 1.55,
        }}>
          {nativeLine}
        </div>
      )}

      <div style={{ display: 'flex', gap: '.7rem', marginTop: '.9rem', alignItems: 'center' }}>
        <button
          onClick={handleSpeak}
          style={{
            display: 'flex', alignItems: 'center', gap: '.35rem',
            padding: '.42rem .9rem',
            background: speaking ? 'rgba(0,229,255,0.15)' : 'transparent',
            border: '1px solid var(--cyan)',
            color: 'var(--cyan)', fontFamily: 'var(--ff-b)', fontSize: '.78rem',
            cursor: 'pointer', borderRadius: 2, transition: 'all .2s',
            animation: speaking ? 'speakPulse 1s ease-in-out infinite' : 'none',
          }}>
          🔊 {speaking ? 'Speaking…' : 'Speak'}
        </button>

        <button
          onClick={onNext}
          style={{
            padding: '.42rem 1.4rem',
            background: 'var(--saffron)', color: 'var(--bg-deep)',
            border: 'none', fontFamily: 'var(--ff-h)',
            fontWeight: 600, fontSize: '.9rem',
            letterSpacing: '.1em', cursor: 'pointer',
            clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
            transition: 'background .2s',
          }}>
          PROCEED →
        </button>

        <span style={{
          marginLeft: 'auto', fontSize: '.72rem',
          color: 'var(--txt3)', fontFamily: 'var(--ff-m)',
        }}>
          {stepData.hint}
        </span>
      </div>

      <style>{`
        @keyframes speakPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,229,255,0.4); }
          50%      { box-shadow: 0 0 0 6px rgba(0,229,255,0); }
        }
      `}</style>
    </div>
  );
}