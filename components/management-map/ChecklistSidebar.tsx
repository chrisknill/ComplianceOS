import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  X, 
  Download,
  RotateCcw,
  DragHandleDots2Icon
} from 'lucide-react';
import { useManagementMapStore } from '@/lib/stores/management-map-store';
import { ChecklistItem } from '@/types/management-map';

interface ChecklistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChecklistSidebar({ isOpen, onClose }: ChecklistSidebarProps) {
  const { checklist, checklistProgress, updateChecklistItem, resetChecklist } = useManagementMapStore();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleItemToggle = (itemId: string, completed: boolean) => {
    updateChecklistItem(itemId, completed);
  };

  const handleOpenDocument = (item: ChecklistItem) => {
    if (item.link?.url) {
      window.open(item.link.url, '_blank');
    } else if (item.link?.filePath) {
      // Handle file download
      console.log('Download file:', item.link.filePath);
    }
  };

  const handleExportChecklist = () => {
    const completedCount = checklist.filter(item => checklistProgress[item.id]).length;
    const totalCount = checklist.length;
    
    const checklistData = {
      title: 'Compliance Checklist',
      generatedAt: new Date().toISOString(),
      progress: `${completedCount}/${totalCount} completed`,
      items: checklist.map(item => ({
        title: item.title,
        description: item.description,
        completed: checklistProgress[item.id] || false,
        order: item.order,
      }))
    };

    const blob = new Blob([JSON.stringify(checklistData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-checklist-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetProgress = () => {
    resetChecklist();
  };

  const completedCount = checklist.filter(item => checklistProgress[item.id]).length;
  const totalCount = checklist.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!isOpen || checklist.length === 0) {
    return null;
  }

  return (
    <div className="w-96 border-l bg-white shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Checklist</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {/* Checklist Items */}
          {checklist.map((item, index) => (
            <Card key={item.id} className={`transition-all duration-200 ${
              checklistProgress[item.id] ? 'bg-green-50 border-green-200' : ''
            }`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Checkbox
                      checked={checklistProgress[item.id] || false}
                      onCheckedChange={(checked) => handleItemToggle(item.id, checked as boolean)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        #{item.order}
                      </Badge>
                      {checklistProgress[item.id] && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    <h4 className="font-medium text-sm text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    
                    {item.description && (
                      <p className="text-xs text-gray-600 mb-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      {item.link && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleOpenDocument(item)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-gray-50 space-y-3">
        <Separator />
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetProgress}
            className="flex-1"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset Progress
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportChecklist}
            className="flex-1"
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {completedCount === totalCount 
              ? '🎉 Congratulations! All tasks completed!' 
              : `${totalCount - completedCount} tasks remaining`
            }
          </p>
        </div>
      </div>
    </div>
  );
}