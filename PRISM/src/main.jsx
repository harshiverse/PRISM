// src/main.jsx
// A-Frame is loaded via <script> in index.html before this module runs,
// so custom elements are already registered when React mounts.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode causes double-invocation of effects in dev — disable it here
  // because A-Frame's scene setup is not idempotent.
  <App />
);