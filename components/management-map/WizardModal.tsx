import React, { useState } from 'react';
import { MapNode, MapEdge, WizardResult } from '@/types/management-map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, ExternalLink, Wand2, X } from 'lucide-react';
import { computeMinimalPath } from '@/lib/utils/management-map';
import { useManagementMapStore } from '@/lib/stores/management-map-store';

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  nodes: MapNode[];
  edges: MapEdge[];
}

export function WizardModal({ isOpen, onClose, onComplete, nodes, edges }: WizardModalProps) {
  const [step, setStep] = useState<'criteria' | 'results'>('criteria');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [result, setResult] = useState<WizardResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { generateChecklist } = useManagementMapStore();

  // Extract unique values for dropdowns
  const allRoles = Array.from(new Set(nodes.flatMap(n => n.roles || [])));
  const allActivities = Array.from(new Set(nodes.flatMap(n => n.tags || [])));
  const allLocations = Array.from(new Set(nodes.flatMap(n => n.location || [])));

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleAddCustomActivity = () => {
    if (customActivity.trim() && !selectedActivities.includes(customActivity.trim())) {
      setSelectedActivities(prev => [...prev, customActivity.trim()]);
      setCustomActivity('');
    }
  };

  const handleGeneratePath = async () => {
    setLoading(true);
    
    try {
      // Add custom activity if provided
      const activities = customActivity.trim() 
        ? [...selectedActivities, customActivity.trim()]
        : selectedActivities;

      const wizardResult = computeMinimalPath(nodes, edges, selectedRoles, activities, selectedLocations);
      setResult(wizardResult);
      setStep('results');
    } catch (error) {
      console.error('Error generating path:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseChecklist = () => {
    if (result) {
      generateChecklist(result);
      onComplete();
    }
  };

  const handleReset = () => {
    setStep('criteria');
    setSelectedRoles([]);
    setSelectedActivities([]);
    setSelectedLocations([]);
    setCustomActivity('');
    setResult(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            What do I need? - Compliance Path Wizard
          </DialogTitle>
          <DialogDescription>
            {step === 'criteria' 
              ? 'Tell us about your role and what you need to accomplish, and we\'ll generate a personalized compliance path.'
              : 'Here\'s your personalized compliance path based on your criteria.'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'criteria' && (
          <div className="space-y-6">
            <ScrollArea className="h-96">
              <div className="space-y-6 pr-4">
                {/* Roles Selection */}
                <div>
                  <Label className="text-base font-medium">Your Role(s)</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Select all roles that apply to you
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allRoles.map((role) => (
                      <Button
                        key={role}
                        variant={selectedRoles.includes(role) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRoleToggle(role)}
                        className="text-xs"
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Activities Selection */}
                <div>
                  <Label className="text-base font-medium">Activities/Tasks</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    What are you trying to accomplish?
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {allActivities.map((activity) => (
                      <Button
                        key={activity}
                        variant={selectedActivities.includes(activity) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleActivityToggle(activity)}
                        className="text-xs"
                      >
                        {activity}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Custom Activity Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom activity..."
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomActivity()}
                    />
                    <Button onClick={handleAddCustomActivity} disabled={!customActivity.trim()}>
                      Add
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Locations Selection */}
                <div>
                  <Label className="text-base font-medium">Location(s)</Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Where will you be working?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allLocations.map((location) => (
                      <Button
                        key={location}
                        variant={selectedLocations.includes(location) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLocationToggle(location)}
                        className="text-xs"
                      >
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGeneratePath} 
                disabled={loading}
                className="min-w-32"
              >
                {loading ? 'Generating...' : 'Generate Path'}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'results' && result && (
          <div className="space-y-6">
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {/* Path Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Your Compliance Path
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Documents to Complete</p>
                        <p className="text-2xl font-bold">{result.path.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Time</p>
                        <p className="text-2xl font-bold flex items-center gap-1">
                          <Clock className="h-5 w-5" />
                          {result.estimatedTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Path Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Step-by-Step Path</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.path.map((node, index) => (
                        <div key={node.id} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{node.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">
                              {node.type.replace(/([A-Z])/g, ' $1')}
                            </p>
                            {node.description && (
                              <p className="text-sm text-gray-500 mt-1">{node.description}</p>
                            )}
                            {node.owner && (
                              <p className="text-xs text-gray-400 mt-1">Owner: {node.owner}</p>
                            )}
                          </div>
                          {node.link?.url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(node.link!.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Open
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Checklist Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.checklist.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 p-2 rounded border">
                          <div className="w-4 h-4 border rounded" />
                          <span className="text-sm">{item.title}</span>
                        </div>
                      ))}
                      {result.checklist.length > 5 && (
                        <p className="text-sm text-gray-500">
                          +{result.checklist.length - 5} more items...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={handleUseChecklist}>
                  Use Checklist
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}