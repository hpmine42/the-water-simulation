import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import WaterCanvas from './water/WaterCanvas';

function App() {
  return (
    <main className="app">
      <WaterCanvas />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
