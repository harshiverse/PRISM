// src/main.jsx
// App entry — renders the React tree.
// StrictMode is now safe to use since we moved from A-Frame to R3F.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);