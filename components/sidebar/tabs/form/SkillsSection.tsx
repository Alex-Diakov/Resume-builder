import React from 'react';
import { Sliders, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button, Input, Label, Textarea } from '../../../ui';

interface SkillsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  skills: Record<string, string>;
  handleUpdateSkillCategory: (oldCat: string, newCat: string, skills: string) => void;
  handleAddSkillCategory: () => void;
  handleRemoveSkillCategory: (cat: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  isOpen,
  onToggle,
  skills,
  handleUpdateSkillCategory,
  handleAddSkillCategory,
  handleRemoveSkillCategory,
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
          <Sliders className={`w-5 h-5 transition-colors ${isOpen ? 'text-md-primary' : 'text-md-on-surface-variant'}`} />
          <span className="font-display tracking-wide">Skills & Competencies</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-md-primary" /> : <ChevronRight className="w-5 h-5 text-md-on-surface-variant" />}
      </button>

      {isOpen && (
        <div className="p-5 space-y-4 bg-transparent">
          {Object.entries(skills || {}).map(([category, skillList]) => (
            <div key={category} className="bg-white/[0.02] rounded-md-md p-4.5 border border-white/[0.06] relative space-y-3.5 hover:border-white/[0.14] transition-colors animate-fade-in">
              <button
                onClick={() => handleRemoveSkillCategory(category)}
                className="absolute top-3.5 right-3.5 p-1.5 text-md-error hover:text-md-error hover:bg-md-error-container/20 rounded-md-sm cursor-pointer transition-colors"
                title="Remove category"
                aria-label="Remove category"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="pr-7">
                <Label>Category Domain</Label>
                <Input
                  type="text"
                  defaultValue={category}
                  onBlur={(e) => handleUpdateSkillCategory(category, e.target.value, String(skillList))}
                  placeholder="e.g. Behavioral Architecture, Prototyping"
                />
              </div>
              <div>
                <Label>Skills & Tools (comma-separated)</Label>
                <Textarea
                  value={skillList}
                  onChange={(e) => handleUpdateSkillCategory(category, category, e.target.value)}
                  placeholder="Figma, Design Tokens, User Journey Mapping, Storybook, React..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          <Button onClick={handleAddSkillCategory} variant="secondary" fullWidth className="gap-2">
            <Plus className="w-4 h-4 text-md-primary" /> Add Skill Category
          </Button>
        </div>
      )}
    </div>
  );
};
