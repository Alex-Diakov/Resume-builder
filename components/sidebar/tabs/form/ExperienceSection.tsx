import React from 'react';
import { Briefcase, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { ExperienceItem } from '../../../../types';
import { Button, Input, Label, Textarea } from '../../../ui';

interface ExperienceSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  experience: ExperienceItem[];
  handleUpdateExperience: (idx: number, field: keyof ExperienceItem, val: any) => void;
  handleAddExperienceItem: () => void;
  handleRemoveExperienceItem: (idx: number) => void;
  handleUpdateHighlight: (expIdx: number, hIdx: number, field: 'title' | 'description', val: string) => void;
  handleAddHighlight: (expIdx: number) => void;
  handleRemoveHighlight: (expIdx: number, hIdx: number) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  isOpen,
  onToggle,
  experience,
  handleUpdateExperience,
  handleAddExperienceItem,
  handleRemoveExperienceItem,
  handleUpdateHighlight,
  handleAddHighlight,
  handleRemoveHighlight,
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
          <Briefcase className={`w-5 h-5 transition-colors ${isOpen ? 'text-md-primary' : 'text-md-on-surface-variant'}`} />
          <span className="font-display tracking-wide">
            Work Experience ({experience?.length || 0})
          </span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-md-primary" /> : <ChevronRight className="w-5 h-5 text-md-on-surface-variant" />}
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-transparent">
          {(experience || []).map((exp, expIdx) => (
            <div key={expIdx} className="bg-white/[0.02] rounded-md-md p-4.5 border border-white/[0.06] relative animate-fade-in space-y-4 hover:border-white/[0.14] transition-colors">
              <button
                onClick={() => handleRemoveExperienceItem(expIdx)}
                className="absolute top-3.5 right-3.5 p-1.5 text-md-error hover:text-md-error hover:bg-md-error-container/20 rounded-md-sm cursor-pointer transition-colors"
                title="Remove experience entry"
                aria-label="Remove experience entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4 pr-7">
                <div>
                  <Label>Job Title / Role</Label>
                  <Input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleUpdateExperience(expIdx, 'role', e.target.value)}
                    placeholder="e.g. Lead Product Designer"
                  />
                </div>

                <div>
                  <Label>Company Name</Label>
                  <Input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleUpdateExperience(expIdx, 'company', e.target.value)}
                    placeholder="e.g. Acme Studio"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <Label>Dates / Duration</Label>
                    <Input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => handleUpdateExperience(expIdx, 'duration', e.target.value)}
                      placeholder="e.g. 2021 — Present"
                    />
                  </div>
                  <div>
                    <Label>Employment Type</Label>
                    <Input
                      type="text"
                      value={exp.type}
                      onChange={(e) => handleUpdateExperience(expIdx, 'type', e.target.value)}
                      placeholder="e.g. Full-time, Contract"
                    />
                  </div>
                </div>

                {/* Highlights Bullet Rows */}
                <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                  <span className="block text-xs text-md-on-surface-variant font-medium">
                    Key Achievements & Responsibilities
                  </span>
                  {(exp.highlights || []).map((h, hIdx) => (
                    <div key={hIdx} className="bg-md-surface-container-lowest p-3.5 rounded-md-sm border border-white/[0.06] space-y-2.5 relative animate-fade-in">
                      <button
                        onClick={() => handleRemoveHighlight(expIdx, hIdx)}
                        className="absolute top-2.5 right-2.5 p-1 text-md-error hover:text-md-error hover:bg-md-error-container/20 rounded cursor-pointer"
                        title="Remove highlight"
                        aria-label="Remove highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="pr-6">
                        <Label>Achievement Heading</Label>
                        <Input
                          type="text"
                          value={h.title}
                          onChange={(e) => handleUpdateHighlight(expIdx, hIdx, 'title', e.target.value)}
                          placeholder="e.g. Design System Architecture"
                        />
                      </div>
                      <div>
                        <Label>Outcome & Impact (metrics bolded)</Label>
                        <Textarea
                          value={h.description}
                          onChange={(e) => handleUpdateHighlight(expIdx, hIdx, 'description', e.target.value)}
                          placeholder="Reduced onboarding friction by +28% through iterative user journey testing..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => handleAddHighlight(expIdx)} variant="secondary" size="sm" fullWidth className="gap-2">
                    <Plus className="w-3.5 h-3.5 text-md-primary" /> Add Achievement Bullet
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handleAddExperienceItem} variant="secondary" fullWidth className="gap-2">
            <Plus className="w-4 h-4 text-md-primary" /> Add Work Experience
          </Button>
        </div>
      )}
    </div>
  );
};
