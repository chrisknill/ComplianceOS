'use client';

import { useState, useEffect } from 'react';

export default function TestMapPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching data...');
        const response = await fetch('/data/management-map.json');
        console.log('Response:', response);
        const result = await response.json();
        console.log('Data loaded:', result);
        setData(result);
      } catch (err) {
        console.error('Error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading test data...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Map Data</h1>
      <div className="space-y-4">
        <p><strong>Metadata:</strong> {data?.metadata?.name}</p>
        <p><strong>Nodes:</strong> {data?.nodes?.length || 0}</p>
        <p><strong>Edges:</strong> {data?.edges?.length || 0}</p>
        <div className="max-h-96 overflow-y-auto">
          <pre className="bg-gray-100 p-4 rounded text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
