import { useState, useCallback } from 'react';
import { ResumeData } from '../types';

export const useDocExport = (
  resumeData: ResumeData,
  paddingTopBottom: number = 12.7,
  paddingLeftRight: number = 14.0
) => {
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  const handleDownloadDocx = useCallback(async () => {
    setIsGeneratingDoc(true);
    setDocError(null);
    try {
      try {
        const { recordActivity } = await import('../utils/activityStorage');
        recordActivity(
          resumeData.name
            ? `${resumeData.name} (Word DOCX)`
            : 'Professional Resume (Word DOCX)',
          'exported'
        );
      } catch (e) {
        console.error(e);
      }
      const { exportToDocx } = await import('../services/export/docExporter');
      await exportToDocx(resumeData, paddingTopBottom, paddingLeftRight);
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to generate Word document';
      console.error('Error generating DOCX document:', err);
      setDocError(errorMsg);
    } finally {
      setIsGeneratingDoc(false);
    }
  }, [resumeData, paddingTopBottom, paddingLeftRight]);

  return { isGeneratingDoc, handleDownloadDocx, docError };
};
