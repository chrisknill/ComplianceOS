import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MapNode } from '@/types/management-map';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, 
  Settings, 
  List, 
  Shield, 
  AlertTriangle, 
  FileCheck, 
  Archive, 
  GraduationCap,
  ExternalLink,
  Hexagon
} from 'lucide-react';

interface CustomNodeData extends MapNode {}

export function NodeCard({ data, selected }: NodeProps<CustomNodeData>) {
  const { title, type, status = 'draft', owner, description, code, link } = data;
  
  // Get node icon based on type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'policy': return <Shield className="h-4 w-4" />;
      case 'procedure': return <Settings className="h-4 w-4" />;
      case 'workInstruction': return <List className="h-4 w-4" />;
      case 'sop': return <FileCheck className="h-4 w-4" />;
      case 'riskAssessment': return <AlertTriangle className="h-4 w-4" />;
      case 'form': return <FileText className="h-4 w-4" />;
      case 'record': return <Archive className="h-4 w-4" />;
      case 'training': return <GraduationCap className="h-4 w-4" />;
      case 'externalStandard': return <ExternalLink className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      case 'draft': return 'bg-gray-400';
      case 'archived': return 'bg-gray-600';
      default: return 'bg-gray-400';
    }
  };

  // Get node shape styling based on type
  const getNodeShape = (type: string) => {
    switch (type) {
      case 'policy':
        return 'rounded-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100';
      case 'procedure':
        return 'rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-green-200';
      case 'workInstruction':
        return 'rounded-full bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200';
      case 'sop':
        return 'rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200';
      case 'riskAssessment':
        return 'transform rotate-45 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      case 'form':
        return 'rounded-lg bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200';
      case 'record':
        return 'rounded-lg bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200';
      case 'training':
        return 'rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 'externalStandard':
        return 'rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      default:
        return 'rounded-lg bg-white border-gray-200';
    }
  };

  // Get type-specific background color
  const getTypeColor = (type: string) => {
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
  };

  const icon = getNodeIcon(type);
  const statusColor = getStatusColor(status);
  const nodeShape = getNodeShape(type);
  const typeColor = getTypeColor(type);

  // Handle node click to open document
  const handleNodeClick = () => {
    if (link?.url) {
      window.open(link.url, '_blank');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              ${typeColor} border rounded-lg shadow-sm p-3 min-w-[200px] max-w-[280px] 
              hover:shadow-md transition-all duration-200 cursor-pointer
              ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              ${type === 'riskAssessment' ? 'w-24 h-24 flex items-center justify-center' : ''}
            `}
            onClick={handleNodeClick}
          >
            <Handle type="target" position={Position.Top} className="w-3 h-3" />
            
            {type === 'riskAssessment' ? (
              // Special diamond shape for risk assessments
              <div className="transform -rotate-45 text-center">
                <div className="flex items-center justify-center mb-1">
                  {icon}
                  <Badge 
                    className={`w-2 h-2 p-0 ${statusColor} border-0 ml-1`}
                    variant="secondary"
                  />
                </div>
                <p className="text-xs font-medium text-gray-900 line-clamp-2 transform rotate-45">
                  {title}
                </p>
              </div>
            ) : (
              // Regular node layout
              <>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">{icon}</span>
                  <div className="flex-1">
                    {code && (
                      <Badge variant="outline" className="text-xs mb-1">
                        {code}
                      </Badge>
                    )}
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {type.replace(/([A-Z])/g, ' $1')}
                    </p>
                  </div>
                  <Badge 
                    className={`w-2 h-2 p-0 ${statusColor} border-0`}
                    variant="secondary"
                  />
                </div>

                {owner && (
                  <p className="text-xs text-gray-600 mb-1">Owner: {owner}</p>
                )}
                
                {description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
                )}
              </>
            )}

            <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{title}</p>
            <p className="text-xs text-gray-600 capitalize">{type.replace(/([A-Z])/g, ' $1')}</p>
            {owner && <p className="text-xs text-gray-600">Owner: {owner}</p>}
            {description && <p className="text-xs text-gray-500">{description}</p>}
            <p className="text-xs text-gray-400">Status: {status}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}