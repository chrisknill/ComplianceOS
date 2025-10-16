import { MapNode, MapEdge, ManagementMap, WizardResult, ChecklistItem } from '@/types/management-map';

export function transformMapDataToFlow(mapData: ManagementMap) {
  const nodes = mapData.nodes.map(node => ({
    id: node.id,
    type: 'customNode',
    data: node,
    position: node.position || { x: 0, y: 0 },
  }));

  const edges = mapData.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: edge.critical,
    style: {
      stroke: edge.critical ? '#ef4444' : '#6b7280',
      strokeWidth: edge.critical ? 3 : 2,
    },
  }));

  return { nodes, edges };
}

export function getNodeIcon(type: string): string {
  switch (type) {
    case 'policy': return '🛡️';
    case 'procedure': return '⚙️';
    case 'workInstruction': return '📋';
    case 'sop': return '✅';
    case 'riskAssessment': return '⚠️';
    case 'form': return '📄';
    case 'record': return '📁';
    case 'training': return '🎓';
    case 'externalStandard': return '🔗';
    default: return '📄';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'green': return 'bg-green-500 text-white';
    case 'amber': return 'bg-yellow-500 text-white';
    case 'red': return 'bg-red-500 text-white';
    case 'draft': return 'bg-gray-400 text-white';
    case 'archived': return 'bg-gray-600 text-white';
    default: return 'bg-gray-400 text-white';
  }
}

export function getTypeColor(type: string): string {
  switch (type) {
    case 'policy': return 'from-blue-50 to-blue-100 border-blue-200';
    case 'procedure': return 'from-green-50 to-green-100 border-green-200';
    case 'workInstruction': return 'from-purple-50 to-purple-100 border-purple-200';
    case 'sop': return 'from-indigo-50 to-indigo-100 border-indigo-200';
    case 'riskAssessment': return 'from-orange-50 to-orange-100 border-orange-200';
    case 'form': return 'from-pink-50 to-pink-100 border-pink-200';
    case 'record': return 'from-teal-50 to-teal-100 border-teal-200';
    case 'training': return 'from-yellow-50 to-yellow-100 border-yellow-200';
    case 'externalStandard': return 'from-gray-50 to-gray-100 border-gray-200';
    default: return 'from-gray-50 to-gray-100 border-gray-200';
  }
}

export function computeMinimalPath(
  nodes: MapNode[],
  edges: MapEdge[],
  roles: string[],
  activities: string[],
  locations: string[]
): WizardResult {
  // Type hierarchy for path computation
  const typeHierarchy = ['policy', 'procedure', 'workInstruction', 'sop', 'riskAssessment', 'form', 'record', 'training', 'externalStandard'];
  
  // Filter nodes based on criteria
  let relevantNodes = nodes.filter(node => {
    // Check role involvement
    const hasRole = roles.length === 0 || roles.some(role => 
      node.roles?.some(nodeRole => 
        nodeRole.toLowerCase().includes(role.toLowerCase())
      )
    );
    
    // Check activity relevance
    const hasActivity = activities.length === 0 || activities.some(activity =>
      node.tags?.some(tag => 
        tag.toLowerCase().includes(activity.toLowerCase())
      ) || node.title.toLowerCase().includes(activity.toLowerCase())
    );
    
    // Check location
    const hasLocation = locations.length === 0 || locations.some(location =>
      node.location?.some(nodeLocation => 
        nodeLocation.toLowerCase().includes(location.toLowerCase())
      )
    );
    
    return hasRole && hasActivity && hasLocation;
  });

  // Build dependency graph
  const graph = new Map<string, string[]>();
  const reverseGraph = new Map<string, string[]>();
  
  edges.forEach(edge => {
    if (!graph.has(edge.source)) graph.set(edge.source, []);
    if (!reverseGraph.has(edge.target)) reverseGraph.set(edge.target, []);
    
    graph.get(edge.source)!.push(edge.target);
    reverseGraph.get(edge.target)!.push(edge.source);
  });

  // Find starting points (nodes with no incoming critical edges)
  const startingNodes = relevantNodes.filter(node => {
    const incomingCritical = edges.filter(e => 
      e.target === node.id && e.critical
    );
    return incomingCritical.length === 0;
  });

  // Find ending points (nodes with no outgoing critical edges)
  const endingNodes = relevantNodes.filter(node => {
    const outgoingCritical = edges.filter(e => 
      e.source === node.id && e.critical
    );
    return outgoingCritical.length === 0;
  });

  // Compute paths from each starting point
  const allPaths: MapNode[][] = [];
  
  startingNodes.forEach(startNode => {
    const path = computePathFromNode(startNode, graph, nodes, typeHierarchy);
    if (path.length > 0) {
      allPaths.push(path);
    }
  });

  // Merge and optimize paths
  const optimizedPath = mergePaths(allPaths, typeHierarchy);
  
  // Generate checklist
  const checklist: ChecklistItem[] = optimizedPath.map((node, index) => ({
    id: node.id,
    nodeId: node.id,
    title: node.title,
    description: `Complete ${node.type.replace(/([A-Z])/g, ' $1')}: ${node.title}`,
    completed: false,
    order: index + 1,
    link: node.link,
  }));

  return {
    path: optimizedPath,
    checklist,
    estimatedTime: estimateTime(optimizedPath),
  };
}

