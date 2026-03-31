// src/services/bhashini.js
// Wrapper for the Bhashini Dhruva TTS pipeline.
// Falls back to the browser Web Speech API when:
//   - language is 'en' (Bhashini is optimised for Indic)
//   - API key is missing / request fails

const ENDPOINT = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
const API_KEY  = import.meta.env.VITE_BHASHINI_API_KEY || '';

// Map language codes → Bhashini service IDs
const SERVICE_IDS = {
  hi: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
  ta: 'ai4bharat/indic-tts-coqui-dravidian-gpu--t4',
  bn: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
  te: 'ai4bharat/indic-tts-coqui-dravidian-gpu--t4',
  mr: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
};

// Map language codes → BCP-47 tags for Web Speech
const WEB_SPEECH_LOCALES = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  mr: 'mr-IN',
};

// ── Bhashini Dhruva TTS ─────────────────────────────────────────────────────
export async function bhashiniTTS(text, lang) {
  if (!API_KEY || API_KEY === 'your_bhashini_api_key_here') {
    console.warn('[Bhashini] No API key — skipping to Web Speech');
    return false;
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  API_KEY,
      },
      body: JSON.stringify({
        pipelineTasks: [{
          taskType: 'tts',
          config: {
            language:  { sourceLanguage: lang },
            serviceId: SERVICE_IDS[lang],
            gender:    'female',
            samplingRate: 8000,
          },
        }],
        inputData: { input: [{ source: text }] },
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const b64  = data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;

    if (b64) {
      const audio = new Audio(`data:audio/wav;base64,${b64}`);
      await audio.play();
      return true;
    }
    throw new Error('No audio content in response');
  } catch (err) {
    console.warn('[Bhashini] TTS failed, falling back:', err.message);
    return false;
  }
}

// ── Web Speech API fallback ──────────────────────────────────────────────────
export function webSpeechTTS(text, lang, { onEnd } = {}) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();

  const u    = new SpeechSynthesisUtterance(text);
  u.lang     = WEB_SPEECH_LOCALES[lang] || 'en-IN';
  u.rate     = 0.88;
  u.pitch    = 1.05;
  u.onend    = onEnd;
  u.onerror  = onEnd;

  speechSynthesis.speak(u);
}

// ── Combined speak: Bhashini → Web Speech fallback ───────────────────────────
export async function speak(text, lang, callbacks = {}) {
  const { onStart, onEnd } = callbacks;
  onStart?.();

  if (lang !== 'en') {
    const ok = await bhashiniTTS(text, lang);
    if (ok) { setTimeout(() => onEnd?.(), 9000); return; }
  }

  webSpeechTTS(text, lang, { onEnd: onEnd || (() => {}) });
  if (!window.speechSynthesis) setTimeout(() => onEnd?.(), 9000);
}

export function cancelSpeech() {
  window.speechSynthesis?.cancel();
}