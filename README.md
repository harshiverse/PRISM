# PRISM — Precision Interactive Skill Mastery

> Zero-install WebXR vocational training with real-time multilingual AI coaching via the Bhashini API — built for India's next-generation workforce.

---

## Why This Matters

Traditional vocational training faces three bottlenecks:

- **Cost** — physical labs and equipment are expensive to build and maintain
- **Risk** — trainees cannot safely practise on high-voltage or medical equipment
- **Language** — documentation and instruction is overwhelmingly English-centric

PRISM solves all three:

| Problem | Solution |
|---|---|
| Cost | Web-First XR via A-Frame — zero install, runs on any smartphone browser |
| Risk | Immersive 3D simulation with spatial precision scoring and safety violation detection |
| Language | Real-time audio instruction via Bhashini Dhruva TTS API (22+ Indian languages) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite |
| 3D / WebXR | A-Frame 1.5 |
| Global state | Zustand |
| Backend / persistence | Firebase (Firestore + Hosting) |
| Multilingual TTS | Bhashini Dhruva API → Web Speech API fallback |
| Charts | Chart.js 4 + react-chartjs-2 |
| Fonts | Rajdhani · IBM Plex Sans · Space Mono |

---

## Getting Started

### Prerequisites

- Node.js v18.x or higher
- A Firebase project ([console.firebase.google.com](https://console.firebase.google.com))
- A Bhashini API key ([bhashini.gov.in/ulca](https://bhashini.gov.in/ulca/model/api-integration))
- Chrome, Firefox, or Edge (iOS: Safari with WebXR flags enabled)

### Installation

```bash
# 1. Clone
git clone https://github.com/harshiverse/PRISM.git
cd prism

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Then edit .env and fill in your keys (see Environment Setup below)

# 4. Start dev server
npm run dev
# → http://localhost:5173
```

### Environment Setup

Create `.env` in the project root (copy from `.env.example`):

```env
# Bhashini Dhruva API
VITE_BHASHINI_API_KEY=your_key_here
VITE_BHASHINI_USER_ID=your_user_id_here

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note:** If Bhashini keys are missing, the platform automatically falls back to the browser's Web Speech API. If Firebase keys are missing, the session still runs — Firestore persistence is silently skipped and a warning is logged to the console.

---

## Project Structure

```
prism/
├── index.html                   # Vite entry
├── firebase.json                # Firebase Hosting + Firestore config
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Composite query indexes
├── .env.example                 # Environment variable template
└── src/
    ├── main.jsx                 # App entry — imports A-Frame before React
    ├── App.jsx                  # Screen router (Zustand-driven)
    ├── firebase.js              # Firebase init (db, auth, analytics)
    ├── screens/
    │   ├── Landing.jsx          # Language selector + CTA
    │   ├── ModuleSelect.jsx     # Module grid (live / coming-soon)
    │   ├── VRTraining.jsx       # A-Frame scene + full HUD
    │   └── Dashboard.jsx        # Results, badges, Firestore history
    ├── components/
    │   ├── HUD/
    │   │   ├── MetricPanel.jsx  # Safety / Precision / Speed bars + timer
    │   │   ├── StepPanel.jsx    # Step instruction + Speak + Proceed
    │   │   ├── StepDots.jsx     # Progress dots
    │   │   └── LanguagePanel.jsx# In-VR language switcher
    │   ├── ScoreRing.jsx        # Circular score display
    │   └── Toast.jsx            # Global notification
    ├── hooks/
    │   ├── useSkillMetric.js    # Precision Score engine (see below)
    │   ├── useTimer.js          # Elapsed timer with speed decay
    │   └── useTrainingSession.js# Session orchestrator (Firebase + metrics)
    ├── services/
    │   ├── bhashini.js          # Bhashini TTS + Web Speech fallback
    │   └── firestore.js         # createSession / finalizeSession / logViolation
    ├── data/
    │   ├── modules.js           # Module registry
    │   └── steps/
    │       └── healthcare.js    # CPR step definitions + 3D target coordinates
    ├── store/
    │   └── useStore.js          # Zustand global store
    └── styles/
        └── globals.css          # CSS variables + shared styles
```

---

## Core Logic: The Skill-Metric Engine

The platform doesn't just track step completion — it calculates a **Precision Score (P)** based on the spatial accuracy of each interaction in the 3D scene.

### Formula

```
d = Euclidean distance between cursor world-position and step's targetCoords
r = Average angular difference between camera rotation and step's targetRot

P = clamp(100 − (d × 18) − (r × 0.4), 0, 100)
```

Each step in `src/data/steps/healthcare.js` defines:

```js
{
  targetCoords: { x: 0, y: 0.31, z: -3.08 },  // expected 3D interaction point
  targetRot:    { x: 0, y: 0,    z: 0 },       // expected camera facing
  threshold:    65,                              // minimum P before violation
  highRisk:     true,                            // whether violation pauses sim
}
```

### Safety Violation Flow

If `P < threshold` on a `highRisk` step:

1. Simulation **pauses** — a red overlay appears
2. The violation is logged to Firestore via `logViolation()`
3. Audio feedback plays in the user's selected language
4. User must click **Resume Training** to continue

This is implemented in `src/hooks/useSkillMetric.js`.

---

## Firebase Data Model

### Collection: `sessions`

```
sessions/{sessionId}
├── userId:      string          // 'anonymous' until auth is added
├── moduleId:    string          // 'healthcare-cpr'
├── language:    string          // 'hi', 'ta', etc.
├── startedAt:   Timestamp
├── finishedAt:  Timestamp | null
├── elapsedSec:  number
├── scores:      number[]        // per-step scores (0–100)
├── finalScore:  number
├── metrics:     { safety, precision, speed }
└── violations:  { step, type, precision, threshold, ts }[]
```

### Firestore Services (`src/services/firestore.js`)

| Function | Description |
|---|---|
| `createSession(opts)` | Creates a session document when training starts |
| `finalizeSession(id, payload)` | Writes final scores + metrics on completion |
| `logViolation(id, violation)` | Appends a safety violation to the session |
| `getRecentSessions(n)` | Fetches the N most recent sessions (used on Dashboard) |

---

## Bhashini TTS Integration

`src/services/bhashini.js` provides a two-tier TTS system:

```
speak(text, lang)
  └─ lang !== 'en'?
       └─ bhashiniTTS() ──→ success → play audio
                        └─ fail    → webSpeechTTS() (fallback)
       └─ lang === 'en' → webSpeechTTS() directly
```

Supported languages and their Bhashini service IDs:

| Code | Language | Service |
|---|---|---|
| `hi` | Hindi | `indic-tts-coqui-indo_aryan-gpu--t4` |
| `ta` | Tamil | `indic-tts-coqui-dravidian-gpu--t4` |
| `bn` | Bengali | `indic-tts-coqui-indo_aryan-gpu--t4` |
| `te` | Telugu | `indic-tts-coqui-dravidian-gpu--t4` |
| `mr` | Marathi | `indic-tts-coqui-indo_aryan-gpu--t4` |

---

## Deployment

```bash
# Build
npm run build

# Deploy to Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init   # choose Hosting + Firestore, set public dir to 'dist'
firebase deploy
```

The `firebase.json` includes COOP/COEP headers required for SharedArrayBuffer (needed by some WebXR runtimes).

---

## Supported Modules

| Module | Status | Steps |
|---|---|---|
| Healthcare & First Aid (CPR) | ✅ Live | 9 |
| Renewable Energy | 🔒 Coming Soon | — |
| Advanced Manufacturing | 🔒 Coming Soon | — |
| Construction & Safety | 🔒 Coming Soon | — |

---

## Roadmap

- [ ] Firebase Authentication (Google Sign-In + anonymous upgrade)
- [ ] User profile page with session history
- [ ] Leaderboard (top scores per module)
- [ ] Renewable Energy module (solar panel installation)
- [ ] WebXR controller mapping for VR headsets
- [ ] Offline-first PWA support
- [ ] NITI Aayog / NSDC skill-badge export (PDF certificate)

---

## Contributing

We welcome contributions to expand the module library.

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feature/ev-repair-module

# 3. Add your step data file
# src/data/steps/ev-repair.js
# (follow the healthcare.js schema — include targetCoords and thresholds)

# 4. Register the module
# src/data/modules.js → add entry with status: 'beta'

# 5. Commit and PR
git commit -m 'Add EV Repair module with 7 steps'
git push origin feature/ev-repair-module
```

**Step data schema** (`src/data/steps/yourmodule.js`):

```js
export const YOUR_STEPS = [
  {
    id:           'step-id',
    title:        'Step Title',
    en:           'English instruction text.',
    hint:         'What to do hint',
    hotspot:      'object-type',        // matches data-hotspot in A-Frame scene
    targetCoords: { x: 0, y: 1, z: -3 },
    targetRot:    { x: 0, y: 0, z: 0 },
    threshold:    65,                   // minimum precision (0–100)
    highRisk:     true,                 // pauses sim on violation
    multiClick:   null,                 // or number for repeated-action steps
    translations: {
      hi: '…', ta: '…', bn: '…', te: '…', mr: '…',
    },
  },
  // …
];
```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.