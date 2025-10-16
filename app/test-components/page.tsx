'use client';

import React, { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';

export default function TestComponentsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('TestComponentsPage mounted');
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Shell>
        <div className="p-8">
          <p>Loading component test...</p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Component Test</h1>
        <p>Shell component is working!</p>
        
        <div className="mt-4">
          <button 
            onClick={() => console.log('Button clicked')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Button
          </button>
        </div>
      </div>
    </Shell>
  );
}
