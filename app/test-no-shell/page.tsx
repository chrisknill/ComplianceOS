'use client';

import React, { useEffect, useState } from 'react';

export default function TestNoShellPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('TestNoShellPage mounted');
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-8">
        <p>Loading no-shell test...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">No Shell Test</h1>
      <p>Client-side JavaScript is working without Shell!</p>
      
      <div className="mt-4">
        <button 
          onClick={() => console.log('Button clicked')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test Button
        </button>
      </div>
    </div>
  );
}
