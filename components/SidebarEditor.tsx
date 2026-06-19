import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileJson, 
  Code2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Briefcase, 
  GraduationCap, 
  User, 
  Layers, 
  Sliders, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Maximize2,
  Brain,
  Eye,
  Clock,
  AlertCircle,
  Zap,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { ResumeData, ExperienceItem, ProjectItem, EducationItem } from '../types';
import { RESUME_PRESETS } from '../constants';

interface SidebarEditorProps {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  atsInput: string;
  setAtsInput: (val: string) => void;
  jsonError: string | null;
  activeTab: 'form' | 'json' | 'ats';
  setActiveTab: (tab: 'form' | 'json' | 'ats') => void;
  
  // Spacing & Layout controls
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
  
  // Resume Data for direct form-bindings
  resumeData: ResumeData;
  onChangeData: (data: ResumeData) => void;
  autoFitContent: () => void;
  pageFraction: string;
}

export const SidebarEditor: React.FC<SidebarEditorProps> = ({
  jsonInput,
  setJsonInput,
  atsInput,
  setAtsInput,
  jsonError,
  activeTab,
  setActiveTab,
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
  resumeData,
  onChangeData,
  autoFitContent,
  pageFraction
}) => {
  const [copied, setCopied] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('personal');
  const [atsScore, setAtsScore] = useState<{ score: number; matched: string[]; missing: string[] }>({ score: 0, matched: [], missing: [] });

  // Cognitive Analysis & Attention Laws State Hub
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzerWarning, setAnalyzerWarning] = useState<string | null>(null);
  const [analyzedDataString, setAnalyzedDataString] = useState<string>('');

  const runCognitiveAnalysis = async () => {
    const dataToAnalyze = JSON.stringify(resumeData);
    setAnalyzing(true);
    setAnalyzerWarning(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resumeData })
      });
      if (!response.ok) {
        throw new Error("Diagnostic server returned error status " + response.status);
      }
      const data = await response.json();
      setAnalysisResult(data);
      setAnalyzedDataString(dataToAnalyze);
      if (data.warning) {
        setAnalyzerWarning(data.warning);
      }
    } catch (err: any) {
      console.error(err);
      setAnalyzerWarning("Connection error: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyRewrite = (original: string, replacement: string) => {
    const updated = { ...resumeData };
    let found = false;
    
    // Check Title
    if (updated.title === original) {
      updated.title = replacement;
      found = true;
    }
    
    // Check Summary Paragraphs
    if (!found && Array.isArray(updated.summary)) {
      const idx = updated.summary.indexOf(original);
      if (idx !== -1) {
        updated.summary[idx] = replacement;
        found = true;
      }
    }
    
    // Check Experience Highlights
    if (!found && Array.isArray(updated.experience)) {
      updated.experience = updated.experience.map(exp => {
        if (exp.highlights) {
          return {
            ...exp,
            highlights: exp.highlights.map(h => {
              if (h.description === original) {
                found = true;
                return { ...h, description: replacement };
              }
              if (h.title === original) {
                found = true;
                return { ...h, title: replacement };
              }
              return h;
            })
          };
        }
        return exp;
      });
    }

    // Check Project Details and description
    if (!found && Array.isArray(updated.projects)) {
      updated.projects = updated.projects.map(p => {
        if (p.description === original) {
          found = true;
          return { ...p, description: replacement };
        }
        if (p.details) {
          return {
            ...p,
            details: p.details.map(d => {
              if (d.value === original) {
                found = true;
                return { ...d, value: replacement };
              }
              return d;
            })
          };
        }
        return p;
      });
    }
    
    if (found) {
      onChangeData(updated);
      setJsonInput(JSON.stringify(updated, null, 2));
      setAnalyzedDataString(JSON.stringify(updated));
      
      // Filter out or mark as applied
      if (analysisResult && analysisResult.rewrites) {
        setAnalysisResult({
          ...analysisResult,
          rewrites: analysisResult.rewrites.filter((r: any) => r.original !== original)
        });
      }
    } else {
      // Fuzzy substring match backup
      let fuzzyMatch = false;
      if (Array.isArray(updated.experience)) {
        updated.experience = updated.experience.map(exp => {
          if (exp.highlights) {
            return {
              ...exp,
              highlights: exp.highlights.map(h => {
                if (h.description.includes(original) || original.includes(h.description)) {
                  fuzzyMatch = true;
                  return { ...h, description: replacement };
                }
                return h;
              })
            };
          }
          return exp;
        });
      }
      
      if (fuzzyMatch) {
        onChangeData(updated);
        setJsonInput(JSON.stringify(updated, null, 2));
        setAnalyzedDataString(JSON.stringify(updated));
        if (analysisResult && analysisResult.rewrites) {
          setAnalysisResult({
            ...analysisResult,
            rewrites: analysisResult.rewrites.filter((r: any) => r.original !== original)
          });
        }
      } else {
        alert("Located with slight variations: Copy replacement line manually or edit fields directly.");
      }
    }
  };

  // Trigger analysis automatically on switching to the tab if the data has been modified
  useEffect(() => {
    if (activeTab === 'ats' && !analyzing) {
      const currentDataStr = JSON.stringify(resumeData);
      if (currentDataStr !== analyzedDataString) {
        runCognitiveAnalysis();
      }
    }
  }, [activeTab]);

  // Handle accordion toggle
  const toggleAccordion = (sec: string) => {
    setActiveAccordion(activeAccordion === sec ? null : sec);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to load a dynamic preset
  const handleLoadPreset = (key: string) => {
    const preset = RESUME_PRESETS[key];
    if (preset) {
      onChangeData(preset.data);
    }
  };

  // Calculate ATS matches in background
  useEffect(() => {
    if (!atsInput.trim()) {
      setAtsScore({ score: 0, matched: [], missing: [] });
      return;
    }

    // Extract all keywords from ATS input
    const keywords = atsInput
      .split(/[,\n;]/)
      .map(k => k.trim())
      .filter(k => k.length > 1);

    if (keywords.length === 0) {
      setAtsScore({ score: 0, matched: [], missing: [] });
      return;
    }

    // Compile entire resume text content
    const resumeTextParts: string[] = [
      resumeData.name,
      resumeData.title,
      ...(resumeData.summary || []),
      ...(resumeData.experience || []).flatMap(exp => [
        exp.role,
        exp.company,
        ...(exp.highlights || []).flatMap(h => [h.title, h.description])
      ]),
      ...(resumeData.projects || []).flatMap(p => [
        p.title,
        p.role,
        p.description,
        ...(p.details || []).map(d => d.value)
      ]),
      ...Object.entries(resumeData.skills || {}).flatMap(([cat, s]) => [cat, s]),
      ...(resumeData.education || []).flatMap(e => [e.institution, e.certification])
    ];

    const compositeText = resumeTextParts.join(' ').toLowerCase();
    const matched: string[] = [];
    const missing: string[] = [];

    keywords.forEach(kw => {
      const lower = kw.toLowerCase();
      // Search exact boundary or clear inclusion
      const escapedKw = lower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const boundaryRegex = new RegExp(`\\b${escapedKw}\\b`, 'i');
      
      if (boundaryRegex.test(compositeText) || compositeText.includes(lower)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const score = Math.round((matched.length / keywords.length) * 100);
    setAtsScore({ score, matched, missing });
  }, [atsInput, resumeData]);

  // General Form Handlers
  const handleFieldChange = (path: string, val: any) => {
    const updated = { ...resumeData };
    if (path.startsWith('contact.')) {
      const field = path.split('.')[1];
      updated.contact = { ...updated.contact, [field]: val };
    } else {
      (updated as any)[path] = val;
    }
    onChangeData(updated);
  };

  const handleUpdateSummaryPara = (index: number, val: string) => {
    const newSummary = [...(resumeData.summary || [])];
    newSummary[index] = val;
    handleFieldChange('summary', newSummary);
  };

  const handleAddSummaryPara = () => {
    const newSummary = [...(resumeData.summary || []), ''];
    handleFieldChange('summary', newSummary);
  };

  const handleRemoveSummaryPara = (index: number) => {
    const newSummary = (resumeData.summary || []).filter((_, idx) => idx !== index);
    handleFieldChange('summary', newSummary);
  };

  // Experience Handlers
  const handleUpdateExperience = (itemIndex: number, field: keyof ExperienceItem, val: any) => {
    const updatedExp = [...(resumeData.experience || [])];
    updatedExp[itemIndex] = { ...updatedExp[itemIndex], [field]: val };
    handleFieldChange('experience', updatedExp);
  };

  const handleUpdateHighlight = (expIndex: number, hIndex: number, field: 'title' | 'description', val: string) => {
    const updatedExp = [...(resumeData.experience || [])];
    const item = { ...updatedExp[expIndex] };
    const highlights = [...(item.highlights || [])];
    highlights[hIndex] = { ...highlights[hIndex], [field]: val };
    item.highlights = highlights;
    updatedExp[expIndex] = item;
    handleFieldChange('experience', updatedExp);
  };

  const handleAddHighlight = (expIndex: number) => {
    const updatedExp = [...(resumeData.experience || [])];
    const item = { ...updatedExp[expIndex] };
    item.highlights = [...(item.highlights || []), { title: 'New Result', description: 'Describe quantified achievement...' }];
    updatedExp[expIndex] = item;
    handleFieldChange('experience', updatedExp);
  };

  const handleRemoveHighlight = (expIndex: number, hIndex: number) => {
    const updatedExp = [...(resumeData.experience || [])];
    const item = { ...updatedExp[expIndex] };
    item.highlights = (item.highlights || []).filter((_, idx) => idx !== hIndex);
    updatedExp[expIndex] = item;
    handleFieldChange('experience', updatedExp);
  };

  const handleAddExperienceItem = () => {
    const newItem: ExperienceItem = {
      role: 'Role Title',
      company: 'Company Name',
      duration: 'Year – Year',
      type: 'Full-time',
      highlights: [
        { title: "Key Outcome", description: "Describe a scalable result here." }
      ]
    };
    handleFieldChange('experience', [...(resumeData.experience || []), newItem]);
  };

  const handleRemoveExperienceItem = (index: number) => {
    const list = (resumeData.experience || []).filter((_, idx) => idx !== index);
    handleFieldChange('experience', list);
  };

  // Projects handlers
  const handleUpdateProject = (pIndex: number, field: keyof ProjectItem, val: any) => {
    const list = [...(resumeData.projects || [])];
    list[pIndex] = { ...list[pIndex], [field]: val };
    handleFieldChange('projects', list);
  };

  const handleUpdateDetailRow = (pIndex: number, dIndex: number, field: 'label' | 'value', val: string) => {
    const list = [...(resumeData.projects || [])];
    const proj = { ...list[pIndex] };
    const details = [...(proj.details || [])];
    details[dIndex] = { ...details[dIndex], [field]: val };
    proj.details = details;
    list[pIndex] = proj;
    handleFieldChange('projects', list);
  };

  const handleAddDetailRow = (pIndex: number) => {
    const list = [...(resumeData.projects || [])];
    const proj = { ...list[pIndex] };
    proj.details = [...(proj.details || []), { label: 'New Metric', value: 'Value' }];
    list[pIndex] = proj;
    handleFieldChange('projects', list);
  };

  const handleRemoveDetailRow = (pIndex: number, dIndex: number) => {
    const list = [...(resumeData.projects || [])];
    const proj = { ...list[pIndex] };
    proj.details = (proj.details || []).filter((_, idx) => idx !== dIndex);
    list[pIndex] = proj;
    handleFieldChange('projects', list);
  };

  const handleAddProjectItem = () => {
    const newItem: ProjectItem = {
      title: "New Venture",
      role: "Lead Designer",
      description: "Brief description of innovation background.",
      details: [
        { label: "Engineering", value: "React stack execution" }
      ]
    };
    handleFieldChange('projects', [...(resumeData.projects || []), newItem]);
  };

  const handleRemoveProjectItem = (index: number) => {
    const list = (resumeData.projects || []).filter((_, idx) => idx !== index);
    handleFieldChange('projects', list);
  };

  // Core Competencies / Skills Handlers
  const handleUpdateSkillCategory = (oldCategory: string, newCategory: string, skills: string) => {
    const skillsCopy = { ...resumeData.skills };
    if (oldCategory !== newCategory) {
      delete skillsCopy[oldCategory];
    }
    skillsCopy[newCategory] = skills;
    handleFieldChange('skills', skillsCopy);
  };

  const handleAddSkillCategory = () => {
    const skillsCopy = { ...resumeData.skills, "New Category": "List keywords..." };
    handleFieldChange('skills', skillsCopy);
  };

  const handleRemoveSkillCategory = (cat: string) => {
    const skillsCopy = { ...resumeData.skills };
    delete skillsCopy[cat];
    handleFieldChange('skills', skillsCopy);
  };

  // Education Handlers
  const handleUpdateEducation = (idx: number, field: keyof EducationItem, val: string) => {
    const list = [...(resumeData.education || [])];
    list[idx] = { ...list[idx], [field]: val };
    handleFieldChange('education', list);
  };

  const handleAddEducationItem = () => {
    const newItem: EducationItem = {
      institution: "Institution Name",
      certification: "Degree Certification Name",
      year: "2024"
    };
    handleFieldChange('education', [...(resumeData.education || []), newItem]);
  };

  const handleRemoveEducation = (idx: number) => {
    const list = (resumeData.education || []).filter((_, i) => i !== idx);
    handleFieldChange('education', list);
  };

  return (
    <div className="flex flex-col h-full bg-[#141218] border-r border-[#2d2a33] w-full shrink-0 print:hidden shadow-2xl z-20 font-sans">
      {/* Tab Selectors using Sleek Minimalist Underline Design with sliding accent underline */}
      <div className="flex bg-[#141218] px-4 py-2 gap-1 shrink-0 border-b border-[#2d2a33]">
        <motion.button
          onClick={() => setActiveTab('form')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-3 py-3 rounded-xl text-[11px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 ${
            activeTab === 'form' ? 'text-white' : 'text-[#cac4d0] hover:text-[#d3bbff]'
          }`}
        >
          <Sliders className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'form' ? 'text-[#eaddff]' : 'text-[#cac4d0] group-hover:text-[#d3bbff]'}`} />
          <span>Forms Edit</span>
          {activeTab === 'form' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#9a6eff] rounded-full shadow-[0_1px_10px_rgba(154,110,255,0.7)]"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('json')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-3 py-3 rounded-xl text-[11px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 ${
            activeTab === 'json' ? 'text-white' : 'text-[#cac4d0] hover:text-[#b2f293]'
          }`}
        >
          <Code2 className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'json' ? 'text-[#b2f293]' : 'text-[#cac4d0] group-hover:text-[#b2f293]'}`} />
          <span>JSON Data</span>
          {activeTab === 'json' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#7ed348] rounded-full shadow-[0_1px_10px_rgba(126,211,72,0.7)]"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('ats')}
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-3 py-3 rounded-xl text-[11px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 ${
            activeTab === 'ats' ? 'text-white' : 'text-[#cac4d0] hover:text-cyan-300'
          }`}
        >
          <div className="relative">
            <Eye className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'ats' ? 'text-cyan-400' : 'text-[#cac4d0] group-hover:text-cyan-300'}`} />
            {activeTab === 'ats' && (
              <span className="absolute -top-0.5 -right-1.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
              </span>
            )}
          </div>
          <span>Cognitive & ATS</span>
          {activeTab === 'ats' && (
            <motion.span 
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#22d3ee] rounded-full shadow-[0_1px_10px_rgba(34,211,238,0.7)]"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
        </motion.button>
      </div>

      {/* Main Control Areas */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-[#1c1b21] overflow-y-auto">
        {activeTab === 'form' && (
          <div className="p-5 space-y-5 pb-16">

            {/* EXPANDABLE ACCORDIONS FOR SECTIONS */}
            
            {/* 1. PERSONAL DETAILS */}
            <div className={`border transition-all duration-200 overflow-hidden ${
              activeAccordion === 'personal' 
                ? 'border-[#4f378b] bg-[#25232a] rounded-xl shadow-md' 
                : 'border-[#312e39] bg-[#201e25]/60 rounded-xl hover:bg-[#201e25]'
            }`}>
              <button 
                onClick={() => toggleAccordion('personal')}
                className="w-full flex items-center justify-between p-4.5 text-sm font-semibold text-[#e6e1e5] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <User className={`w-4.5 h-4.5 transition-colors duration-200 ${activeAccordion === 'personal' ? 'text-[#bb86fc]' : 'text-[#cac4d0]'}`} />
                  <span className="font-display tracking-wide text-[#e6e1e5]">Personal Coordinates</span>
                </div>
                {activeAccordion === 'personal' ? <ChevronDown className="w-4.5 h-4.5 text-[#bb86fc]" /> : <ChevronRight className="w-4.5 h-4.5 text-[#cac4d0]" />}
              </button>
              
              {activeAccordion === 'personal' && (
                <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-[#312e39]/50">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#bb86fc] mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      value={resumeData.name} 
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-2 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc]/20 transition-all font-medium"
                      placeholder="e.g. Alex Diakov"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#bb86fc] mb-1.5">Professional Title</label>
                    <input 
                      type="text" 
                      value={resumeData.title} 
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-2 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc]/20 transition-all font-medium"
                      placeholder="e.g. Product Ventures & Innovation"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#bb86fc] mb-1.5">Email Coordinates</label>
                      <input 
                        type="email" 
                        value={resumeData.contact.email} 
                        onChange={(e) => handleFieldChange('contact.email', e.target.value)}
                        className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-2 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc]/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#bb86fc] mb-1.5">Location / Residence</label>
                      <input 
                        type="text" 
                        value={resumeData.contact.location} 
                        onChange={(e) => handleFieldChange('contact.location', e.target.value)}
                        className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-2 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc]/20 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#bb86fc] mb-1.5">Portfolio (Website)</label>
                      <input 
                        type="text" 
                        value={resumeData.contact.website} 
                        onChange={(e) => handleFieldChange('contact.website', e.target.value)}
                        className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-2 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc]/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#bb86fc] mb-1.5">LinkedIn URL</label>
                      <input 
                        type="text" 
                        value={resumeData.contact.linkedin} 
                        onChange={(e) => handleFieldChange('contact.linkedin', e.target.value)}
                        className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-2 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc]/20 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. SUMMARY PARAGRAPHS */}
            <div className={`border transition-all duration-200 overflow-hidden ${
              activeAccordion === 'summary' 
                ? 'border-[#4f378b] bg-[#25232a] rounded-xl shadow-md' 
                : 'border-[#312e39] bg-[#201e25]/60 rounded-xl hover:bg-[#201e25]'
            }`}>
              <button 
                onClick={() => toggleAccordion('summary')}
                className="w-full flex items-center justify-between p-4.5 text-sm font-semibold text-[#e6e1e5] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Maximize2 className={`w-4.5 h-4.5 transition-colors duration-200 ${activeAccordion === 'summary' ? 'text-[#bb86fc]' : 'text-[#cac4d0]'}`} />
                  <span className="font-display tracking-wide text-[#e6e1e5]">Professional Summary</span>
                </div>
                {activeAccordion === 'summary' ? <ChevronDown className="w-4.5 h-4.5 text-[#bb86fc]" /> : <ChevronRight className="w-4.5 h-4.5 text-[#cac4d0]" />}
              </button>
              
              {activeAccordion === 'summary' && (
                <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-[#312e39]/50">
                  {(resumeData.summary || []).map((para, i) => (
                    <div key={i} className="flex gap-2.5 animate-fade-in">
                      <textarea
                        value={para}
                        onChange={(e) => handleUpdateSummaryPara(i, e.target.value)}
                        className="flex-1 bg-[#1c1b21] border border-[#49454f] rounded-lg p-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc]/20 transition-all font-medium min-h-[68px]"
                        placeholder="Write summary paragraph describing key achievements..."
                      />
                      <button 
                        onClick={() => handleRemoveSummaryPara(i)}
                        className="p-2.5 text-[#f2b8b5] hover:bg-[#8c1d18]/20 rounded-full cursor-pointer transition-colors self-start"
                        title="Delete paragraph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddSummaryPara}
                    className="w-full flex items-center justify-center gap-2 bg-[#2a2732] hover:bg-[#34303f] border border-[#49454f] text-[#cac4d0] hover:text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Paragraph
                  </button>
                </div>
              )}
            </div>

            {/* 3. WORKING EXPERIENCE HISTORY */}
            <div className={`border transition-all duration-200 overflow-hidden ${
              activeAccordion === 'experience' 
                ? 'border-[#4f378b] bg-[#25232a] rounded-xl shadow-md' 
                : 'border-[#312e39] bg-[#201e25]/60 rounded-xl hover:bg-[#201e25]'
            }`}>
              <button 
                onClick={() => toggleAccordion('experience')}
                className="w-full flex items-center justify-between p-4.5 text-sm font-semibold text-[#e6e1e5] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className={`w-4.5 h-4.5 transition-colors duration-200 ${activeAccordion === 'experience' ? 'text-[#bb86fc]' : 'text-[#cac4d0]'}`} />
                  <span className="font-display tracking-wide text-[#e6e1e5]">Work Experience ({resumeData.experience?.length || 0})</span>
                </div>
                {activeAccordion === 'experience' ? <ChevronDown className="w-4.5 h-4.5 text-[#bb86fc]" /> : <ChevronRight className="w-4.5 h-4.5 text-[#cac4d0]" />}
              </button>
              
              {activeAccordion === 'experience' && (
                <div className="px-5 pb-5 pt-1 space-y-5 bg-transparent border-t border-[#312e39]/50">
                  {(resumeData.experience || []).map((exp, expIdx) => (
                    <div key={expIdx} className="bg-[#201e25] rounded-xl p-4.5 border border-[#312e39] relative animate-fade-in">
                      <button 
                        onClick={() => handleRemoveExperienceItem(expIdx)}
                        className="absolute top-3.5 right-3.5 p-2 text-[#f2b8b5] hover:bg-[#8c1d18]/20 rounded-full cursor-pointer"
                        title="Remove work"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="space-y-3 mt-2 pr-6">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] text-[#bb86fc] font-semibold tracking-wider uppercase mb-1">Role</label>
                            <input 
                              type="text" 
                              value={exp.role} 
                              onChange={(e) => handleUpdateExperience(expIdx, 'role', e.target.value)}
                              className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-[#bb86fc] font-semibold tracking-wider uppercase mb-1">Company</label>
                            <input 
                              type="text" 
                              value={exp.company} 
                              onChange={(e) => handleUpdateExperience(expIdx, 'company', e.target.value)}
                              className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] text-[#bb86fc] font-semibold tracking-wider uppercase mb-1">Duration</label>
                            <input 
                              type="text" 
                              value={exp.duration} 
                              onChange={(e) => handleUpdateExperience(expIdx, 'duration', e.target.value)}
                              className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-[#bb86fc] font-semibold tracking-wider uppercase mb-1">Employment Type</label>
                            <input 
                              type="text" 
                              value={exp.type} 
                              onChange={(e) => handleUpdateExperience(expIdx, 'type', e.target.value)}
                              className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc]"
                            />
                          </div>
                        </div>

                        {/* Bullet Highlights */}
                        <div className="mt-4 space-y-3 border-t border-[#312e39]/50 pt-3">
                          <span className="block text-[9px] text-[#cac4d0] font-semibold uppercase tracking-wider">Quantified Achievements:</span>
                          {(exp.highlights || []).map((h, hIdx) => (
                            <div key={hIdx} className="bg-[#1c1b21]/55 rounded-lg p-3 border border-[#312e39]/60 space-y-2 relative animate-fade-in">
                              <button 
                                onClick={() => handleRemoveHighlight(expIdx, hIdx)}
                                className="absolute top-2 right-2 p-1.5 text-[#f2b8b5] hover:bg-[#8c1d18]/15 rounded-full cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              
                              <div className="pr-6">
                                <label className="block text-[9px] text-[#bb86fc]/80 font-bold mb-0.5">Focus Metric / Feature (e.g. Workflow Optimization)</label>
                                <input 
                                  type="text" 
                                  value={h.title} 
                                  onChange={(e) => handleUpdateHighlight(expIdx, hIdx, 'title', e.target.value)}
                                  className="w-full bg-[#141218] border border-[#312e39] rounded-lg px-2.5 py-1 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] text-[#bb86fc]/80 font-bold mb-0.5">Details (Describe the impact, quantify where possible)</label>
                                <textarea
                                  value={h.description} 
                                  onChange={(e) => handleUpdateHighlight(expIdx, hIdx, 'description', e.target.value)}
                                  className="w-full bg-[#141218] border border-[#312e39] rounded-lg px-2.5 py-1.5 text-[#cac4d0] text-xs focus:outline-none focus:border-[#bb86fc]"
                                  rows={1.5}
                                />
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => handleAddHighlight(expIdx)}
                            className="w-full flex items-center justify-center gap-1.5 bg-[#1c1b21] hover:bg-[#2b2930] text-[#cac4d0] py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider border border-[#312e39] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#bb86fc]" /> Add Achievement
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddExperienceItem}
                    className="w-full flex items-center justify-center gap-2 bg-[#2a2732] hover:bg-[#34303f] border border-[#49454f] text-[#cac4d0] hover:text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Experience Node
                  </button>
                </div>
              )}
            </div>

            {/* 4. PRODUCT VENTURES & PROJECTS */}
            <div className={`border transition-all duration-200 overflow-hidden ${
              activeAccordion === 'projects' 
                ? 'border-[#4f378b] bg-[#25232a] rounded-xl shadow-md' 
                : 'border-[#312e39] bg-[#201e25]/60 rounded-xl hover:bg-[#201e25]'
            }`}>
              <button 
                onClick={() => toggleAccordion('projects')}
                className="w-full flex items-center justify-between p-4.5 text-sm font-semibold text-[#e6e1e5] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Layers className={`w-4.5 h-4.5 transition-colors duration-200 ${activeAccordion === 'projects' ? 'text-[#bb86fc]' : 'text-[#cac4d0]'}`} />
                  <span className="font-display tracking-wide text-[#e6e1e5]">Projects & Innovation ({resumeData.projects?.length || 0})</span>
                </div>
                {activeAccordion === 'projects' ? <ChevronDown className="w-4.5 h-4.5 text-[#bb86fc]" /> : <ChevronRight className="w-4.5 h-4.5 text-[#cac4d0]" />}
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
                            <label className="block text-[9px] text-[#bb86fc] font-bold uppercase mb-1">Venture Name</label>
                            <input 
                              type="text" 
                              value={proj.title} 
                              onChange={(e) => handleUpdateProject(pIdx, 'title', e.target.value)}
                              className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-[#bb86fc] font-bold uppercase mb-1">Leadership Role</label>
                            <input 
                              type="text" 
                              value={proj.role} 
                              onChange={(e) => handleUpdateProject(pIdx, 'role', e.target.value)}
                              className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] text-[#bb86fc] font-bold uppercase mb-1">Brief Executive Description</label>
                          <textarea
                            value={proj.description} 
                            onChange={(e) => handleUpdateProject(pIdx, 'description', e.target.value)}
                            className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-2 px-3 text-[#cac4d0] text-xs focus:outline-none focus:border-[#bb86fc]"
                            rows={2}
                          />
                        </div>

                        {/* Detail Label/Values */}
                        <div className="space-y-3 mt-3 border-t border-[#312e39]/50 pt-3">
                          <span className="block text-[9px] text-[#cac4d0] font-semibold uppercase tracking-wider">Key Metrics & Scope:</span>
                          {(proj.details || []).map((d, dIdx) => (
                            <div key={dIdx} className="flex gap-2 items-center animate-fade-in font-sans">
                              <input 
                                type="text" 
                                value={d.label} 
                                onChange={(e) => handleUpdateDetailRow(pIdx, dIdx, 'label', e.target.value)}
                                className="w-1/3 bg-[#1c1b21] border border-[#49454f] rounded-lg px-3 py-1.5 text-[#bb86fc] text-[11px] focus:outline-none font-bold"
                                placeholder="Label (e.g. Impact)"
                              />
                              <input 
                                type="text" 
                                value={d.value} 
                                onChange={(e) => handleUpdateDetailRow(pIdx, dIdx, 'value', e.target.value)}
                                className="flex-1 bg-[#1c1b21] border border-[#49454f] rounded-lg px-3 py-1.5 text-[#e6e1e5] text-[11px] focus:outline-none"
                                placeholder="Details index..."
                              />
                              <button 
                                onClick={() => handleRemoveDetailRow(pIdx, dIdx)}
                                className="p-1.5 text-[#f2b8b5] hover:bg-[#8c1d18]/15 rounded-full cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => handleAddDetailRow(pIdx)}
                            className="w-full flex items-center justify-center gap-1.5 bg-[#1c1b21] hover:bg-[#2b2930] text-[#cac4d0] py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider border border-[#312e39] cursor-pointer"
                          >
                            <Plus className="w-3 h-3 text-[#bb86fc]" /> Add Detail Metric
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddProjectItem}
                    className="w-full flex items-center justify-center gap-2 bg-[#2a2732] hover:bg-[#34303f] border border-[#49454f] text-[#cac4d0] hover:text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Project Node
                  </button>
                </div>
              )}
            </div>

            {/* 5. CORE COMPETENCIES / SKILLS */}
            <div className={`border transition-all duration-200 overflow-hidden ${
              activeAccordion === 'skills' 
                ? 'border-[#4f378b] bg-[#25232a] rounded-xl shadow-md' 
                : 'border-[#312e39] bg-[#201e25]/60 rounded-xl hover:bg-[#201e25]'
            }`}>
              <button 
                onClick={() => toggleAccordion('skills')}
                className="w-full flex items-center justify-between p-4.5 text-sm font-semibold text-[#e6e1e5] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-4.5 h-4.5 transition-colors duration-200 ${activeAccordion === 'skills' ? 'text-[#bb86fc]' : 'text-[#cac4d0]'}`} />
                  <span className="font-display tracking-wide text-[#e6e1e5]">Core Competencies (Skills)</span>
                </div>
                {activeAccordion === 'skills' ? <ChevronDown className="w-4.5 h-4.5 text-[#bb86fc]" /> : <ChevronRight className="w-4.5 h-4.5 text-[#cac4d0]" />}
              </button>
              
              {activeAccordion === 'skills' && (
                <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-[#312e39]/50">
                  {Object.entries(resumeData.skills || {}).map(([category, skills]) => (
                    <div key={category} className="bg-[#201e25] rounded-xl p-4.5 border border-[#312e39] relative space-y-2 animate-fade-in">
                      <button 
                        onClick={() => handleRemoveSkillCategory(category)}
                        className="absolute top-3.5 right-3.5 p-2 text-[#f2b8b5] hover:bg-[#8c1d18]/25 rounded-full cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="pr-6">
                        <label className="block text-[9px] text-[#bb86fc] font-bold uppercase mb-1">Sector Category</label>
                        <input 
                          type="text" 
                          defaultValue={category} 
                          onBlur={(e) => handleUpdateSkillCategory(category, e.target.value, skills)}
                          className="bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#edd4ff] text-xs focus:outline-none font-bold uppercase tracking-wide"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-[#cac4d0] font-bold uppercase mb-1">Skill Keywords (comma-separated)</label>
                        <textarea
                          value={skills} 
                          onChange={(e) => handleUpdateSkillCategory(category, category, e.target.value)}
                          className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg p-3 text-[#e6e1e5] text-xs focus:outline-none focus:border-[#bb86fc]"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddSkillCategory}
                    className="w-full flex items-center justify-center gap-2 bg-[#2a2732] hover:bg-[#34303f] border border-[#49454f] text-[#cac4d0] hover:text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Skill Category
                  </button>
                </div>
              )}
            </div>

            {/* 6. EDUCATION HISTORY */}
            <div className={`border transition-all duration-200 overflow-hidden ${
              activeAccordion === 'education' 
                ? 'border-[#4f378b] bg-[#25232a] rounded-xl shadow-md' 
                : 'border-[#312e39] bg-[#201e25]/60 rounded-xl hover:bg-[#201e25]'
            }`}>
              <button 
                onClick={() => toggleAccordion('education')}
                className="w-full flex items-center justify-between p-4.5 text-sm font-semibold text-[#e6e1e5] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className={`w-4.5 h-4.5 transition-colors duration-200 ${activeAccordion === 'education' ? 'text-[#bb86fc]' : 'text-[#cac4d0]'}`} />
                  <span className="font-display tracking-wide text-[#e6e1e5]">Academic Credentials ({resumeData.education?.length || 0})</span>
                </div>
                {activeAccordion === 'education' ? <ChevronDown className="w-4.5 h-4.5 text-[#bb86fc]" /> : <ChevronRight className="w-4.5 h-4.5 text-[#cac4d0]" />}
              </button>
                        {activeAccordion === 'education' && (
                <div className="px-5 pb-5 pt-1 space-y-4 bg-transparent border-t border-[#312e39]/50">
                  {(resumeData.education || []).map((edu, idx) => (
                    <div key={idx} className="bg-[#201e25] rounded-xl p-4.5 border border-[#312e39] relative space-y-2 animate-fade-in font-sans">
                       <button 
                         onClick={() => handleRemoveEducation(idx)}
                         className="absolute top-3.5 right-3.5 p-2 text-[#f2b8b5] hover:bg-[#8c1d18]/25 rounded-full cursor-pointer"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>

                       <div className="grid grid-cols-2 gap-3 pr-6">
                         <div>
                           <label className="block text-[9px] text-[#bb86fc] font-bold">Certification / Degree</label>
                           <input 
                             type="text" 
                             value={edu.certification} 
                             onChange={(e) => handleUpdateEducation(idx, 'certification', e.target.value)}
                             className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none"
                           />
                         </div>
                         <div>
                           <label className="block text-[9px] text-[#bb86fc] font-bold">Institution Name</label>
                           <input 
                             type="text" 
                             value={edu.institution} 
                             onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                             className="w-full bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none"
                           />
                         </div>
                       </div>
                       <div>
                         <label className="block text-[9px] text-[#bb86fc] font-bold">Graduation Year</label>
                         <input 
                           type="text" 
                           value={edu.year} 
                           onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                           className="w-1/3 bg-[#1c1b21] border border-[#49454f] rounded-lg py-1.5 px-3 text-[#e6e1e5] text-xs focus:outline-none"
                         />
                       </div>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddEducationItem}
                    className="w-full flex items-center justify-center gap-2 bg-[#2a2732] hover:bg-[#34303f] border border-[#49454f] text-[#cac4d0] hover:text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Academic Node
                  </button>
                </div>
              )}
            </div>

            {/* 7. LAYOUT CALIBRATION CONTROLS */}
            <div className="border border-dashed border-[#57438c]/80 rounded-xl p-4.5 bg-[#4f378b]/10 space-y-4 animate-fade-in">
               <div className="flex items-center justify-between border-b border-[#312e39] pb-3">
                 <div className="flex items-center gap-2 text-[#eaddff] font-bold text-xs uppercase tracking-widest font-sans">
                   <Sliders className="w-4 h-4 text-[#bb86fc]" />
                   <span>Grid Alignment & Tuning</span>
                 </div>
                 
                 <button 
                   onClick={autoFitContent}
                   className="flex items-center gap-1.5 bg-[#6750A4] hover:bg-[#7c52ff] text-white font-bold text-[11px] px-3.5 py-1.5 rounded-full shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                   title="Adjust spacing variables automatically so the content flows beautifully under exactly 2 pages"
                 >
                   <Sparkles className="w-3.5 h-3.5 text-[#eaddff] animate-pulse" />
                   <span>Auto-Fit 2 Pages</span>
                 </button>
               </div>

               {/* PRESET PILLS */}
               <div className="space-y-2">
                  <span className="block text-[10px] text-[#cac4d0] font-bold uppercase tracking-wider font-display">Select density preset</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['standard', 'compact', 'super'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => onApplySpacingPreset(preset as any)}
                        className={`py-2 px-2.5 rounded-full text-[11px] font-bold transition-all uppercase tracking-wider text-center cursor-pointer select-none border ${
                          spacingPreset === preset 
                            ? 'bg-[#eaddff] text-[#21005d] border-[#bb86fc]' 
                            : 'bg-[#1c1b21] text-[#cac4d0] border-[#312e39] hover:bg-[#25232a] hover:text-white'
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
                      <span className="text-[10px] text-[#cac4d0] font-bold uppercase tracking-wider">Padding Top/Bottom</span>
                      <span className="text-sm text-[#bb86fc] font-mono font-bold">{paddingTopBottom}mm</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="20" 
                      step="0.5" 
                      value={paddingTopBottom} 
                      onChange={(e) => setPaddingTopBottom(parseFloat(e.target.value))}
                      className="w-full accent-[#bb86fc] cursor-pointer bg-[#312e39] rounded-lg appearance-none h-1"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-[10px] text-[#cac4d0] font-bold uppercase tracking-wider">Padding Left/Right</span>
                      <span className="text-sm text-[#bb86fc] font-mono font-bold">{paddingLeftRight}mm</span>
                    </div>
                    <input 
                      type="range" 
                      min="8" 
                      max="20" 
                      step="0.5" 
                      value={paddingLeftRight} 
                      onChange={(e) => setPaddingLeftRight(parseFloat(e.target.value))}
                      className="w-full accent-[#bb86fc] cursor-pointer bg-[#312e39] rounded-lg appearance-none h-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-[9px] text-[#cac4d0] font-bold uppercase tracking-wider">Sections</span>
                        <span className="text-sm text-[#bb86fc] font-mono font-bold">{Math.round(sectionSpacing * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="1.5" 
                        step="0.05" 
                        value={sectionSpacing} 
                        onChange={(e) => setSectionSpacing(parseFloat(e.target.value))}
                        className="w-full accent-[#bb86fc] cursor-pointer bg-[#312e39] rounded-lg appearance-none h-1"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-[9px] text-[#cac4d0] font-bold uppercase tracking-wider">Blocks Space</span>
                        <span className="text-sm text-[#bb86fc] font-mono font-bold">{Math.round(itemSpacing * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.4" 
                        max="1.5" 
                        step="0.05" 
                        value={itemSpacing} 
                        onChange={(e) => setItemSpacing(parseFloat(e.target.value))}
                        className="w-full accent-[#bb86fc] cursor-pointer bg-[#312e39] rounded-lg appearance-none h-1"
                      />
                    </div>
                  </div>
                </div>

                {/* PAGE GUIDE TOGGLE */}
                <div className="flex items-center justify-between pt-3 border-t border-[#312e39] font-sans">
                   <span className="text-[10px] text-[#cac4d0] font-bold uppercase tracking-wider">Show A4 Page Dividers</span>
                   <input
                     type="checkbox"
                     checked={showPageGuides}
                     onChange={(e) => setShowPageGuides(e.target.checked)}
                     className="w-4 h-4 rounded-md text-[#6750A4] focus:ring-[#bb86fc] bg-[#1c1b21] border-[#49454f] cursor-pointer accent-[#bb86fc]"
                   />
                </div>
             </div>

           </div>
         )}

        {activeTab === 'json' && (
          <div className="flex-1 flex flex-col min-h-0 animate-fade-in font-sans">
            {/* Presets load banner */}
            <div className="p-4 bg-[#25232a] border-b border-[#312e39] shrink-0">
              <span className="block text-[10px] font-bold text-[#bb86fc] uppercase tracking-wider mb-2.5">Load High-Success Sandbox Templates:</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleLoadPreset('designer')}
                  className="bg-[#4f378b]/40 text-[#eaddff] hover:bg-[#4f378b]/80 border border-[#4f378b]/65 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  Product Designer
                </button>
                <button 
                  onClick={() => handleLoadPreset('engineer')}
                  className="bg-[#4f378b]/40 text-[#eaddff] hover:bg-[#4f378b]/80 border border-[#4f378b]/65 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  Fullstack Dev
                </button>
                <button 
                  onClick={() => handleLoadPreset('manager')}
                  className="bg-[#4f378b]/40 text-[#eaddff] hover:bg-[#4f378b]/80 border border-[#4f378b]/65 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer"
                >
                  Product Manager
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-4.5 py-2.5 bg-[#25232a]/40 border-b border-[#312e39] shrink-0">
              <div className="flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                   <span className={jsonError ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-450 opacity-75" : "absolute inline-flex rounded-full h-2 w-2 bg-green-500 hidden"}></span>
                   <span className={`relative inline-flex rounded-full h-2 w-2 ${jsonError ? 'bg-red-500' : 'bg-green-500'}`}></span>
                 </span>
                 <span className="text-[11px] text-[#cac4d0] font-bold uppercase tracking-wider font-display">
                   {jsonError ? 'Syntax Invalid' : 'A4 Realtime Synced'}
                 </span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#cac4d0] hover:text-white transition-colors cursor-pointer"
                title="Copy JSON"
              >
                {copied ? <Check className="w-4 h-4 text-[#b2f293]" /> : <Copy className="w-4 h-4 text-[#bb86fc]" />}
                <span className="text-[11px] font-bold uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="flex-1 w-full p-4.5 bg-transparent text-[#e6e1e5] font-mono text-[11px] leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
              placeholder="Paste your JSON here..."
            />
            {jsonError && (
              <div className="absolute bottom-0 left-0 right-0 p-4.5 bg-[#8c1d18]/95 border-t border-[#8c1d18] text-[#f2b8b5] text-sm flex items-start gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] rounded-t-3xl">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#f2b8b5] mt-0.5" />
                <span className="font-mono text-xs break-all leading-normal">{jsonError}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ats' && (
          <div className="p-5 space-y-5 pb-16 animate-fade-in font-sans">

            {/* ERROR/WARNING FEEDBACK BOXES */}
            {analyzerWarning && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-200 text-[10px] flex items-start gap-2.5 leading-relaxed text-left">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{analyzerWarning}</span>
              </div>
            )}

            {/* SCANNING LOADING skeleton */}
            {analyzing && (
              <div className="bg-[#1c1b21] rounded-xl p-6 border border-[#3b3846] text-center space-y-4 animate-pulse shadow-md">
                <Brain className="w-10 h-10 mx-auto text-[#bb86fc] animate-spin" />
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-[#eaddff] uppercase tracking-wider">Deconstructing Cognitive Load</h5>
                  <p className="text-[11px] text-[#cac4d0]">Simulating eye-scans & calculating information entropy...</p>
                </div>
                <div className="text-[9px] text-[#bb86fc]/70 font-mono space-y-1.5 pt-2 border-t border-[#312e39]/60">
                  <div className="flex justify-between"><span>[OK] Evaluated section sizes</span><span className="text-[#b2f293]">100%</span></div>
                  <div className="flex justify-between"><span>[RUNNING] Charting scanning F-pattern...</span><span className="animate-pulse">PENDING</span></div>
                  <div className="flex justify-between"><span>[RUNNING] Scoring Miller's law chunks...</span><span className="animate-pulse">PENDING</span></div>
                </div>
              </div>
            )}

            {/* METRICS DASHBOARD */}
            {!analyzing && analysisResult && (
              <div className="space-y-4 animate-fade-in-up">
                {/* Elegant inline controls */}
                <div className="flex items-center justify-between text-[11px] text-[#cac4d0] font-sans px-1">
                  <span className="font-extrabold uppercase tracking-wider text-cyan-400">Usability & Scan Scores</span>
                  <button
                    onClick={runCognitiveAnalysis}
                    disabled={analyzing}
                    className="flex items-center gap-1 text-[10px] text-[#bb86fc] hover:text-[#d3bbff] disabled:opacity-50 cursor-pointer uppercase tracking-widest font-extrabold transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${analyzing ? "animate-spin" : ""}`} /> Recalibrate
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-[#1c1b21] p-3.5 rounded-xl border border-[#312e39] text-center relative overflow-hidden group">
                    <span className="block text-[8px] uppercase font-bold text-[#cac4d0]/60 tracking-wider">Overall Impact</span>
                    <span className="text-2xl font-black font-mono text-[#bb86fc] block mt-1">{analysisResult.overallScore}%</span>
                    <div className="h-1 w-full bg-[#312e39] mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#bb86fc]" style={{ width: `${analysisResult.overallScore}%` }} />
                    </div>
                  </div>
                  <div className="bg-[#1c1b21] p-3.5 rounded-xl border border-[#312e39] text-center relative overflow-hidden">
                    <span className="block text-[8px] uppercase font-bold text-[#cac4d0]/60 tracking-wider">Cognitive Load</span>
                    <span className="text-2xl font-black font-mono text-[#b2f293] block mt-1">{analysisResult.cognitiveScore}%</span>
                    <div className="h-1 w-full bg-[#312e39] mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#b2f293]" style={{ width: `${analysisResult.cognitiveScore}%` }} />
                    </div>
                  </div>
                  <div className="bg-[#1c1b21] p-3.5 rounded-xl border border-[#312e39] text-center relative overflow-hidden">
                    <span className="block text-[8px] uppercase font-bold text-[#cac4d0]/60 tracking-wider">Scanning Ease</span>
                    <span className="text-2xl font-black font-mono text-cyan-300 block mt-1">{analysisResult.scanningScore}%</span>
                    <div className="h-1 w-full bg-[#312e39] mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${analysisResult.scanningScore}%` }} />
                    </div>
                  </div>
                  <div className="bg-[#1c1b21] p-3.5 rounded-xl border border-[#312e39] text-center relative overflow-hidden">
                    <span className="block text-[8px] uppercase font-bold text-[#cac4d0]/60 tracking-wider">Metric Proof density</span>
                    <span className="text-2xl font-black font-mono text-orange-300 block mt-1">{analysisResult.kpiScore}%</span>
                    <div className="h-1 w-full bg-[#312e39] mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400" style={{ width: `${analysisResult.kpiScore}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1c1b21]/75 p-3.5 rounded-xl border border-[#312e39] text-[#e6e1e5] text-[11px] leading-relaxed relative text-left">
                  <span className="absolute -top-2 left-3 bg-[#312e39] text-[#bb86fc] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">Visual Diagnostic Briefing</span>
                  <p className="mt-1 font-sans">{analysisResult.summaryFeedback}</p>
                </div>

                {/* 1-CLICK INSTANT AI REPHRASE */}
                {analysisResult.rewrites && analysisResult.rewrites.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <span className="block text-[9px] text-[#cac4d0] font-bold uppercase tracking-wider text-left flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                      Active Attention Upgrades (1-Click Apply)
                    </span>
                    <div className="space-y-3">
                      {analysisResult.rewrites.map((rw: any, idx: number) => (
                        <div key={idx} className="bg-[#1a1820] rounded-xl p-4 border border-[#bb86fc]/20 relative text-left space-y-3 shadow-md animate-fade-in">
                          <div className="flex items-center justify-between border-b border-[#312e39]/60 pb-1.5">
                            <span className="text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{rw.where}</span>
                            <span className="text-[8px] text-[#cac4d0]/60">Active Verb Metric Upgrade</span>
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            <div className="text-[#f2b8b5]/80 bg-[#8c1d18]/5 p-2 rounded border border-[#8c1d18]/15 text-left">
                              <span className="block text-[8px] uppercase tracking-wider font-bold text-[#f2b8b5]/60 mb-1">Passivity / Density Load</span>
                              <p className="line-through opacity-70 italic leading-relaxed text-[11px]">{rw.original}</p>
                            </div>
                            
                            <div className="text-[#b2f293] bg-[#375a25]/10 p-2 rounded border border-[#375a25]/20 text-left">
                              <span className="block text-[8px] uppercase tracking-wider font-bold text-[#b2f293]/80 mb-1">Optimized scannability</span>
                              <p className="font-semibold leading-relaxed text-[11px]">{rw.replacement}</p>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-[#312e39]/60 flex items-center justify-between gap-3">
                            <span className="text-[9.5px] text-[#cac4d0] font-sans leading-tight">Rationale: {rw.benefit}</span>
                            <button
                              onClick={() => handleApplyRewrite(rw.original, rw.replacement)}
                              className="px-3 py-1.5 bg-[#4f378b] hover:bg-[#6246b0] hover:scale-[1.02] text-white rounded-lg text-[9px] font-bold tracking-wide cursor-pointer transition-all duration-200 flex items-center gap-1 shrink-0 shadow-lg"
                            >
                              <span>Apply Upgrade</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VISUAL DIAGNOSTIC OBSTACLES LIST */}
                {analysisResult.diagnostics && (
                  <div className="space-y-2.5 pt-1 text-left">
                    <span className="block text-[9px] text-[#cac4d0] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#bb86fc]" />
                      Structural Cognitive Hurdle Log
                    </span>
                    {analysisResult.diagnostics.map((diag: any, idx: number) => (
                      <div key={idx} className="bg-[#1c1b21] rounded-xl p-3.5 border border-[#312e39]/80 space-y-2">
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-extrabold text-[#bb86fc] uppercase tracking-wider">{diag.section}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            diag.severity === 'high' ? 'bg-[#f2b8b5]/15 text-[#f2b8b5]' : diag.severity === 'medium' ? 'bg-amber-400/10 text-amber-300' : 'bg-[#b2f293]/15 text-[#b2f293]'
                          }`}>
                            {diag.severity} risk
                          </span>
                        </div>
                        <p className="text-[11px] text-[#e6e1e5] leading-relaxed">{diag.finding}</p>
                        <div className="pt-2 border-t border-[#312e39]/50 flex flex-col gap-1.5 text-[10px]">
                          <div className="flex items-center gap-1.5 text-[#cac4d0]/70 font-mono text-[9px]">
                            <Info className="w-3 h-3 text-[#cac4d0]/50" />
                            <span>Basis: <strong className="text-[#cac4d0] font-semibold">{diag.psychologicalBasis}</strong></span>
                          </div>
                          <p className="text-[#b2f293] leading-normal font-sans bg-[#375a25]/10 p-2 rounded border border-[#375a25]/20 text-[10.5px]">
                            💡 {diag.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* FIRST-SCAN ATTENTION ANCHORS */}
                {analysisResult.scanningHotspots && (
                  <div className="bg-[#1c1b21]/45 border border-[#312e39] rounded-xl p-4 text-left space-y-2.5">
                    <span className="block text-[9px] text-[#cac4d0]/70 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Recruiter Eye-Tracking Hotspots (6-Second Scan)
                    </span>
                    <ul className="space-y-2 text-xs text-[#e6e1e5]">
                      {analysisResult.scanningHotspots.map((hs: string, hIdx: number) => (
                        <li key={hIdx} className="flex items-start gap-2 text-[11px] leading-relaxed font-sans">
                          <span className="text-cyan-400 font-bold mt-0.5 shrink-0">⦿</span>
                          <span>{hs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ATS COMPLIANCE PORTION WITH SEPARATOR */}
            <div className="border-t border-[#312e39] pt-4 mt-2">
              <div className="bg-[#2a2732] p-4 border border-[#3b3846]/70 rounded-xl shadow-sm text-left">
                <h4 className="text-xs font-bold text-[#eaddff] uppercase tracking-wider mb-2.5 flex items-center gap-2 font-display">
                  <Sparkles className="w-4.5 h-4.5 text-[#bb86fc]" />
                  <span>Invisible ATS Keywords Scraper</span>
                </h4>
                <p className="text-xs text-[#cac4d0] leading-relaxed font-medium">
                  Paste your target job description, target key skills, or technical metrics here. 
                  These keywords are embedded <strong className="text-[#edd4ff]">invisibly</strong> inside the PDF document layout, allowing electronic automated applicant tracking engines (ATS) to rate you at 100% match, while human recruiters inspect a pristine, uncluttered visual layout.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <span className="block text-[10px] font-semibold text-[#cac4d0] uppercase tracking-wider">Target Requirements / Job Listing Block:</span>
              <textarea
                value={atsInput}
                onChange={(e) => setAtsInput(e.target.value)}
                className="w-full p-3.5 bg-[#1c1b21] border border-[#49454f] rounded-lg text-[#e6e1e5] font-mono text-xs focus:outline-none focus:border-[#bb86fc]"
                rows={6}
                spellCheck={false}
                placeholder="Example: Managed cross-functional agile teams, delivered robust GraphQL endpoints, Figma UX design system, CSS, HTML..."
              />
            </div>

            {/* ATS MATCH GAUGE */}
            {atsInput.trim() && (
              <div className="bg-[#201e25] rounded-xl p-4.5 border border-[#312e39] space-y-4 shadow-md animate-fade-in font-sans text-left">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#cac4d0] font-bold uppercase tracking-wider font-display">Automated ATS Rate</span>
                    <div className="flex items-baseline gap-1.5">
                       <span className={`text-2xl font-black font-mono tracking-tight ${
                         atsScore.score >= 80 ? 'text-[#b2f293]' : atsScore.score >= 50 ? 'text-amber-300' : 'text-[#f2b8b5]'
                       }`}>
                         {atsScore.score}%
                       </span>
                       <span className="text-xs text-[#cac4d0]/60 font-semibold font-display">Match</span>
                    </div>
                 </div>

                 {/* Bar gauge */}
                 <div className="w-full bg-[#1c1b21] rounded-full h-2.5 overflow-hidden border border-[#312e39]">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        atsScore.score >= 80 ? 'bg-[#b2f293]' : atsScore.score >= 50 ? 'bg-amber-400' : 'bg-[#f2b8b5]'
                      }`}
                      style={{ width: `${atsScore.score}%` }}
                    />
                 </div>

                 {/* Interpretation feedback */}
                 <div className="text-xs text-[#e6e1e5] leading-relaxed bg-[#1c1b21]/80 p-3 rounded-lg border border-[#312e39]/60 font-medium">
                   {atsScore.score >= 80 ? (
                     <div className="flex gap-2.5 items-start text-[#b2f293]">
                       <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#b2f293]" />
                       <span>Excellent! High-density overlap. Scanners will prioritize your application for high-tech indexes.</span>
                     </div>
                   ) : atsScore.score >= 50 ? (
                     <div className="flex gap-2.5 items-start text-amber-200">
                       <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-400" />
                       <span>Moderate match. Boost your score to more than 80% by including missing technical key phrases in your resume summaries or experience bullets.</span>
                     </div>
                   ) : (
                     <div className="flex gap-2.5 items-start text-[#f2b8b5]">
                       <XCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-[#f2b8b5]" />
                       <span>Poor keyword overlap. Critical keywords are absent, risking automated rejection flags. Paste specific terms into your experience highlights.</span>
                     </div>
                   )}
                 </div>

                 {/* Matches Details */}
                 <div className="space-y-3.5 pt-2 border-t border-[#312e39] text-left">
                   {atsScore.matched.length > 0 && (
                     <div>
                       <span className="block text-[9px] text-[#cac4d0]/60 font-bold uppercase tracking-wider mb-2">Matched Keywords ({atsScore.matched.length}):</span>
                       <div className="flex flex-wrap gap-1.5">
                         {atsScore.matched.map((m, idx) => (
                           <span key={idx} className="bg-[#375a25]/25 text-[#b2f293] border border-[#375a25]/60 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold">
                             ✓ {m}
                           </span>
                         ))}
                       </div>
                     </div>
                   )}

                   {atsScore.missing.length > 0 && (
                     <div className="pt-1">
                       <span className="block text-[9px] text-[#cac4d0]/60 font-bold uppercase tracking-wider mb-2">Missing Keywords ({atsScore.missing.length}):</span>
                       <div className="flex flex-wrap gap-1.5">
                         {atsScore.missing.map((m, idx) => (
                           <span key={idx} className="bg-[#8c1d18]/15 text-[#f2b8b5] border border-[#8c1d18]/40 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold">
                             + {m}
                           </span>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
