'use client';

import React from 'react';

export default function TestReactFlowPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    console.log('React Flow test page mounted');
  }, []);

  if (!mounted) {
    return (
      <div className="p-8">
        <p>Loading React Flow test...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">React Flow Test</h1>
      <p>If you can see this, client-side JavaScript is working!</p>
      <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
        <p className="text-green-800">✅ Client-side rendering successful</p>
      </div>
    </div>
  );
}
