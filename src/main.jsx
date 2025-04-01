import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import React from 'react';
import './syles/tailwind.css'
import App from './App.jsx'
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error('Root element with id "root" not found.');
}
