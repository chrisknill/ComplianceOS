'use client';

import React, { useEffect, useState } from 'react';

interface SimpleNode {
  id: string;
  title: string;
  type: string;
  status: string;
  position: { x: number; y: number };
}

interface SimpleEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export default function ManagementSystemMapSimplePage() {
  const [nodes, setNodes] = useState<SimpleNode[]>([]);
  const [edges, setEdges] = useState<SimpleEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching simple map data...');
        const response = await fetch('/data/management-map-simple.json');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          console.log('Set nodes:', data.nodes.length, 'edges:', data.edges.length);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Management System Map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Map</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Management System Map - Simple View</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">Loaded {nodes.length} nodes and {edges.length} connections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nodes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Processes & Documents</h2>
          <div className="space-y-3">
            {nodes.map(node => (
              <div key={node.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{node.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{node.type}</p>
                    <p className="text-xs text-gray-400 mt-1">ID: {node.id}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    node.status === 'green' ? 'bg-green-100 text-green-800' :
                    node.status === 'amber' ? 'bg-yellow-100 text-yellow-800' :
                    node.status === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edges */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Process Connections</h2>
          <div className="space-y-3">
            {edges.map(edge => (
              <div key={edge.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{edge.label}</p>
                    <p className="text-xs text-gray-500">
                      {edge.source} → {edge.target}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
