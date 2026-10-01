import { useState, useCallback } from 'react';
import { ResumeData } from '../types';

export const usePdfExport = (
  resumeData: ResumeData, 
  _paddingTopBottom: number, 
  _paddingLeftRight: number,
  compressPdf: boolean,
  pdfImageQuality: number
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDownloadPdf = useCallback(async () => {
    setIsGenerating(true);
    setPdfError(null);
    try {
      // Lazy load the PDF export engine on demand to conserve initial network payload
      const { exportToPdf } = await import('../services/export/pdfExporter');
      await exportToPdf(resumeData, {
        compress: compressPdf,
        quality: pdfImageQuality,
      });
    } catch (err: any) {
      const errorMsg = err?.message || 'Unknown error occurred';
      console.error('PDF export failed:', err);
      setPdfError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  }, [resumeData, compressPdf, pdfImageQuality]);

  return { isGenerating, handleDownloadPdf, pdfError };
};
