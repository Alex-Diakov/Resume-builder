import { useState, useCallback } from 'react';
import { ResumeData } from '../types';

export const useDocExport = (resumeData: ResumeData) => {
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  const handleDownloadDocx = useCallback(async () => {
    setIsGeneratingDoc(true);
    try {
      try {
        const currentCount = parseInt(localStorage.getItem('resume_download_count') || '0', 10);
        localStorage.setItem('resume_download_count', (currentCount + 1).toString());
        window.dispatchEvent(new Event('resume_downloaded'));
      } catch (e) {
        console.error(e);
      }
      const { exportToDocx } = await import('../services/export/docExporter');
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

