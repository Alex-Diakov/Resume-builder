import React, { useCallback, useEffect, useState } from 'react';
import { ResumePaper } from './components/ResumePaper';
import { Toolbar } from './components/Toolbar';
import { SidebarEditor } from './components/SidebarEditor';
import { IntroAnimation } from './components/IntroAnimation';
import { INITIAL_RESUME_DATA } from './constants';
import { useResumeContext } from './contexts/ResumeContext';
import { usePdfExport } from './hooks/usePdfExport';
import { useDocExport } from './hooks/useDocExport';

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
    compressPdf,
    pdfImageQuality,
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

  const { isGenerating, handleDownloadPdf } = usePdfExport(resumeData, paddingTopBottom, paddingLeftRight, compressPdf, pdfImageQuality);
  const { isGeneratingDoc, handleDownloadDocx } = useDocExport(resumeData);

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
        onDownloadDocx={handleDownloadDocx}
        onPrint={handlePrint}
        isGenerating={isGenerating}
        isGeneratingDoc={isGeneratingDoc}
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
