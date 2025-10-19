import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Wand2, CheckSquare, ExternalLink } from 'lucide-react';
import { useManagementMapStore } from '@/lib/stores/management-map-store';
import { computeMinimalPath, generateBreadcrumbs } from '@/lib/utils/management-map';

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WizardModal({ isOpen, onClose }: WizardModalProps) {
  const { nodes, edges, addChecklistItem, setChecklistOpen } = useManagementMapStore();
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [formData, setFormData] = useState({
    role: '',
    activity: '',
    location: '',
  });
  const [results, setResults] = useState<{
    path: string[];
    steps: Array<{ id: string; title: string; nodeId: string }>;
  } | null>(null);

  const handleSubmit = () => {
    // Convert store nodes to MapNode format for path computation
    const mapNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      roles: node.data.roles,
      location: node.location,
      title: node.data.label,
    }));

    const mapEdges = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      relationship: edge.data.relationship,
    }));

    // Compute minimal path
    const path = computeMinimalPath(mapNodes, mapEdges, formData.role, formData.activity, formData.location);
    
    // Generate steps
    const steps = path.map((nodeId, index) => {
      const node = nodes.find(n => n.id === nodeId);
      return {
        id: `step-${index}`,
        title: node?.data.label || 'Unknown Step',
        nodeId: nodeId,
      };
    });

    setResults({ path, steps });
    setStep('results');
  };

  const handleUseChecklist = () => {
    if (results) {
      // Add steps to checklist
      results.steps.forEach((step, index) => {
        addChecklistItem({
          id: step.id,
          nodeId: step.nodeId,
          title: step.title,
          completed: false,
          order: index,
        });
      });
      
      setChecklistOpen(true);
      onClose();
    }
  };

  const handleOpenAll = () => {
    if (results) {
      results.path.forEach(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        if (node?.data.link?.url) {
          window.open(node.data.link.url, '_blank');
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Wand2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">What do I need?</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {step === 'form' ? (
            <div className="space-y-6">
              <p className="text-gray-600">
                Tell us about your role and what you need to do, and we&apos;ll show you the exact documents and steps required.
              </p>

              <div className="space-y-4">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your role...</option>
                    <option value="CEO">CEO</option>
                    <option value="Quality Manager">Quality Manager</option>
                    <option value="H&S Manager">H&S Manager</option>
                    <option value="Operations Director">Operations Director</option>
                    <option value="Procurement Manager">Procurement Manager</option>
                    <option value="Production Manager">Production Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Supervisors">Supervisors</option>
                    <option value="Employees">Employees</option>
                  </select>
                </div>

                {/* Activity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task/Activity
                  </label>
                  <Input
                    value={formData.activity}
                    onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                    placeholder="e.g., Document Creation, Incident Investigation, Supplier Evaluation..."
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location/Process Area
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select location...</option>
                    <option value="Head Office">Head Office</option>
                    <option value="All Sites">All Sites</option>
                    <option value="Manufacturing Site">Manufacturing Site</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.role || !formData.activity || !formData.location}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  Find My Path
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <CheckSquare className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Compliance Path
                </h3>
                <p className="text-gray-600">
                  Based on your role and activity, here&apos;s the minimal compliant path you need to follow:
                </p>
              </div>

              {results && (
                <div className="space-y-4">
                  {/* Path Steps */}
                  <div className="space-y-3">
                    {results.steps.map((step, index) => {
                      const node = nodes.find(n => n.id === step.nodeId);
                      return (
                        <Card key={step.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    {node?.type ? node.type.replace(/([A-Z])/g, ' $1').trim() : 'Document'}
                                  </p>
                                </div>
                              </div>
                              {node?.data.link?.url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(node.data.link.url, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setStep('form')}>
                      Back to Form
                    </Button>
                    <Button variant="outline" onClick={handleOpenAll}>
                      Open All Documents
                    </Button>
                    <Button onClick={handleUseChecklist} className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Use Checklist
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
