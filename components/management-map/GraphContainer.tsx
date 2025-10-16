import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  BackgroundVariant,
} from 'reactflow';
// import 'reactflow/dist/style.css';
import { NodeCard } from './NodeCard';
import { useManagementMapStore } from '@/lib/stores/management-map-store';
import { transformMapDataToFlow } from '@/lib/utils/management-map';
import { MapNode, MapEdge } from '@/types/management-map';

const nodeTypes = {
  customNode: NodeCard,
};

interface GraphContainerProps {
  onNodeClick: (nodeId: string) => void;
  selectedNodeId?: string;
}

export function GraphContainer({ onNodeClick, selectedNodeId }: GraphContainerProps) {
  const { 
    nodes: mapNodes, 
    edges: mapEdges, 
    searchQuery,
    filters,
    nodePositions,
    layoutMode,
    showDependencies,
    showNonCritical,
    showExternal,
    highlightPath,
    updateNodePosition,
  } = useManagementMapStore();

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    let filtered = mapNodes;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(node => 
        node.title.toLowerCase().includes(query) ||
        node.code?.toLowerCase().includes(query) ||
        node.description?.toLowerCase().includes(query) ||
        node.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        node.isoClauses?.some(clause => clause.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(node => filters.type.includes(node.type));
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(node => filters.status.includes(node.status || 'draft'));
    }

    // Owner filter
    if (filters.owner.length > 0) {
      filtered = filtered.filter(node => node.owner && filters.owner.includes(node.owner));
    }

    // Location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter(node => 
        node.location?.some(loc => filters.location.includes(loc))
      );
    }

    // ISO Clause filter
    if (filters.isoClause.length > 0) {
      filtered = filtered.filter(node => 
        node.isoClauses?.some(clause => 
          filters.isoClause.some(filter => clause.toLowerCase().includes(filter.toLowerCase()))
        )
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(node => 
        node.tags?.some(tag => filters.tags.includes(tag))
      );
    }

    // Show external filter
    if (!showExternal) {
      filtered = filtered.filter(node => node.type !== 'externalStandard');
    }

    return filtered;
  }, [mapNodes, searchQuery, filters, showExternal]);

  // Filter edges based on filtered nodes and settings
  const filteredEdges = useMemo(() => {
    let filtered = mapEdges;

    // Only include edges between visible nodes
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    filtered = filtered.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    // Show dependencies filter
    if (!showDependencies) {
      filtered = filtered.filter(edge => edge.relationship === 'outputToInput');
    }

    // Show non-critical filter
    if (!showNonCritical) {
      filtered = filtered.filter(edge => edge.critical !== false);
    }

    return filtered;
  }, [mapEdges, filteredNodes, showDependencies, showNonCritical]);

  // Transform data to React Flow format
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodes = filteredNodes.map(node => ({
      id: node.id,
      type: 'customNode',
      data: node,
      position: nodePositions[node.id] || node.position || { x: 0, y: 0 },
      selected: node.id === selectedNodeId,
    }));

    const edges = filteredEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.critical,
      style: {
        stroke: edge.critical ? '#ef4444' : '#6b7280',
        strokeWidth: edge.critical ? 3 : 2,
      },
      labelStyle: {
        fontSize: '12px',
        fill: '#374151',
      },
    }));

    return { nodes, edges };
  }, [filteredNodes, filteredEdges, nodePositions, selectedNodeId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update nodes when filtered data changes
  useEffect(() => {
    console.log('Setting nodes:', flowNodes.length);
    setNodes(flowNodes);
  }, [flowNodes, setNodes]);

  // Update edges when filtered data changes
  useEffect(() => {
    console.log('Setting edges:', flowEdges.length);
    setEdges(flowEdges);
  }, [flowEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    onNodeClick(node.id);
  }, [onNodeClick]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.position) {
      updateNodePosition(node.id, node.position);
    }
  }, [updateNodePosition]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F key - fit view
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        // TODO: Implement fit view
      }
      
      // H key - toggle highlight path
      if (event.key === 'h' || event.key === 'H') {
        event.preventDefault();
        // TODO: Implement path highlighting
      }
      
      // / key - focus search
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        // TODO: Focus search input
      }
      
      // Escape key - clear selection
      if (event.key === 'Escape') {
        event.preventDefault();
        // TODO: Clear selection
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex-1">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Controls 
            position="top-right"
            showInteractive={false}
          />
          <MiniMap 
            position="bottom-left"
            nodeColor={(node) => {
              switch (node.data.type) {
                case 'policy': return '#3b82f6';
                case 'procedure': return '#10b981';
                case 'workInstruction': return '#8b5cf6';
                case 'sop': return '#6366f1';
                case 'riskAssessment': return '#f59e0b';
                case 'form': return '#ec4899';
                case 'record': return '#14b8a6';
                case 'training': return '#eab308';
                case 'externalStandard': return '#6b7280';
                default: return '#6b7280';
              }
            }}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={12} 
            size={1}
            color="#e5e7eb"
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}