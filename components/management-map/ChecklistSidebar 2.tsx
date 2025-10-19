import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  GripVertical,
  Trash2
} from 'lucide-react';
import { useManagementMapStore } from '@/lib/stores/management-map-store';
import { ChecklistItem } from '@/types/management-map';

interface ChecklistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChecklistSidebar({ isOpen, onClose }: ChecklistSidebarProps) {
  const {
    checklistItems,
    updateChecklistItem,
    removeChecklistItem,
    clearChecklist,
    getNodeById,
    nodes
  } = useManagementMapStore();

  const handleToggleComplete = (itemId: string) => {
    const item = checklistItems.find(i => i.id === itemId);
    if (item) {
      updateChecklistItem(itemId, { completed: !item.completed });
    }
  };

  const handleOpenDocument = (nodeId: string) => {
    const node = getNodeById(nodeId);
    if (node?.data.link?.url) {
      window.open(node.data.link.url, '_blank');
    }
  };

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-96 bg-white border-r border-gray-200 shadow-lg z-40 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Checklist</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">
                  {completedCount} of {totalCount} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {progress}% complete
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checklist Items */}
        {checklistItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No checklist items</h3>
              <p className="text-gray-600">
                Use the &quot;What do I need?&quot; wizard to generate a personalized compliance checklist.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {checklistItems
              .sort((a, b) => a.order - b.order)
              .map((item) => {
                const node = getNodeById(item.nodeId);
                return (
                  <Card key={item.id} className={`transition-all ${item.completed ? 'opacity-75' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleComplete(item.id)}
                          className="mt-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {item.completed ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {item.title}
                              </h4>
                              {node && (
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {node.type.replace(/([A-Z])/g, ' $1').trim()}
                                  </Badge>
                                  {node.data.status && (
                                    <Badge variant="secondary" className="text-xs">
                                      {node.data.status.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              {node?.data.link?.url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDocument(item.nodeId)}
                                  className="h-6 w-6 p-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeChecklistItem(item.id)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}

        {/* Actions */}
        {totalCount > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={clearChecklist}
              className="w-full"
            >
              Clear All Items
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
