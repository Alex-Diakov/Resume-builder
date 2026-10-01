import React from 'react';
import { GraduationCap, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { EducationItem } from '../../../../types';
import { Button, Input, Label } from '../../../ui';

interface EducationSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  education: EducationItem[];
  handleUpdateEducation: (idx: number, field: keyof EducationItem, val: string) => void;
  handleAddEducationItem: () => void;
  handleRemoveEducation: (idx: number) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  isOpen,
  onToggle,
  education,
  handleUpdateEducation,
  handleAddEducationItem,
  handleRemoveEducation,
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
          <GraduationCap className={`w-5 h-5 transition-colors ${isOpen ? 'text-md-primary' : 'text-md-on-surface-variant'}`} />
          <span className="font-display tracking-wide">
            Education ({education?.length || 0})
          </span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-md-primary" /> : <ChevronRight className="w-5 h-5 text-md-on-surface-variant" />}
      </button>

      {isOpen && (
        <div className="p-5 space-y-5 bg-transparent">
          {(education || []).map((edu, idx) => (
            <div key={idx} className="bg-white/[0.02] rounded-md-md p-4.5 border border-white/[0.06] relative space-y-4 hover:border-white/[0.14] transition-colors animate-fade-in">
              <button
                onClick={() => handleRemoveEducation(idx)}
                className="absolute top-3.5 right-3.5 p-1.5 text-md-error hover:text-md-error hover:bg-md-error-container/20 rounded-md-sm cursor-pointer transition-colors"
                title="Remove education"
                aria-label="Remove education"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4 pr-7">
                <div>
                  <Label>Degree / Certification</Label>
                  <Input
                    type="text"
                    value={edu.certification}
                    onChange={(e) => handleUpdateEducation(idx, 'certification', e.target.value)}
                    placeholder="e.g. Master of Science in Computer Science"
                  />
                </div>

                <div>
                  <Label>University / Institution</Label>
                  <Input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                    placeholder="e.g. National Technical University"
                  />
                </div>

                <div>
                  <Label>Graduation Year / Period</Label>
                  <Input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                    placeholder="e.g. 2018 — 2020"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handleAddEducationItem} variant="secondary" fullWidth className="gap-2">
            <Plus className="w-4 h-4 text-md-primary" /> Add Education
          </Button>
        </div>
      )}
    </div>
  );
};
