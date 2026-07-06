import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  return (
    <main className="app">
      <canvas className="water" />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
