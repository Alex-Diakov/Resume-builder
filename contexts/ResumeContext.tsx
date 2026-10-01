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

  // History / Undo / Redo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

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
  compressPdf: boolean;
  setCompressPdf: (val: boolean) => void;
  pdfImageQuality: number;
  setPdfImageQuality: (val: number) => void;
  
  autoFitContent: () => void;
  resumeHeight: number;
  setResumeHeight: (val: number) => void;
  pageFraction: string;
  enableAdaptiveFit: boolean;
  setEnableAdaptiveFit: (val: boolean) => void;
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
  const [compressPdf, setCompressPdf] = useState(false);
  const [pdfImageQuality, setPdfImageQuality] = useState(0.7);
  const [enableAdaptiveFit, setEnableAdaptiveFit] = useState(true);
  
  const [resumeHeight, setResumeHeight] = useState(0);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<ResumeData[]>([INITIAL_RESUME_DATA]);
  const [historyIndex, setHistoryIndex] = useState(0);

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
        setHistory([merged]);
        setHistoryIndex(0);
      }
    } catch (e) {
      console.error("Failed to load saved data", e);
    }
  }, []);

  const handleUpdateResumeData = useCallback((newData: ResumeData) => {
    setResumeData(newData);
    setJsonInput(JSON.stringify(newData, null, 2));
    try {
      localStorage.setItem('resume_data_v1', JSON.stringify(newData));
    } catch(e) {}

    // Push to history
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      const updated = [...sliced, newData];
      // Keep maximum 40 history snapshots
      if (updated.length > 40) {
        return updated.slice(updated.length - 40);
      }
      return updated;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 39));
  }, [historyIndex]);

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

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const target = history[newIndex];
      if (target) {
        setHistoryIndex(newIndex);
        setResumeData(target);
        setJsonInput(JSON.stringify(target, null, 2));
        try {
          localStorage.setItem('resume_data_v1', JSON.stringify(target));
        } catch(e) {}
      }
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const target = history[newIndex];
      if (target) {
        setHistoryIndex(newIndex);
        setResumeData(target);
        setJsonInput(JSON.stringify(target, null, 2));
        try {
          localStorage.setItem('resume_data_v1', JSON.stringify(target));
        } catch(e) {}
      }
    }
  }, [historyIndex, history]);

  // Global Keyboard Shortcuts (Ctrl+Z / Cmd+Z, Ctrl+Y / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''));
      // When user is typing inside an input/textarea, let native text undo work unless Cmd+Shift+Z
      if (isInput) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if ((mod && e.shiftKey && e.key.toLowerCase() === 'z') || (mod && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

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
    if (!el) {
      handleApplySpacingPreset('compact');
      return;
    }
    const pages = el.querySelectorAll('.resume-page');
    
    // Always ensure adaptive anti-void fit is turned ON
    setEnableAdaptiveFit(true);

    if (pages.length > 2) {
      // Content is overflowing into a 3rd page: apply super compact density
      handleApplySpacingPreset('super');
    } else if (pages.length === 2) {
      // Check fill of page 2
      const page2 = pages[1] as HTMLElement;
      const page2Children = page2 ? page2.querySelectorAll('.break-inside-avoid, header, section, h3') : [];
      // If page 2 has very few items, optimize spacing to bring everything onto 1 clean page or balance evenly
      if (page2Children.length <= 2) {
        setPaddingTopBottom(10.0);
        setPaddingLeftRight(12.0);
        setSectionSpacing(0.8);
        setItemSpacing(0.8);
        setSpacingPreset('compact');
      } else {
        // Balanced 2-page spread
        setPaddingTopBottom(11.5);
        setPaddingLeftRight(13.0);
        setSectionSpacing(0.9);
        setItemSpacing(0.9);
        setSpacingPreset('standard');
      }
    } else {
      // Single page: standard comfortable density
      handleApplySpacingPreset('standard');
    }
  }, [handleApplySpacingPreset]);

  const pageFraction = resumeHeight === 0 ? '2.0' : (resumeHeight / 1122.5).toFixed(1);

  return (
    <ResumeContext.Provider value={{
      resumeData, setResumeData,
      jsonInput, setJsonInput,
      atsInput, setAtsInput,
      jsonError, handleUpdateResumeData,
      canUndo, canRedo, undo, redo,
      paddingTopBottom, setPaddingTopBottom,
      paddingLeftRight, setPaddingLeftRight,
      sectionSpacing, setSectionSpacing,
      itemSpacing, setItemSpacing,
      spacingPreset, handleApplySpacingPreset,
      showPageGuides, setShowPageGuides,
      compressPdf, setCompressPdf,
      pdfImageQuality, setPdfImageQuality,
      autoFitContent, resumeHeight, setResumeHeight, pageFraction,
      enableAdaptiveFit, setEnableAdaptiveFit
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
