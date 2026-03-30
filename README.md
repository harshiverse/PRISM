## PRISM: Precision Interactive Skill Mastery
PRISM is a WebXR-based vocational training platform that enables immersive, hands-on learning via standard mobile browsers. It eliminates the need for high-end VR hardware and heavy native applications, providing a low-latency, 3D environment for technical skill acquisition in regional Indian languages.


## 🏗 Why This Matters
### Traditional vocational training faces three bottlenecks:
Cost (physical labs), Risk (handling high-voltage/dangerous equipment), and Language (English-centric documentation).
### PRISM solves this by:
Web-First XR: Zero-install deployment via A-Frame; accessible on any smartphone with a browser.

Localized AI: Real-time audio instruction streaming via the Bhashini API.

State-Driven Metrics: A specialized logic engine that tracks user precision and safety violations during the 3D simulation.


## 🛠 Tech Stack
<img width="819" height="544" alt="image" src="https://github.com/user-attachments/assets/80d2a6e2-e075-435c-bd06-1106bdeadca9" />


## 🚦 Getting Started

### Prerequisites
Node.js: v18.x or higher

API Keys: Bhashini API (for voice) and Supabase (for data persistence).

Browser: Chrome or Firefox (iOS requires Safari with WebXR flags enabled).

### Installation
#### Clone the repository:
git clone https://github.com/harshiverse/PRISM.git

cd prism


#### Install dependencies:
npm install


#### Environment Setup:
Create a .env file in the root directory:

VITE_BHASHINI_API_KEY=your_key_here

VITE_SUPABASE_URL=your_url

VITE_SUPABASE_ANON_KEY=your_key


### Run Development Server:
npm run dev

Access the application at http://localhost:5173.

## 🧩 Project Structure
<img width="609" height="210" alt="image" src="https://github.com/user-attachments/assets/1b3e79f4-c46c-4b9e-9fc4-d8e8123a7653" />


## ⚙️ Core Logic: 
The Skill-Metric EngineThe platform doesn't just track completion; it calculates a Precision Score (P) based on the distance (d) and rotation (r) of the 3D entity relative to its correct target coordinates:

<img width="321" height="93" alt="image" src="https://github.com/user-attachments/assets/b09bf3e9-6de9-4968-abf8-41e4e3509e80" />

If P falls below a threshold during high-risk steps (e.g., battery contact), the state engine triggers a "Safety Violation" event, pausing the simulation and providing audio feedback in the user's selected language.

## 🤝 Contributing
We welcome contributions to expand the module library (Solar, EV, Plumbing, etc.).

Fork the Project.

Create your Feature Branch (git checkout -b feature/NewModule).

Commit your Changes (git commit -m 'Add EV-Repair module').

Push to the Branch (git push origin feature/NewModule).

Open a Pull Request.


## 📜 License
Distributed under the MIT License. See LICENSE for more information.
