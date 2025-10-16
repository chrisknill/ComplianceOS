import React from 'react';
import { MapNode, MapEdge } from '@/types/management-map';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home } from 'lucide-react';
import { getNodeIcon } from '@/lib/utils/management-map';

interface BreadcrumbsProps {
  node: MapNode;
  nodes: MapNode[];
  edges: MapEdge[];
}

export function Breadcrumbs({ node, nodes, edges }: BreadcrumbsProps) {
  const breadcrumbs = getBreadcrumbs(node, nodes, edges);

  const handleBreadcrumbClick = (breadcrumbNode: MapNode) => {
    // TODO: Navigate to node in the graph
    console.log('Navigate to:', breadcrumbNode.id);
  };

  const handleHomeClick = () => {
    // TODO: Navigate to overview/home
    console.log('Navigate to home');
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleHomeClick}
        className="text-gray-600 hover:text-gray-900"
      >
        <Home className="h-4 w-4 mr-1" />
        Management System Map
      </Button>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.id}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-2">
            {index === breadcrumbs.length - 1 ? (
              // Current node - not clickable
              <div className="flex items-center gap-2">
                <span className="text-lg">{getNodeIcon(breadcrumb.type)}</span>
                <span className="font-medium text-gray-900">{breadcrumb.title}</span>
                <Badge variant="secondary" className="text-xs">
                  {breadcrumb.type.replace(/([A-Z])/g, ' $1')}
                </Badge>
              </div>
            ) : (
              // Previous nodes - clickable
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBreadcrumbClick(breadcrumb)}
                className="text-gray-600 hover:text-gray-900 p-1 h-auto"
              >
                <span className="text-base mr-1">{getNodeIcon(breadcrumb.type)}</span>
                <span className="truncate max-w-32">{breadcrumb.title}</span>
              </Button>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function getBreadcrumbs(node: MapNode, nodes: MapNode[], edges: MapEdge[]): MapNode[] {
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
