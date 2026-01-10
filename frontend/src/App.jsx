import { useState, useEffect } from 'react';
import ExtensionBlocker from './components/ExtensionBlocker';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ExtensionBlocker />
      </div>
    </div>
  );
}

export default App;

