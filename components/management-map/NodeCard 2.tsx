import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  getNodeIcon, 
  getStatusColor, 
  getStatusBadgeVariant, 
  getTypeLabel 
} from '@/lib/utils/management-map';
import { FlowNode } from '@/types/management-map';

export default function NodeCard({ data, selected, id }: NodeProps<FlowNode['data']>) {
  const statusColor = getStatusColor(data.status);
  const icon = getNodeIcon(data.type);
  const typeLabel = getTypeLabel(data.type);

  return (
    <div
      className={cn(
        "relative bg-white border-2 rounded-lg shadow-lg min-w-[200px] max-w-[250px] transition-all duration-200",
        selected 
          ? "border-blue-500 shadow-xl scale-105" 
          : "border-gray-200 hover:border-gray-300 hover:shadow-xl"
      )}
    >
      {/* Status indicator */}
      <div
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
        style={{ backgroundColor: statusColor }}
      />

      {/* Node content */}
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <Badge variant={getStatusBadgeVariant(data.status)} className="text-xs">
              {data.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            {data.version}
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h3 className="font-semibold text-sm leading-tight text-gray-900">
            {data.label}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            {typeLabel}
          </p>
        </div>

        {/* Owner */}
        {data.owner && (
          <div className="mb-2">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Owner:</span> {data.owner}
            </p>
          </div>
        )}

        {/* Description */}
        {data.description && (
          <div className="mb-2">
            <p className="text-xs text-gray-600 line-clamp-2">
              {data.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
            {data.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                +{data.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Review date */}
        {data.nextReviewDate && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Next Review:</span>{' '}
              {new Date(data.nextReviewDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
}
