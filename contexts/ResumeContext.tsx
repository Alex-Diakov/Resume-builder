import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ResumeData } from '../types';
import { INITIAL_RESUME_DATA } from '../constants';

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  jsonInput: string;
  setJsonInput: (input: string) => void;
  atsInput: string;
  setAtsInput: (input: string) => void;
  jsonError: string | null;
  handleUpdateResumeData: (newData: ResumeData) => void;

  // Layout Controls
  paddingTopBottom: number;
  setPaddingTopBottom: (val: number) => void;
  paddingLeftRight: number;
  setPaddingLeftRight: (val: number) => void;
  sectionSpacing: number;
  setSectionSpacing: (val: number) => void;
  itemSpacing: number;
  setItemSpacing: (val: number) => void;
  spacingPreset: 'standard' | 'compact' | 'super';
  handleApplySpacingPreset: (preset: 'standard' | 'compact' | 'super') => void;
  showPageGuides: boolean;
  setShowPageGuides: (val: boolean) => void;
  
  autoFitContent: () => void;
  resumeHeight: number;
  setResumeHeight: (val: number) => void;
  pageFraction: string;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [jsonInput, setJsonInput] = useState(() => JSON.stringify(INITIAL_RESUME_DATA, null, 2));
  const [atsInput, setAtsInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [paddingTopBottom, setPaddingTopBottom] = useState(12.7);
  const [paddingLeftRight, setPaddingLeftRight] = useState(14);
  const [sectionSpacing, setSectionSpacing] = useState(1.0);
  const [itemSpacing, setItemSpacing] = useState(1.0);
  const [spacingPreset, setSpacingPreset] = useState<'standard' | 'compact' | 'super'>('standard');
  const [showPageGuides, setShowPageGuides] = useState(true);
  
  const [resumeHeight, setResumeHeight] = useState(0);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resume_data_v1');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const merged = { ...INITIAL_RESUME_DATA, ...parsed };
        setResumeData(merged);
        setJsonInput(JSON.stringify(merged, null, 2));
        setAtsInput(merged.atsKeywords || '');
      }
    } catch (e) {
      console.error("Failed to load saved data", e);
    }
  }, []);

  // Debounced parsing of JSON input
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonInput);
        const mergedData = { ...INITIAL_RESUME_DATA, ...parsed, atsKeywords: atsInput };
        setResumeData(mergedData);
        setJsonError(null);
        try {
          localStorage.setItem('resume_data_v1', JSON.stringify(mergedData));
        } catch(e) {}
      } catch (err: any) {
        setJsonError(err.message);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [jsonInput, atsInput]);

  const handleApplySpacingPreset = useCallback((preset: 'standard' | 'compact' | 'super') => {
    setSpacingPreset(preset);
    if (preset === 'standard') {
      setPaddingTopBottom(12.7);
      setPaddingLeftRight(14);
      setSectionSpacing(1.0);
      setItemSpacing(1.0);
    } else if (preset === 'compact') {
      setPaddingTopBottom(10.0);
      setPaddingLeftRight(12.0);
      setSectionSpacing(0.75);
      setItemSpacing(0.75);
    } else if (preset === 'super') {
      setPaddingTopBottom(8.0);
      setPaddingLeftRight(10.0);
      setSectionSpacing(0.55);
      setItemSpacing(0.55);
    }
  }, []);

  const autoFitContent = useCallback(() => {
    const el = document.getElementById('resume-content');
    if (!el) return;
    const pages = el.querySelectorAll('.resume-page');
    
    if (pages.length > 2) {
      handleApplySpacingPreset('super');
    } else {
      handleApplySpacingPreset('compact');
    }
  }, [handleApplySpacingPreset]);

  const handleUpdateResumeData = useCallback((newData: ResumeData) => {
    setResumeData(newData);
    setJsonInput(JSON.stringify(newData, null, 2));
    try {
      localStorage.setItem('resume_data_v1', JSON.stringify(newData));
    } catch(e) {}
  }, []);

  const pageFraction = resumeHeight === 0 ? '2.0' : (resumeHeight / 1122.5).toFixed(1);

  return (
    <ResumeContext.Provider value={{
      resumeData, setResumeData,
      jsonInput, setJsonInput,
      atsInput, setAtsInput,
      jsonError, handleUpdateResumeData,
      paddingTopBottom, setPaddingTopBottom,
      paddingLeftRight, setPaddingLeftRight,
      sectionSpacing, setSectionSpacing,
      itemSpacing, setItemSpacing,
      spacingPreset, handleApplySpacingPreset,
      showPageGuides, setShowPageGuides,
      autoFitContent, resumeHeight, setResumeHeight, pageFraction
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};
