import { useState, useCallback } from 'react';
import { ResumeData } from '../types';

export const useDocExport = (resumeData: ResumeData) => {
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  const handleDownloadDocx = useCallback(async () => {
    setIsGeneratingDoc(true);
    setDocError(null);
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
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to generate Word document';
      console.error('Error generating DOCX document:', err);
      setDocError(errorMsg);
    } finally {
      setIsGeneratingDoc(false);
    }
  }, [resumeData]);

  return { isGeneratingDoc, handleDownloadDocx, docError };
};
