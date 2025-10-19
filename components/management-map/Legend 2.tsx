import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  getNodeIcon, 
  getStatusColor, 
  getStatusBadgeVariant,
  getTypeLabel,
  getRelationshipLabel,
  getEdgeStyle
} from '@/lib/utils/management-map';
import { DocType, StatusType, RelationshipType } from '@/types/management-map';

const nodeTypes: DocType[] = [
  'policy',
  'procedure', 
  'workInstruction',
  'sop',
  'riskAssessment',
  'form',
  'record',
  'training',
  'externalStandard'
];

const statusTypes: StatusType[] = [
  'green',
  'amber', 
  'red',
  'draft',
  'archived'
];

const relationshipTypes: RelationshipType[] = [
  'prerequisite',
  'control',
  'evidence',
  'outputToInput',
  'escalation',
  'reference'
];

export default function Legend() {
  return (
    <div className="bg-white border rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-semibold text-sm text-gray-900 mb-3">Legend</h3>
      
      {/* Node Types */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
          Document Types
        </h4>
        <div className="space-y-1">
          {nodeTypes.map(type => (
            <div key={type} className="flex items-center gap-2">
              <span className="text-sm">{getNodeIcon(type)}</span>
              <span className="text-xs text-gray-600">{getTypeLabel(type)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Types */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
          Status
        </h4>
        <div className="space-y-1">
          {statusTypes.map(status => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: getStatusColor(status) }}
              />
              <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
                {status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Types */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
          Relationships
        </h4>
        <div className="space-y-1">
          {relationshipTypes.map(relationship => {
            const style = getEdgeStyle(relationship);
            return (
              <div key={relationship} className="flex items-center gap-2">
                <div
                  className="w-6 h-0.5"
                  style={{
                    backgroundColor: style.stroke,
                    borderStyle: style.strokeDasharray ? 'dashed' : 'solid',
                    borderWidth: style.strokeWidth || 1,
                  }}
                />
                <span className="text-xs text-gray-600">
                  {getRelationshipLabel(relationship)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span>Critical Path</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <span>Non-Critical</span>
        </div>
      </div>
    </div>
  );
}
