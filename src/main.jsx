console.log("🚀 main.jsx file is loading...");

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

console.log("📦 Imports completed");
console.log("React starting...");

const rootElement = document.getElementById('root');
console.log("�� Root element found:", rootElement);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log("✅ React app rendered successfully");