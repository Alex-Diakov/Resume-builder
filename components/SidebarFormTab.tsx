import React, { useState } from 'react';
import { 
  User, 
  Maximize2, 
  Briefcase, 
  Layers, 
  Settings, 
  GraduationCap, 
  Sliders, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Sparkles,
  Image,
  Upload
} from 'lucide-react';
import { ResumeData, ExperienceItem, ProjectItem, EducationItem } from '../types';
import { useResumeForm } from '../hooks/useResumeForm';
import { useResumeContext } from '../contexts/ResumeContext';

import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Label } from './ui/Label';


interface SidebarFormTabProps {
  resumeData: ResumeData;
  onChangeData: (data: ResumeData) => void;
  
  paddingTopBottom: number;
  setPaddingTopBottom: (val: number) => void;
  paddingLeftRight: number;
  setPaddingLeftRight: (val: number) => void;
  sectionSpacing: number;
  setSectionSpacing: (val: number) => void;
  itemSpacing: number;
  setItemSpacing: (val: number) => void;
  spacingPreset: 'standard' | 'compact' | 'super';
  onApplySpacingPreset: (preset: 'standard' | 'compact' | 'super') => void;
  showPageGuides: boolean;
  setShowPageGuides: (val: boolean) => void;
  autoFitContent: () => void;
  pageFraction: string;
}

