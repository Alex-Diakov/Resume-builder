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

  const handleDownloadPdf = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Lazy load the PDF export engine on demand to conserve initial network payload
      const { exportToPdf } = await import('../services/export/pdfExporter');
      await exportToPdf(resumeData, {
        compress: compressPdf,
        quality: pdfImageQuality,
      });
    } catch (err: any) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF: ' + (err?.message || 'Unknown error occurred'));
    } finally {
      setIsGenerating(false);
    }
  }, [resumeData, compressPdf, pdfImageQuality]);

  return { isGenerating, handleDownloadPdf };
};
