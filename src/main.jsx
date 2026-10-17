import React from 'react';
import { createRoot } from 'react-dom/client';
import '../public/brand/tokens.css';
import './styles/app.css';
import './styles/screens.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
