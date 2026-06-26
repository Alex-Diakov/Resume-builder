import React, { useCallback, useEffect, useState } from 'react';
import { ResumePaper } from './components/ResumePaper';
import { Toolbar } from './components/Toolbar';
import { SidebarEditor } from './components/SidebarEditor';
import { IntroAnimation } from './components/IntroAnimation';
import { INITIAL_RESUME_DATA } from './constants';
import { useResumeContext } from './contexts/ResumeContext';

// Declare html2pdf on window
declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('intro_seen_v2');
    } catch (e) {
      return true;
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'json' | 'cognitive' | 'ats'>('form');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    resumeData,
    setJsonInput,
    setAtsInput,
    paddingTopBottom,
    paddingLeftRight,
    sectionSpacing,
    itemSpacing,
    showPageGuides,
    // Add these so they are accessible
    jsonInput,
    atsInput,
    jsonError,
    handleUpdateResumeData,
    setPaddingTopBottom,
    setPaddingLeftRight,
    setSectionSpacing,
    setItemSpacing,
    spacingPreset,
    handleApplySpacingPreset,
    setShowPageGuides,
    autoFitContent,
    pageFraction,
    resumeHeight,
  } = useResumeContext();

  useEffect(() => {
    document.title = "Resume Builder Pro";
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        const mergedData = { ...INITIAL_RESUME_DATA, ...parsed };
        setJsonInput(JSON.stringify(mergedData, null, 2));
        setAtsInput(mergedData.atsKeywords || '');
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

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
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0,
        scrollX: 0,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
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
  }, [resumeData, paddingTopBottom, paddingLeftRight]);

  if (showIntro) {
    return (
      <IntroAnimation 
        onComplete={() => {
          setShowIntro(false);
          try {
            sessionStorage.setItem('intro_seen_v2', 'true');
          } catch (e) {}
        }} 
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ds-bg font-sans overflow-hidden print:h-auto print:block print:overflow-visible print:bg-white relative">
      <Toolbar 
        onFileUpload={handleFileUpload}
        onDownloadPdf={handleDownloadPdf}
        onPrint={handlePrint}
        isGenerating={isGenerating}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative print:overflow-visible print:block">
        {/* Sidebar Panel */}
        <div 
          className={`shrink-0 transition-all duration-300 ease-in-out z-20 print:hidden ${
            sidebarOpen ? 'w-full md:w-96 lg:w-[450px] border-r border-slate-700' : 'w-0 border-r-0'
          }`}
        >
          <div className="w-full md:w-96 lg:w-[450px] shrink-0 h-full overflow-hidden animate-fade-in">
            <SidebarEditor
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* Main Resume Canvas Area */}
        <main className="flex-1 overflow-y-auto w-full bg-ds-bg/85 p-4 md:p-8 flex justify-center print:p-0 print:block print:overflow-visible relative">
          <div className="w-full max-w-[210mm] transition-all duration-300 ease-in-out print:max-w-none print:w-full min-h-full">
            


            <ResumePaper 
              data={resumeData} 
              paddingTopBottom={paddingTopBottom}
              paddingLeftRight={paddingLeftRight}
              sectionSpacing={sectionSpacing}
              itemSpacing={itemSpacing}
              showPageGuides={showPageGuides}
            />
            <footer className="mt-8 mb-4 text-center text-slate-500 text-xs print:hidden">
               <p>&copy; {new Date().getFullYear()} Resume Builder Pro. Optimized for Recruiter delivery & print consistency.</p>
            </footer>
          </div>
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
           className="md:hidden fixed inset-0 z-10 bg-black/60 print:hidden" 
           onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
