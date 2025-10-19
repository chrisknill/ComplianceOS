import React, { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useManagementMapStore } from '@/lib/stores/management-map-store';
import NodeCard from './NodeCard';
import { FlowNode, FlowEdge } from '@/types/management-map';

const nodeTypes = {
  custom: NodeCard,
};

interface GraphContainerProps {
  onNodeSelect: (nodeId: string) => void;
  onExport: (format: 'png' | 'svg' | 'pdf') => void;
}

function GraphContainerInner({ onNodeSelect, onExport }: GraphContainerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes: storeNodes,
    edges: storeEdges,
    selectedNodeId,
    getFilteredNodes,
    getFilteredEdges,
    setSelectedNodeId,
    setInspectorOpen,
    setBreadcrumbs,
    setHighlightedPath,
    highlightedPath,
  } = useManagementMapStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when store changes
  useEffect(() => {
    const filteredNodes = getFilteredNodes();
    const filteredEdges = getFilteredEdges();
    
    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [storeNodes, storeEdges, getFilteredNodes, getFilteredEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      setInspectorOpen(true);
      onNodeSelect(node.id);
      
      // Generate breadcrumbs
      const nodeData = storeNodes.find(n => n.id === node.id);
      if (nodeData) {
        const breadcrumbs = [nodeData.title];
        setBreadcrumbs(breadcrumbs);
      }
      
      // Highlight critical path
      const path = storeNodes
        .filter(n => highlightedPath.includes(n.id))
        .map(n => n.id);
      setHighlightedPath(path);
    },
    [setSelectedNodeId, setInspectorOpen, onNodeSelect, storeNodes, setBreadcrumbs, highlightedPath, setHighlightedPath]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setInspectorOpen(false);
    setBreadcrumbs([]);
    setHighlightedPath([]);
  }, [setSelectedNodeId, setInspectorOpen, setBreadcrumbs, setHighlightedPath]);

  const onNodesDragStop = useCallback((event: any, node: Node) => {
    // Save position to localStorage
    const positions = JSON.parse(localStorage.getItem('node-positions') || '{}');
    positions[node.id] = { x: node.position.x, y: node.position.y };
    localStorage.setItem('node-positions', JSON.stringify(positions));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedNodeId(null);
        setInspectorOpen(false);
        setBreadcrumbs([]);
        setHighlightedPath([]);
      }
      
      if (event.key === 'f' || event.key === 'F') {
        // Fit view
        const wrapper = reactFlowWrapper.current;
        if (wrapper) {
          // This would need to be implemented with a ref to ReactFlow instance
          console.log('Fit view requested');
        }
      }
      
      if (event.key === 'h' || event.key === 'H') {
        // Toggle highlight path
        if (selectedNodeId) {
          const currentPath = highlightedPath.length > 0 ? [] : [selectedNodeId];
          setHighlightedPath(currentPath);
        }
      }
      
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        // Focus search - this would need to be implemented with a ref to search input
        console.log('Focus search requested');
        event.preventDefault();
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        onExport('pdf');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, highlightedPath, setSelectedNodeId, setInspectorOpen, setBreadcrumbs, setHighlightedPath, onExport]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesDragStop={onNodesDragStop}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'input') return '#0041d0';
            if (n.type === 'output') return '#ff0072';
            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.type === 'input') return '#0041d0';
            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        
        {/* Breadcrumbs Panel */}
        <Panel position="top-left" className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-3">
          <div className="text-sm text-gray-600">
            {selectedNodeId ? (
              <div>
                <span className="font-medium">Selected:</span>{' '}
                {nodes.find(n => n.id === selectedNodeId)?.data?.label || 'Unknown'}
              </div>
            ) : (
              <div>Click a node to view details</div>
            )}
          </div>
        </Panel>

        {/* Stats Panel */}
        <Panel position="bottom-left" className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-3">
          <div className="text-sm text-gray-600">
            <div>Nodes: {nodes.length}</div>
            <div>Connections: {edges.length}</div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function GraphContainer(props: GraphContainerProps) {
  return (
    <ReactFlowProvider>
      <GraphContainerInner {...props} />
    </ReactFlowProvider>
  );
}
