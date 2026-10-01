import React from 'react';
import { Layers, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { ProjectItem } from '../../../../types';
import { Button, Input, Label, Textarea } from '../../../ui';

interface ProjectsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  projects: ProjectItem[];
  handleUpdateProject: (pIdx: number, field: keyof ProjectItem, val: any) => void;
  handleAddProjectItem: () => void;
  handleRemoveProjectItem: (pIdx: number) => void;
  handleUpdateDetailRow: (pIdx: number, dIdx: number, field: 'label' | 'value', val: string) => void;
  handleAddDetailRow: (pIdx: number) => void;
  handleRemoveDetailRow: (pIdx: number, dIdx: number) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  isOpen,
  onToggle,
  projects,
  handleUpdateProject,
  handleAddProjectItem,
  handleRemoveProjectItem,
  handleUpdateDetailRow,
  handleAddDetailRow,
  handleRemoveDetailRow,
}) => {
  return (
    <div
      className={`border transition-all duration-200 rounded-md-lg overflow-hidden ${
        isOpen
          ? 'border-md-primary/35 bg-md-surface-container shadow-md-elevation-1'
          : 'border-white/[0.08] bg-md-surface-container-low hover:bg-md-surface-container hover:border-white/[0.16]'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between p-4.5 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/40 ${
          isOpen ? 'text-md-on-surface bg-md-surface-container border-b border-white/[0.08]' : 'text-md-on-surface-variant hover:text-md-on-surface bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Layers className={`w-5 h-5 transition-colors ${isOpen ? 'text-md-primary' : 'text-md-on-surface-variant'}`} />
          <span className="font-display tracking-wide">
            Projects & Innovations ({projects?.length || 0})
          </span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-md-primary" /> : <ChevronRight className="w-5 h-5 text-md-on-surface-variant" />}
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-transparent">
          {(projects || []).map((proj, pIdx) => (
            <div key={pIdx} className="bg-white/[0.02] rounded-md-md p-4.5 border border-white/[0.06] relative animate-fade-in space-y-4 hover:border-white/[0.14] transition-colors">
              <button
                onClick={() => handleRemoveProjectItem(pIdx)}
                className="absolute top-3.5 right-3.5 p-1.5 text-md-error hover:text-md-error hover:bg-md-error-container/20 rounded-md-sm cursor-pointer transition-colors"
                title="Remove project"
                aria-label="Remove project"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4 pr-7">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    type="text"
                    value={proj.title}
                    onChange={(e) => handleUpdateProject(pIdx, 'title', e.target.value)}
                    placeholder="e.g. AI Workflow Canvas"
                  />
                </div>

                <div>
                  <Label>Your Role / Contribution</Label>
                  <Input
                    type="text"
                    value={proj.role}
                    onChange={(e) => handleUpdateProject(pIdx, 'role', e.target.value)}
                    placeholder="e.g. Lead Product Architect"
                  />
                </div>

                <div>
                  <Label>Brief Description</Label>
                  <Textarea
                    value={proj.description}
                    onChange={(e) => handleUpdateProject(pIdx, 'description', e.target.value)}
                    placeholder="Describe problem solved, technology stack, and user growth impact..."
                    rows={2}
                  />
                </div>

                {/* Detail Label/Values */}
                <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                  <span className="block text-xs text-md-on-surface-variant font-medium">
                    Key Highlights & Metrics
                  </span>
                  {(proj.details || []).map((d, dIdx) => (
                    <div key={dIdx} className="flex gap-2.5 items-center animate-fade-in">
                      <div className="w-1/3">
                        <Input
                          type="text"
                          value={d.label}
                          onChange={(e) => handleUpdateDetailRow(pIdx, dIdx, 'label', e.target.value)}
                          placeholder="Label (e.g. Impact)"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={d.value}
                          onChange={(e) => handleUpdateDetailRow(pIdx, dIdx, 'value', e.target.value)}
                          placeholder="Outcome value..."
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveDetailRow(pIdx, dIdx)}
                        className="p-1.5 text-md-error hover:text-md-error hover:bg-md-error-container/20 rounded cursor-pointer shrink-0"
                        title="Remove detail"
                        aria-label="Remove detail"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <Button onClick={() => handleAddDetailRow(pIdx)} variant="secondary" size="sm" fullWidth className="gap-2">
                    <Plus className="w-3.5 h-3.5 text-md-primary" /> Add Metric Detail
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handleAddProjectItem} variant="secondary" fullWidth className="gap-2">
            <Plus className="w-4 h-4 text-md-primary" /> Add Project
          </Button>
        </div>
      )}
    </div>
  );
};
