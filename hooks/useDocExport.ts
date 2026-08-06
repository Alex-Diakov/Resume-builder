import { useState, useCallback } from 'react';
import { ResumeData } from '../types';
import { exportToDocx } from '../utils/docExporter';

export const useDocExport = (resumeData: ResumeData) => {
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  const handleDownloadDocx = useCallback(async () => {
    setIsGeneratingDoc(true);
    try {
      await exportToDocx(resumeData);
    } catch (err) {
      console.error('Error generating DOCX document:', err);
      alert('Failed to generate Word document. Please try again.');
    } finally {
      setIsGeneratingDoc(false);
    }
  }, [resumeData]);

  return { isGeneratingDoc, handleDownloadDocx };
};
