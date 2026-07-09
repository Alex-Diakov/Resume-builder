import { useState } from 'react';
import { ResumeData, ExperienceItem, ProjectItem, EducationItem } from '../types';

export const useResumeForm = (
  resumeData: ResumeData, 
  onChangeData: (data: ResumeData) => void
) => {
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoFile = (file: File) => {
    setPhotoError(null);
    if (!file.type.startsWith('image/')) {
      setPhotoError('Unsupported file type. Please upload an image (PNG, JPG, WebP).');
      return;
    }
    // Check file size (e.g., 2MB limit for base64)
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Image is too large (max 2MB) to ensure light weight.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const updated = { 
          ...resumeData, 
          photo: e.target.result as string, 
          showPhoto: resumeData.showPhoto !== undefined ? resumeData.showPhoto : true 
        };
        onChangeData(updated);
      }
    };
    reader.onerror = () => {
      setPhotoError('Error reading file.');
    };
    reader.readAsDataURL(file);
  };

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

  return {
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
  };
};