function computePathFromNode(
  startNode: MapNode,
  graph: Map<string, string[]>,
  allNodes: MapNode[],
  typeHierarchy: string[]
): MapNode[] {
  const path: MapNode[] = [startNode];
  const visited = new Set<string>();
  visited.add(startNode.id);

  let currentNode = startNode;
  
  while (true) {
    const outgoing = graph.get(currentNode.id) || [];
    
    // Find the next node based on critical edges and type hierarchy
    const nextNodeId = outgoing.find(nextId => {
      const nextNode = allNodes.find(n => n.id === nextId);
      return nextNode && !visited.has(nextId);
    });
    
    if (!nextNodeId) break;
    
    const nextNode = allNodes.find(n => n.id === nextNodeId);
    if (!nextNode) break;
    
    path.push(nextNode);
    visited.add(nextNodeId);
    currentNode = nextNode;
  }

  return path;
}

function mergePaths(paths: MapNode[][], typeHierarchy: string[]): MapNode[] {
  if (paths.length === 0) return [];
  if (paths.length === 1) return paths[0];

  // Merge paths by following the type hierarchy
  const merged: MapNode[] = [];
  const used = new Set<string>();

  // Sort paths by priority (longer paths first, then by type hierarchy)
  const sortedPaths = paths.sort((a, b) => {
    if (a.length !== b.length) return b.length - a.length;
    
    const aFirstType = typeHierarchy.indexOf(a[0]?.type || '');
    const bFirstType = typeHierarchy.indexOf(b[0]?.type || '');
    return aFirstType - bFirstType;
  });

  // Add nodes from paths in order
  sortedPaths.forEach(path => {
    path.forEach(node => {
      if (!used.has(node.id)) {
        merged.push(node);
        used.add(node.id);
      }
    });
  });

  // Sort merged path by type hierarchy
  return merged.sort((a, b) => {
    const aType = typeHierarchy.indexOf(a.type);
    const bType = typeHierarchy.indexOf(b.type);
    return aType - bType;
  });
}

function estimateTime(path: MapNode[]): string {
  const typeTimeEstimates = {
    policy: 30,
    procedure: 60,
    workInstruction: 45,
    sop: 45,
    riskAssessment: 90,
    form: 15,
    record: 10,
    training: 120,
    externalStandard: 0,
  };

  const totalMinutes = path.reduce((total, node) => {
    return total + (typeTimeEstimates[node.type as keyof typeof typeTimeEstimates] || 30);
  }, 0);

  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  } else if (totalMinutes < 480) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  } else {
    const days = Math.ceil(totalMinutes / 480); // 8-hour work day
    return `${days} day${days > 1 ? 's' : ''}`;
  }
}

export function getBreadcrumbs(node: MapNode, nodes: MapNode[], edges: MapEdge[]): MapNode[] {
  const breadcrumbs: MapNode[] = [];
  const visited = new Set<string>();
  
  function buildBreadcrumbs(currentNode: MapNode, depth: number = 0) {
    if (depth > 10 || visited.has(currentNode.id)) return; // Prevent infinite loops
    
    visited.add(currentNode.id);
    breadcrumbs.unshift(currentNode);
    
    // Find upstream critical nodes
    const upstreamEdges = edges.filter(e => 
      e.target === currentNode.id && e.critical
    );
    
    upstreamEdges.forEach(edge => {
      const upstreamNode = nodes.find(n => n.id === edge.source);
      if (upstreamNode && !visited.has(upstreamNode.id)) {
        buildBreadcrumbs(upstreamNode, depth + 1);
      }
    });
  }
  
  buildBreadcrumbs(node);
  return breadcrumbs;
}

export function exportToPNG(): Promise<void> {
  // TODO: Implement PNG export
  return Promise.resolve();
}

export function exportToSVG(): Promise<void> {
  // TODO: Implement SVG export
  return Promise.resolve();
}

export function exportToPDF(): Promise<void> {
  // TODO: Implement PDF export
  return Promise.resolve();
}