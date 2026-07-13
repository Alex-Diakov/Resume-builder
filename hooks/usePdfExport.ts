import { useState, useCallback } from 'react';
import { ResumeData } from '../types';

export const usePdfExport = (
  resumeData: ResumeData, 
  paddingTopBottom: number, 
  paddingLeftRight: number,
  compressPdf: boolean,
  pdfImageQuality: number
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = useCallback(async () => {
    if (typeof window.html2pdf === 'undefined') {
      alert('PDF generation library not loaded yet. Please wait a moment.');
      return;
    }

    setIsGenerating(true);
    await document.fonts.ready;

    const element = document.getElementById('resume-content');
    if (!element) return;

    const container = document.createElement('div');
    container.style.position = 'fixed'; 
    container.style.left = '-10000px'; 
    container.style.top = '0';
    container.style.width = '210mm'; 
    container.style.backgroundColor = '#ffffff';
    container.style.zIndex = '-9999';
    
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Programmatically purge visual page guide layout elements from the final PDF capture
    const guides = clone.querySelectorAll('.page-guide-indicator');
    guides.forEach(g => g.remove());
    
    // 100% MATH-PERFECT PHYSICAL COPY:
    // Match the screen size exactly (210mm physical width A4) so the export is indistinguishable
    // from the live viewport, and use 0-margin page parameters.
    clone.style.width = '210mm';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.gap = '0';
    clone.style.rowGap = '0';
    clone.style.boxSizing = 'border-box';
    clone.style.backgroundColor = 'transparent';
    clone.classList.remove('mx-auto', 'shadow-xl', 'relative', 'z-0', 'gap-8', 'pb-16'); 

    // Apply strict clean layout styles directly on cloned pages
    const clonedPages = clone.querySelectorAll('.resume-page');
    clonedPages.forEach((page: any, idx: number) => {
      page.style.boxShadow = 'none';
      page.style.border = 'none';
      page.style.borderRadius = '0';
      page.style.margin = '0';
      page.style.width = '210mm';
      page.style.height = '296mm'; // Slightly less than 297mm to prevent subpixel overflow on page boundaries
      page.style.boxSizing = 'border-box';
      page.classList.remove('shadow-xl', 'rounded-md', 'mx-auto');
      
      // Control breaks perfectly per page
      if (idx < clonedPages.length - 1) {
        page.style.pageBreakAfter = 'always';
        page.style.breakAfter = 'page';
      } else {
        page.style.pageBreakAfter = 'avoid';
        page.style.breakAfter = 'avoid';
      }
    });
    
    container.appendChild(clone);
    document.body.appendChild(container);

    // Precise, structured file naming parsing First Name, Last Name, Title, and Business Specialization Type
    const rawFullName = (resumeData.name || 'Resume').trim();
    const nameParts = rawFullName.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const rawTitleAndBusiness = (resumeData.title || '').trim();
    let titlePart = rawTitleAndBusiness;
    let businessTypePart = '';

    // Split role title from business specialization type using standard dividers (| , — -)
    if (rawTitleAndBusiness.includes('|')) {
      const parts = rawTitleAndBusiness.split('|');
      titlePart = parts[0].trim();
      businessTypePart = parts.slice(1).join(' ').trim();
    } else if (rawTitleAndBusiness.includes('—')) {
      const parts = rawTitleAndBusiness.split('—');
      titlePart = parts[0].trim();
      businessTypePart = parts.slice(1).join(' ').trim();
    } else if (rawTitleAndBusiness.includes('-')) {
      const parts = rawTitleAndBusiness.split('-');
      titlePart = parts[0].trim();
      businessTypePart = parts.slice(1).join(' ').trim();
    } else if (rawTitleAndBusiness.includes(',')) {
      const parts = rawTitleAndBusiness.split(',');
      titlePart = parts[0].trim();
      businessTypePart = parts.slice(1).join(' ').trim();
    }

    // Clean all parts to contain only valid OS filename characters and replace spaces with underscores
    const cleanFirst = firstName.replace(/[^a-zA-Z0-9а-яА-Я-]/g, '').trim();
    const cleanLast = lastName.replace(/[^a-zA-Z0-9а-яА-Я- ]/g, '').replace(/\s+/g, '_').trim();
    const cleanTitle = titlePart.replace(/[^a-zA-Z0-9а-яА-Я- ]/g, '').replace(/\s+/g, '_').trim();
    const cleanBusiness = businessTypePart.replace(/[^a-zA-Z0-9а-яА-Я- ]/g, '').replace(/\s+/g, '_').trim();

    // Construct the elegant, descriptive filename
    let nameStr = '';
    if (cleanFirst) nameStr += cleanFirst;
    if (cleanLast) nameStr += (nameStr ? `_${cleanLast}` : cleanLast);
    if (cleanTitle) nameStr += (nameStr ? `_${cleanTitle}` : cleanTitle);
    if (cleanBusiness) nameStr += (nameStr ? `_${cleanBusiness}` : cleanBusiness);

    if (!nameStr) {
      nameStr = 'Resume';
    }

    const fileName = `${nameStr}.pdf`;

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: compressPdf ? 'jpeg' : 'png', quality: compressPdf ? pdfImageQuality : 1.0 }, 
      html2canvas: { 
        scale: compressPdf ? (pdfImageQuality <= 0.4 ? 1.5 : 2.0) : 2.0, 
        useCORS: true, 
        scrollY: 0,
        scrollX: 0,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true // always compress PDF structure losslessly
      },
      pagebreak: { mode: ['css', 'legacy'], avoid: '.break-inside-avoid' }
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      await window.html2pdf().set(opt).from(clone).save();
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF.');
    } finally {
      document.body.removeChild(container);
      setIsGenerating(false);
    }
  }, [resumeData, paddingTopBottom, paddingLeftRight, compressPdf, pdfImageQuality]);

  return { isGenerating, handleDownloadPdf };
};
