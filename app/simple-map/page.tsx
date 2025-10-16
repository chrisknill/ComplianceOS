'use client';

import { useState, useEffect } from 'react';

export default function SimpleMapPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple data loading without async/await
    fetch('/data/management-map.json')
      .then(response => response.json())
      .then(result => {
        console.log('Data loaded:', result);
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Simple Map Test</h1>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Map Test</h1>
      <div className="space-y-4">
        <p><strong>Metadata:</strong> {data?.metadata?.name}</p>
        <p><strong>Nodes:</strong> {data?.nodes?.length || 0}</p>
        <p><strong>Edges:</strong> {data?.edges?.length || 0}</p>
        
        {data?.nodes && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {data.nodes.slice(0, 6).map((node: any) => (
              <div key={node.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="font-semibold text-sm mb-2">{node.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{node.type}</p>
                <p className="text-xs text-gray-500">{node.description}</p>
                <div className="mt-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    node.status === 'green' ? 'bg-green-500' : 
                    node.status === 'amber' ? 'bg-yellow-500' : 
                    node.status === 'red' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></span>
                  <span className="ml-2 text-xs text-gray-600">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
