'use client';

import React, { useEffect, useState } from 'react';

export default function TestSimplePage() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Initial message');

  useEffect(() => {
    console.log('TestSimplePage useEffect triggered');
    setMessage('Client-side JavaScript is working!');
  }, []);

  const handleClick = () => {
    setCount(prev => prev + 1);
    setMessage(`Button clicked ${count + 1} times`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <p className="mb-4">Message: {message}</p>
      <p className="mb-4">Count: {count}</p>
      <button 
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Click me
      </button>
    </div>
  );
}
