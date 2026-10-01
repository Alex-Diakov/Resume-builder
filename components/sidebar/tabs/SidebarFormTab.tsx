import React, { useState } from 'react';
import { ResumeData } from '../../../types';
import { useResumeForm } from '../../../hooks/useResumeForm';
import {
  PersonalInfoSection,
  SummarySection,
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
  EducationSection,
  LayoutSection
} from './form';

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
  enableAdaptiveFit?: boolean;
  setEnableAdaptiveFit?: (val: boolean) => void;
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
  pageFraction,
  enableAdaptiveFit,
  setEnableAdaptiveFit
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('personal');

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

  const toggleAccordion = (sec: string) => {
    setActiveAccordion(activeAccordion === sec ? null : sec);
  };

  return (
    <div className="p-5 space-y-4 pb-20 font-sans text-left">
      {/* 1. PERSONAL DETAILS */}
      <PersonalInfoSection
        isOpen={activeAccordion === 'personal'}
        onToggle={() => toggleAccordion('personal')}
        resumeData={resumeData}
        onChangeData={onChangeData}
        handleFieldChange={handleFieldChange}
        photoError={photoError}
        handlePhotoFile={handlePhotoFile}
      />

      {/* 2. SUMMARY PARAGRAPHS */}
      <SummarySection
        isOpen={activeAccordion === 'summary'}
        onToggle={() => toggleAccordion('summary')}
        summary={resumeData.summary || []}
        handleUpdateSummaryPara={handleUpdateSummaryPara}
        handleAddSummaryPara={handleAddSummaryPara}
        handleRemoveSummaryPara={handleRemoveSummaryPara}
      />

      {/* 3. WORKING EXPERIENCE HISTORY */}
      <ExperienceSection
        isOpen={activeAccordion === 'experience'}
        onToggle={() => toggleAccordion('experience')}
        experience={resumeData.experience || []}
        handleUpdateExperience={handleUpdateExperience}
        handleAddExperienceItem={handleAddExperienceItem}
        handleRemoveExperienceItem={handleRemoveExperienceItem}
        handleUpdateHighlight={handleUpdateHighlight}
        handleAddHighlight={handleAddHighlight}
        handleRemoveHighlight={handleRemoveHighlight}
      />

      {/* 4. PRODUCT VENTURES & PROJECTS */}
      <ProjectsSection
        isOpen={activeAccordion === 'projects'}
        onToggle={() => toggleAccordion('projects')}
        projects={resumeData.projects || []}
        handleUpdateProject={handleUpdateProject}
        handleAddProjectItem={handleAddProjectItem}
        handleRemoveProjectItem={handleRemoveProjectItem}
        handleUpdateDetailRow={handleUpdateDetailRow}
        handleAddDetailRow={handleAddDetailRow}
        handleRemoveDetailRow={handleRemoveDetailRow}
      />

      {/* 5. CORE COMPETENCIES / SKILLS */}
      <SkillsSection
        isOpen={activeAccordion === 'skills'}
        onToggle={() => toggleAccordion('skills')}
        skills={resumeData.skills || {}}
        handleUpdateSkillCategory={handleUpdateSkillCategory}
        handleAddSkillCategory={handleAddSkillCategory}
        handleRemoveSkillCategory={handleRemoveSkillCategory}
      />

      {/* 6. EDUCATION HISTORY */}
      <EducationSection
        isOpen={activeAccordion === 'education'}
        onToggle={() => toggleAccordion('education')}
        education={resumeData.education || []}
        handleUpdateEducation={handleUpdateEducation}
        handleAddEducationItem={handleAddEducationItem}
        handleRemoveEducation={handleRemoveEducation}
      />

      {/* 7. LAYOUT CALIBRATION CONTROLS */}
      <LayoutSection
        isOpen={activeAccordion === 'layout'}
        onToggle={() => toggleAccordion('layout')}
        paddingTopBottom={paddingTopBottom}
        setPaddingTopBottom={setPaddingTopBottom}
        paddingLeftRight={paddingLeftRight}
        setPaddingLeftRight={setPaddingLeftRight}
        sectionSpacing={sectionSpacing}
        setSectionSpacing={setSectionSpacing}
        itemSpacing={itemSpacing}
        setItemSpacing={setItemSpacing}
        spacingPreset={spacingPreset}
        onApplySpacingPreset={onApplySpacingPreset}
        showPageGuides={showPageGuides}
        setShowPageGuides={setShowPageGuides}
        autoFitContent={autoFitContent}
        pageFraction={pageFraction}
        enableAdaptiveFit={enableAdaptiveFit}
        setEnableAdaptiveFit={setEnableAdaptiveFit}
      />
    </div>
  );
};