export const SidebarFormTab: React.FC<SidebarFormTabProps> = ({
  resumeData,
  onChangeData,
  paddingTopBottom,
  setPaddingTopBottom,
  paddingLeftRight,
  setPaddingLeftRight,
  sectionSpacing,
  setSectionSpacing,
  itemSpacing,
  setItemSpacing,
  spacingPreset,
  onApplySpacingPreset,
  showPageGuides,
  setShowPageGuides,
  autoFitContent,
  pageFraction
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('personal');
  const [isDragging, setIsDragging] = useState(false);

  const { compressPdf, setCompressPdf, pdfImageQuality, setPdfImageQuality } = useResumeContext();

  const {
    photoError,
    handlePhotoFile,
    handleFieldChange,
    handleUpdateSummaryPara,
    handleAddSummaryPara,
    handleRemoveSummaryPara,
    handleUpdateExperience,
    handleUpdateHighlight,
    handleAddHighlight,
    handleRemoveHighlight,
    handleAddExperienceItem,
    handleRemoveExperienceItem,
    handleUpdateProject,
    handleUpdateDetailRow,
    handleAddDetailRow,
    handleRemoveDetailRow,
    handleAddProjectItem,
    handleRemoveProjectItem,
    handleUpdateSkillCategory,
    handleAddSkillCategory,
    handleRemoveSkillCategory,
    handleUpdateEducation,
    handleAddEducationItem,
    handleRemoveEducation
  } = useResumeForm(resumeData, onChangeData);

  // Handle accordion toggle
  const toggleAccordion = (sec: string) => {
    setActiveAccordion(activeAccordion === sec ? null : sec);
  };

  // General Form Handlers
  // Handlers are now provided by useResumeForm hook
  
  return (
    <div className="p-5 space-y-5 pb-16">

      {/* EXPANDABLE ACCORDIONS FOR SECTIONS */}
      
      {/* 1. PERSONAL DETAILS */}
      <div className={`border transition-all duration-200 ${
        activeAccordion === 'personal' 
          ? 'border-ds-border-focus bg-ds-active rounded-xl shadow-md shadow-glow' 
          : 'border-ds-border bg-ds-panel/60 rounded-xl hover:bg-ds-hover'
      }`}>
        <button 
          onClick={() => toggleAccordion('personal')}
          className="sticky top-0 z-10 w-full flex items-center justify-between p-4.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl bg-ds-panel/95 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="font-display tracking-wide text-ds-text-high">Personal Details</span>
          </div>
          {activeAccordion === 'personal' ? <ChevronDown className="w-4.5 h-4.5 text-ds-primary" /> : <ChevronRight className="w-4.5 h-4.5 text-ds-text-muted" />}
        </button>
        
        {activeAccordion === 'personal' && (
          <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-[#312e39]/50">
            {/* 1.1 Profile Photo Upload Section */}
            <div className="border border-[#49454f]/40 bg-[#1c1b21]/60 rounded-xl p-4.5 space-y-4">
              <Label>
                Resume Profile Photo
              </Label>

              {photoError && (
                <div id="photo-error-message" className="text-xs text-[#f2b8b5] bg-[#8c1d18]/15 border border-[#8c1d18]/30 px-3 py-2 rounded-lg font-medium animate-fade-in">
                  {photoError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Image Preview / Drag Area */}
                <div 
                  id="photo-drag-zone"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.length) { handlePhotoFile(e.dataTransfer.files[0]); } }}
                  onClick={() => document.getElementById('photo-upload-input')?.click()}
                  className={`w-24 h-24 shrink-0 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden group relative ${
                    resumeData.photo 
                      ? 'border-solid border-[#bb86fc]' 
                      : isDragging 
                        ? 'border-[#bb86fc] bg-[#bb86fc]/10' 
                        : 'border-[#49454f] hover:border-[#bb86fc]/60 hover:bg-[#1c1b21]'
                  }`}
                  title="Click or Drag & Drop photo here"
                >
                  {resumeData.photo ? (
                    <>
                      <img 
                        src={resumeData.photo} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-[#141218]/65 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-[10px] font-bold text-[#eaddff] uppercase text-center p-1">
                        <Upload className="w-4 h-4 mb-0.5 text-[#bb86fc]" />
                        Replace
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2 text-[#cac4d0]">
                      <Image className="w-4 h-4 mb-0.5 text-[#bb86fc]/80 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-semibold leading-tight">Drag / Click</span>
                    </div>
                  )}
                  <input 
                    id="photo-upload-input"
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => { if (e.target.files?.length) { handlePhotoFile(e.target.files[0]); } }}
                    className="hidden" 
                  />
                </div>

                {/* Photo Action / Toggle Controls */}
                <div className="flex-1 space-y-2.5 w-full">
                  <div className="text-xs text-[#cac4d0]/80">
                    <p className="font-medium text-[11px]">Upload resume profile image.</p>
                    <p className="text-[9.5px] text-[#cac4d0]/50 mt-0.5">Square crop works best. Max 2MB.</p>
                  </div>

                  {resumeData.photo ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-[#141218]/50 border border-[#49454f]/40 py-1.5 px-2.5 rounded-lg">
                        <span className="text-[10px] font-semibold text-[#e6e1e5]">Show on resume</span>
                        <button
                          id="toggle-photo-display"
                          type="button"
                          onClick={() => handleFieldChange('showPhoto', !(resumeData.showPhoto !== false))}
                          className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[#bb86fc]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel ${
                            resumeData.showPhoto !== false ? 'bg-[#bb86fc]' : 'bg-[#49454f]'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              resumeData.showPhoto !== false ? 'translate-x-3.5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <button
                        id="remove-photo-button"
                        type="button"
                        onClick={() => {
                          const updated = { ...resumeData };
                          delete updated.photo;
                          onChangeData(updated);
                        }}
                        className="w-full py-1 bg-[#8c1d18]/10 hover:bg-[#8c1d18]/25 text-[#f2b8b5] border border-[#8c1d18]/30 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[#f2b8b5]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel"
                      >
                        Delete Photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => document.getElementById('photo-upload-input')?.click()}
                      className="w-full py-1.5 px-3 bg-[#eaddff]/10 hover:bg-[#eaddff]/20 text-[#bb86fc] border border-[#49454f] rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer"
                    >
                      Select Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>Full Name</Label>
              <Input type="text" value={resumeData.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="e.g. Alex Diakov" />
            </div>
            <div>
              <Label>Professional Title</Label>
              <Input type="text" value={resumeData.title} onChange={(e) => handleFieldChange('title', e.target.value)} placeholder="e.g. Product Ventures & Innovation" />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <Label>Email Address</Label>
                <Input type="email" value={resumeData.contact.email} onChange={(e) => handleFieldChange('contact.email', e.target.value)}  />
              </div>
              <div>
                <Label>Location / City</Label>
                <Input type="text" value={resumeData.contact.location} onChange={(e) => handleFieldChange('contact.location', e.target.value)}  />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <Label>Portfolio URL</Label>
                <Input type="text" value={resumeData.contact.website} onChange={(e) => handleFieldChange('contact.website', e.target.value)}  />
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <Input type="text" value={resumeData.contact.linkedin} onChange={(e) => handleFieldChange('contact.linkedin', e.target.value)}  />
              </div>
              <div>
                <Label>Video Pitch (Loom / YouTube)</Label>
                <Input type="text" value={resumeData.contact.videoPitch || ''} onChange={(e) => handleFieldChange('contact.videoPitch', e.target.value)} placeholder="https://loom.com/..." />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. SUMMARY PARAGRAPHS */}
      <div className={`border transition-all duration-200 ${
        activeAccordion === 'summary' 
          ? 'border-ds-border-focus bg-ds-active rounded-xl shadow-md shadow-glow' 
          : 'border-ds-border bg-ds-panel/60 rounded-xl hover:bg-ds-hover'
      }`}>
        <button 
          onClick={() => toggleAccordion('summary')}
          className="sticky top-0 z-10 w-full flex items-center justify-between p-4.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl bg-ds-panel/95 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <Maximize2 className={`w-4.5 h-4.5 transition-colors duration-200 ${activeAccordion === 'summary' ? 'text-ds-primary' : 'text-ds-text-muted'}`} />
            <span className="font-display tracking-wide text-ds-text-high">Professional Summary</span>
          </div>
          {activeAccordion === 'summary' ? <ChevronDown className="w-4.5 h-4.5 text-ds-primary" /> : <ChevronRight className="w-4.5 h-4.5 text-ds-text-muted" />}
        </button>
        
        {activeAccordion === 'summary' && (
          <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-ds-border">
            {(resumeData.summary || []).map((para, i) => (
              <div key={i} className="flex gap-2.5 animate-fade-in">
                <Textarea value={para} onChange={(e) => handleUpdateSummaryPara(i, e.target.value)} placeholder="Write summary paragraph describing key achievements..." />
                <button 
                  onClick={() => handleRemoveSummaryPara(i)}
                  className="p-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer transition-colors self-start focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-rose-400/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel"
                  title="Delete paragraph"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button onClick={handleAddSummaryPara} variant="secondary" fullWidth className="gap-2"><Plus className="w-4 h-4" /> Add Paragraph
            </Button>
          </div>
        )}
      </div>

      {/* 3. WORKING EXPERIENCE HISTORY */}
      <div className={`border transition-all duration-200 ${
        activeAccordion === 'experience' 
          ? 'border-ds-border-focus bg-ds-active rounded-xl shadow-md shadow-glow' 
          : 'border-ds-border bg-ds-panel/60 rounded-xl hover:bg-ds-hover'
      }`}>
        <button 
          onClick={() => toggleAccordion('experience')}
          className="sticky top-0 z-10 w-full flex items-center justify-between p-4.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl bg-ds-panel/95 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="font-display tracking-wide text-ds-text-high">Work Experience ({resumeData.experience?.length || 0})</span>
          </div>
          {activeAccordion === 'experience' ? <ChevronDown className="w-4.5 h-4.5 text-ds-primary" /> : <ChevronRight className="w-4.5 h-4.5 text-ds-text-muted" />}
        </button>
        
        {activeAccordion === 'experience' && (
          <div className="px-5 pb-5 pt-1 space-y-5 bg-transparent border-t border-ds-border">
            {(resumeData.experience || []).map((exp, expIdx) => (
              <div key={expIdx} className="bg-ds-container rounded-xl p-4.5 border border-ds-border relative animate-fade-in">
                <button 
                  onClick={() => handleRemoveExperienceItem(expIdx)}
                  className="absolute top-3.5 right-3.5 p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-rose-400/50"
                  title="Remove work"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                
                <div className="space-y-3 mt-2 pr-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Role / Title</Label>
                      <Input type="text" value={exp.role} onChange={(e) => handleUpdateExperience(expIdx, 'role', e.target.value)}  />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input type="text" value={exp.company} onChange={(e) => handleUpdateExperience(expIdx, 'company', e.target.value)}  />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Duration (e.g., Jan 2021 - Present)</Label>
                      <Input type="text" value={exp.duration} onChange={(e) => handleUpdateExperience(expIdx, 'duration', e.target.value)}  />
                    </div>
                    <div>
                      <Label>Employment Type</Label>
                      <Input type="text" value={exp.type} onChange={(e) => handleUpdateExperience(expIdx, 'type', e.target.value)}  />
                    </div>
                  </div>

                  {/* Highlights Bullet Rows */}
                  <div className="space-y-3 mt-3 border-t border-[#312e39]/50 pt-3">
                    <span className="block text-[9px] text-[#cac4d0] font-semibold uppercase tracking-wider">Key Achievements:</span>
                    {(exp.highlights || []).map((h, hIdx) => (
                      <div key={hIdx} className="bg-[#1c1b21] p-3 rounded-lg border border-[#49454f]/50 space-y-2 relative animate-fade-in">
                        <button 
                          onClick={() => handleRemoveHighlight(expIdx, hIdx)}
                          className="absolute top-1.5 right-1.5 p-1.5 text-[#f2b8b5] hover:bg-[#8c1d18]/20 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[#f2b8b5]/50"
                          title="Remove highlight"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div>
                          <Label>Achievement Title</Label>
                          <Input type="text" value={h.title} onChange={(e) => handleUpdateHighlight(expIdx, hIdx, 'title', e.target.value)}  />
                        </div>
                        <div>
                          <Label>Outcome Description (numbers are auto-bolded)</Label>
                          <Textarea value={h.description} onChange={(e) => handleUpdateHighlight(expIdx, hIdx, 'description', e.target.value)} rows={2} />
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => handleAddHighlight(expIdx)} variant="secondary" size="sm" fullWidth className="gap-1.5"><Plus className="w-3 h-3 text-ds-primary" /> Add Highlight
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={handleAddExperienceItem} variant="secondary" fullWidth className="gap-2"><Plus className="w-4 h-4" /> Add Experience
            </Button>
          </div>
        )}
      </div>

      {/* 4. PRODUCT VENTURES & PROJECTS */}
      <div className={`border transition-all duration-200 ${
        activeAccordion === 'projects' 
          ? 'border-ds-border-focus bg-ds-active rounded-xl shadow-md shadow-glow' 
          : 'border-ds-border bg-ds-panel/60 rounded-xl hover:bg-ds-hover'
      }`}>
        <button 
          onClick={() => toggleAccordion('projects')}
          className="sticky top-0 z-10 w-full flex items-center justify-between p-4.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl bg-ds-panel/95 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="font-display tracking-wide text-ds-text-high">Projects & Innovations ({resumeData.projects?.length || 0})</span>
          </div>
          {activeAccordion === 'projects' ? <ChevronDown className="w-4.5 h-4.5 text-ds-primary" /> : <ChevronRight className="w-4.5 h-4.5 text-ds-text-muted" />}
        </button>
        
        {activeAccordion === 'projects' && (
          <div className="px-5 pb-5 pt-1 space-y-5 bg-transparent border-t border-[#312e39]/50">
            {(resumeData.projects || []).map((proj, pIdx) => (
              <div key={pIdx} className="bg-[#201e25] rounded-xl p-4.5 border border-[#312e39] relative animate-fade-in font-sans">
                <button 
                  onClick={() => handleRemoveProjectItem(pIdx)}
                  className="absolute top-3.5 right-3.5 p-2 text-[#f2b8b5] hover:bg-[#8c1d18]/20 rounded-full cursor-pointer"
                  title="Remove project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                
                <div className="space-y-3 mt-2 pr-6 font-sans">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Project Name</Label>
                      <Input type="text" value={proj.title} onChange={(e) => handleUpdateProject(pIdx, 'title', e.target.value)}  />
                    </div>
                    <div>
                      <Label>Your Role</Label>
                      <Input type="text" value={proj.role} onChange={(e) => handleUpdateProject(pIdx, 'role', e.target.value)}  />
                    </div>
                  </div>

                  <div>
                    <Label>Brief Description</Label>
                    <Textarea value={proj.description} onChange={(e) => handleUpdateProject(pIdx, 'description', e.target.value)} rows={2} />
                  </div>

                  {/* Detail Label/Values */}
                  <div className="space-y-3 mt-3 border-t border-[#312e39]/50 pt-3">
                    <span className="block text-[9px] text-[#cac4d0] font-semibold uppercase tracking-wider">Project Details:</span>
                    {(proj.details || []).map((d, dIdx) => (
                      <div key={dIdx} className="flex gap-2 items-center animate-fade-in font-sans">
                        <Input type="text" value={d.label} onChange={(e) => handleUpdateDetailRow(pIdx, dIdx, 'label', e.target.value)} placeholder="Label (e.g. Impact)" />
                        <Input type="text" value={d.value} onChange={(e) => handleUpdateDetailRow(pIdx, dIdx, 'value', e.target.value)} placeholder="Details index..." />
                        <button 
                          onClick={() => handleRemoveDetailRow(pIdx, dIdx)}
                          className="p-1.5 text-[#f2b8b5] hover:bg-[#8c1d18]/15 rounded-full cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <Button onClick={() => handleAddDetailRow(pIdx)} variant="secondary" size="sm" fullWidth className="gap-1.5"><Plus className="w-3 h-3 text-ds-primary" /> Add Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={handleAddProjectItem} variant="secondary" fullWidth className="gap-2"><Plus className="w-4 h-4" /> Add Project
            </Button>
          </div>
        )}
      </div>

      {/* 5. CORE COMPETENCIES / SKILLS */}
      <div className={`border transition-all duration-200 ${
        activeAccordion === 'skills' 
          ? 'border-ds-border-focus bg-ds-active rounded-xl shadow-md shadow-glow' 
          : 'border-ds-border bg-ds-panel/60 rounded-xl hover:bg-ds-hover'
      }`}>
        <button 
          onClick={() => toggleAccordion('skills')}
          className="sticky top-0 z-10 w-full flex items-center justify-between p-4.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl bg-ds-panel/95 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="font-display tracking-wide text-ds-text-high">Skills & Competencies</span>
          </div>
          {activeAccordion === 'skills' ? <ChevronDown className="w-4.5 h-4.5 text-ds-primary" /> : <ChevronRight className="w-4.5 h-4.5 text-ds-text-muted" />}
        </button>
        
        {activeAccordion === 'skills' && (
          <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-[#312e39]/50">
            {Object.entries(resumeData.skills || {}).map(([category, skills]) => (
              <div key={category} className="bg-[#201e25] rounded-xl p-4.5 border border-[#312e39] relative space-y-2 animate-fade-in">
                <button 
                  onClick={() => handleRemoveSkillCategory(category)}
                  className="absolute top-3.5 right-3.5 p-2 text-[#f2b8b5] hover:bg-[#8c1d18]/25 rounded-full cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 animate-fade-in" />
                </button>
                
                <div className="pr-6">
                  <Label>Category (e.g., Frontend, Backend)</Label>
                  <Input type="text" defaultValue={category} onBlur={(e) => handleUpdateSkillCategory(category, e.target.value, skills)} />
                </div>
                <div>
                  <Label>Skills (comma-separated)</Label>
                  <Textarea value={skills} onChange={(e) => handleUpdateSkillCategory(category, category, e.target.value)} rows={2} />
                </div>
              </div>
            ))}
            <Button onClick={handleAddSkillCategory} variant="secondary" fullWidth className="gap-2"><Plus className="w-4 h-4" /> Add Skill Category
            </Button>
          </div>
        )}
      </div>

      {/* 6. EDUCATION HISTORY */}
      <div className={`border transition-all duration-200 ${
        activeAccordion === 'education' 
          ? 'border-ds-border-focus bg-ds-active rounded-xl shadow-md shadow-glow' 
          : 'border-ds-border bg-ds-panel/60 rounded-xl hover:bg-ds-hover'
      }`}>
        <button 
          onClick={() => toggleAccordion('education')}
          className="sticky top-0 z-10 w-full flex items-center justify-between p-4.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl bg-ds-panel/95 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="font-display tracking-wide text-ds-text-high">Education ({resumeData.education?.length || 0})</span>
          </div>
          {activeAccordion === 'education' ? <ChevronDown className="w-4.5 h-4.5 text-ds-primary" /> : <ChevronRight className="w-4.5 h-4.5 text-ds-text-muted" />}
        </button>
        {activeAccordion === 'education' && (
          <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-[#312e39]/50">
            {(resumeData.education || []).map((edu, idx) => (
              <div key={idx} className="bg-ds-container rounded-xl p-4.5 border border-ds-border relative space-y-2 animate-fade-in font-sans">
                 <button 
                   onClick={() => handleRemoveEducation(idx)}
                   className="absolute top-3.5 right-3.5 p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer transition-colors"
                 >
                   <Trash2 className="w-3.5 h-3.5" />
                 </button>

                 <div className="grid grid-cols-2 gap-3 pr-6">
                   <div>
                     <Label>Degree / Certification</Label>
                     <Input type="text" value={edu.certification} onChange={(e) => handleUpdateEducation(idx, 'certification', e.target.value)}  />
                   </div>
                   <div>
                     <Label>Institution Name</Label>
                     <Input type="text" value={edu.institution} onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}  />
                   </div>
                 </div>

                 <div className="font-sans">
                    <Label>Graduation Year</Label>
                    <Input type="text" value={edu.year} onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}  />
                  </div>
               </div>
            ))}
            <Button onClick={handleAddEducationItem} variant="secondary" fullWidth className="gap-2"><Plus className="w-4 h-4" /> Add Education
            </Button>
          </div>
        )}
      </div>

      {/* 7. LAYOUT CALIBRATION CONTROLS */}
      <div className={`border transition-all duration-200 ${
        activeAccordion === 'layout' 
          ? 'border-ds-border-focus bg-ds-active rounded-xl shadow-md shadow-glow' 
          : 'border-ds-border bg-ds-panel/60 rounded-xl hover:bg-ds-hover'
      }`}>
        <button 
          onClick={() => toggleAccordion('layout')}
          className="sticky top-0 z-10 w-full flex items-center justify-between p-4.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl bg-ds-panel/95 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span className="font-display tracking-wide text-ds-text-high">Layout & Formatting</span>
          </div>
          {activeAccordion === 'layout' ? <ChevronDown className="w-4.5 h-4.5 text-ds-primary" /> : <ChevronRight className="w-4.5 h-4.5 text-ds-text-muted" />}
        </button>

        {activeAccordion === 'layout' && (
          <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-[#312e39]/50 animate-fade-in font-sans">
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] text-ds-text-muted font-bold uppercase tracking-wider font-display">Auto-Formatting</span>
              <Button onClick={autoFitContent} title="Automatically adjust spacing so the content flows beautifully into exactly 2 pages" className="h-auto py-1.5 px-3 text-[10px] gap-1.5 rounded-xl shadow-glow">
                <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>Auto-Fit 2 Pages</span>
              </Button>
            </div>

            {/* PRESET PILLS */}
            <div className="space-y-2">
              <span className="block text-[10px] text-ds-text-muted font-bold uppercase tracking-wider font-display">Content Density</span>
              <div className="grid grid-cols-3 gap-2">
                {['standard', 'compact', 'super'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onApplySpacingPreset(preset as any)}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider text-center cursor-pointer select-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel ${
                      spacingPreset === preset 
                        ? 'bg-ds-primary text-white border-ds-primary-hover shadow-md' 
                        : 'bg-ds-active text-ds-text-medium border-ds-border hover:bg-ds-hover hover:text-ds-text-high'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* FINE TUNING SLIDERS */}
            <div className="space-y-4 pt-1 font-sans">
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[10px] text-ds-text-medium font-bold uppercase tracking-wider">Top/Bottom Padding</span>
                  <span className="text-sm text-ds-text-high font-mono font-bold">{paddingTopBottom}mm</span>
                </div>
                <Slider 
                  min={5} 
                  max={20} 
                  step={0.5} 
                  value={paddingTopBottom} 
                  onChange={(e) => setPaddingTopBottom(parseFloat(e.target.value))}
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[10px] text-ds-text-medium font-bold uppercase tracking-wider">Left/Right Padding</span>
                  <span className="text-sm text-ds-text-high font-mono font-bold">{paddingLeftRight}mm</span>
                </div>
                <Slider 
                  min={8} 
                  max={20} 
                  step={0.5} 
                  value={paddingLeftRight} 
                  onChange={(e) => setPaddingLeftRight(parseFloat(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[9px] text-ds-text-muted font-bold uppercase tracking-wider">Section Spacing</span>
                    <span className="text-sm text-ds-text-high font-mono font-bold">{Math.round(sectionSpacing * 100)}%</span>
                  </div>
                  <Slider 
                    min={0.5} 
                    max={1.5} 
                    step={0.05} 
                    value={sectionSpacing} 
                    onChange={(e) => setSectionSpacing(parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[9px] text-ds-text-muted font-bold uppercase tracking-wider">Item Spacing</span>
                    <span className="text-sm text-ds-text-high font-mono font-bold">{Math.round(itemSpacing * 100)}%</span>
                  </div>
                  <Slider 
                    min={0.4} 
                    max={1.5} 
                    step={0.05} 
                    value={itemSpacing} 
                    onChange={(e) => setItemSpacing(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* PAGE GUIDE TOGGLE */}
            <div className="flex items-center justify-between pt-3 border-t border-ds-border font-sans">
              <span className="text-[10px] text-ds-text-medium font-bold uppercase tracking-wider transition-colors">Show A4 Page Guides</span>
              <Switch checked={showPageGuides} onCheckedChange={setShowPageGuides} />
            </div>
            <div className="text-[10px] text-ds-text-muted/80 text-center leading-normal pt-1.5 border-t border-ds-border/30">
              Content density scale: <strong className="text-ds-primary font-mono">{pageFraction}</strong>
            </div>
          </div>
        )}
      </div>



    </div>
  );
};
