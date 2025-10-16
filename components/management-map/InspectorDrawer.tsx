import React, { useState } from 'react';
import { ExternalLink, Download, AlertTriangle, Users, Calendar, FileText, CheckCircle, Clock, X } from 'lucide-react';
import { MapNode, MapEdge } from '@/types/management-map';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface InspectorDrawerProps {
  node: MapNode;
  onClose: () => void;
  nodes: MapNode[];
  edges: MapEdge[];
}

interface RequiredStep {
  id: string;
  title: string;
  type: string;
  description?: string;
  completed: boolean;
  link?: { url?: string; filePath?: string };
}

export function InspectorDrawer({ node, onClose, nodes, edges }: InspectorDrawerProps) {
  const [requiredSteps, setRequiredSteps] = useState<RequiredStep[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Get node icon
  const getNodeIcon = (type: string) => {
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
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'green': return 'bg-green-500 text-white';
      case 'amber': return 'bg-yellow-500 text-white';
      case 'red': return 'bg-red-500 text-white';
      case 'draft': return 'bg-gray-400 text-white';
      case 'archived': return 'bg-gray-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  // Get next required steps based on node relationships
  const getNextRequiredSteps = (): RequiredStep[] => {
    const nextNodes: RequiredStep[] = [];
    
    // Find outgoing edges (what this node leads to)
    const outgoingEdges = edges.filter(edge => edge.source === node.id);
    
    for (const edge of outgoingEdges) {
      const targetNode = nodes.find(n => n.id === edge.target);
      if (targetNode) {
        nextNodes.push({
          id: targetNode.id,
          title: targetNode.title,
          type: targetNode.type,
          description: targetNode.description,
          completed: completedSteps.has(targetNode.id),
          link: targetNode.link
        });
      }
    }

    // Sort by critical edges first, then by type hierarchy
    const typeHierarchy = ['policy', 'procedure', 'workInstruction', 'sop', 'riskAssessment', 'form', 'record', 'training', 'externalStandard'];
    
    return nextNodes.sort((a, b) => {
      // Critical edges first
      const aCritical = edges.find(e => e.source === node.id && e.target === a.id)?.critical;
      const bCritical = edges.find(e => e.source === node.id && e.target === b.id)?.critical;
      
      if (aCritical && !bCritical) return -1;
      if (!aCritical && bCritical) return 1;
      
      // Then by type hierarchy
      const aTypeIndex = typeHierarchy.indexOf(a.type);
      const bTypeIndex = typeHierarchy.indexOf(b.type);
      
      return aTypeIndex - bTypeIndex;
    });
  };

  // Get upstream nodes (what leads to this node)
  const getUpstreamNodes = (): MapNode[] => {
    const upstreamEdges = edges.filter(edge => edge.target === node.id);
    return upstreamEdges
      .map(edge => nodes.find(n => n.id === edge.source))
      .filter((n): n is MapNode => n !== undefined);
  };

  // Get downstream nodes (what this node leads to)
  const getDownstreamNodes = (): MapNode[] => {
    const downstreamEdges = edges.filter(edge => edge.source === node.id);
    return downstreamEdges
      .map(edge => nodes.find(n => n.id === edge.target))
      .filter((n): n is MapNode => n !== undefined);
  };

  const handleStepToggle = (stepId: string, completed: boolean) => {
    if (completed) {
      setCompletedSteps(prev => new Set([...prev, stepId]));
    } else {
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(stepId);
        return newSet;
      });
    }
  };

  const handleOpenDocument = (link: { url?: string; filePath?: string }) => {
    if (link.url) {
      window.open(link.url, '_blank');
    } else if (link.filePath) {
      // Handle file download
      console.log('Download file:', link.filePath);
    }
  };

  const handleReportIssue = () => {
    // TODO: Implement issue reporting
    console.log('Report issue for node:', node.id);
  };

  React.useEffect(() => {
    setRequiredSteps(getNextRequiredSteps());
  }, [node, edges, nodes]);

  const icon = getNodeIcon(node.type);
  const statusColor = getStatusColor(node.status);
  const upstreamNodes = getUpstreamNodes();
  const downstreamNodes = getDownstreamNodes();

  return (
    <div className="w-96 border-l bg-white shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Document Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Header Info */}
          <div className="flex items-start gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{node.title}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {node.type.replace(/([A-Z])/g, ' $1')}
              </p>
              {node.code && (
                <Badge variant="outline" className="mt-1">
                  {node.code}
                </Badge>
              )}
            </div>
            <Badge className={`${statusColor}`}>
              {node.status || 'Draft'}
            </Badge>
          </div>

          {/* Next Required Steps */}
          {requiredSteps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Next Required Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {requiredSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-2 p-2 rounded border">
                    <Checkbox
                      checked={step.completed}
                      onCheckedChange={(checked) => handleStepToggle(step.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {step.type.replace(/([A-Z])/g, ' $1')}
                      </p>
                      {step.link && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-1 text-xs"
                          onClick={() => handleOpenDocument(step.link!)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {node.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{node.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 gap-3">
            {node.owner && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="text-sm font-medium">{node.owner}</p>
                </div>
              </div>
            )}
            
            {node.version && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Version</p>
                  <p className="text-sm font-medium">{node.version}</p>
                </div>
              </div>
            )}
            
            {node.nextReviewDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Next Review</p>
                  <p className="text-sm font-medium">
                    {new Date(node.nextReviewDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Roles */}
          {node.roles && node.roles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Responsible Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {node.roles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ISO Clauses */}
          {node.isoClauses && node.isoClauses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">ISO Clauses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {node.isoClauses.map((clause, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {clause}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inputs & Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {node.inputs && node.inputs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Inputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs space-y-1">
                    {node.inputs.map((input, index) => (
                      <li key={index} className="text-gray-600">• {input}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {node.outputs && node.outputs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Outputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs space-y-1">
                    {node.outputs.map((output, index) => (
                      <li key={index} className="text-gray-600">• {output}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Relationships */}
          {(upstreamNodes.length > 0 || downstreamNodes.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Relationships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upstreamNodes.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Prerequisites:</p>
                    <div className="space-y-1">
                      {upstreamNodes.slice(0, 3).map((upstream) => (
                        <p key={upstream.id} className="text-xs text-gray-600">
                          • {upstream.title}
                        </p>
                      ))}
                      {upstreamNodes.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{upstreamNodes.length - 3} more...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {downstreamNodes.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Leads to:</p>
                    <div className="space-y-1">
                      {downstreamNodes.slice(0, 3).map((downstream) => (
                        <p key={downstream.id} className="text-xs text-gray-600">
                          • {downstream.title}
                        </p>
                      ))}
                      {downstreamNodes.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{downstreamNodes.length - 3} more...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Actions</h4>
            <div className="flex gap-2">
              {node.link?.url && (
                <Button size="sm" variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Source
                </Button>
              )}
              {node.link?.filePath && (
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Report Issue */}
          <Button variant="outline" size="sm" className="w-full" onClick={handleReportIssue}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report an Issue
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}