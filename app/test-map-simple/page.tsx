'use client';

import React, { useEffect, useState } from 'react';

interface SimpleNode {
  id: string;
  title: string;
  type: string;
  position: { x: number; y: number };
}

interface SimpleEdge {
  id: string;
  source: string;
  target: string;
}

export default function TestMapSimplePage() {
  const [nodes, setNodes] = useState<SimpleNode[]>([]);
  const [edges, setEdges] = useState<SimpleEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching data...');
        const response = await fetch('/data/management-map.json');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        
        if (data.nodes && data.edges) {
          // Transform to simple format
          const simpleNodes: SimpleNode[] = data.nodes.slice(0, 5).map((node: any) => ({
            id: node.id,
            title: node.title,
            type: node.type,
            position: node.position || { x: Math.random() * 400, y: Math.random() * 400 }
          }));
          
          const simpleEdges: SimpleEdge[] = data.edges.slice(0, 3).map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target
          }));
          
          setNodes(simpleNodes);
          setEdges(simpleEdges);
          console.log('Set nodes:', simpleNodes.length, 'edges:', simpleEdges.length);
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
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading test data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Map Test</h1>
      <p className="mb-4">Loaded {nodes.length} nodes and {edges.length} edges</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Nodes:</h3>
          <ul className="space-y-1">
            {nodes.map(node => (
              <li key={node.id} className="text-sm p-2 bg-gray-100 rounded">
                {node.title} ({node.type})
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Edges:</h3>
          <ul className="space-y-1">
            {edges.map(edge => (
              <li key={edge.id} className="text-sm p-2 bg-gray-100 rounded">
                {edge.source} → {edge.target}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
