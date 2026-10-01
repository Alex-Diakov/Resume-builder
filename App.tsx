import React, { useCallback, useEffect, useState } from 'react';
import { ResumePaper } from './components/resume';
import { Toolbar, IntroAnimation, DesignSystemPage } from './components/layout';
import { SidebarEditor } from './components/sidebar';
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
  const [activeTab, setActiveTab] = useState<'form' | 'json' | 'cognitive' | 'ats' | 'analytics'>('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDesignSystem, setShowDesignSystem] = useState(false);

  const {
    resumeData,
    setJsonInput,
    setAtsInput,
    paddingTopBottom,
    paddingLeftRight,
    sectionSpacing,
    itemSpacing,
    showPageGuides,
    compressPdf,
    pdfImageQuality,
    enableAdaptiveFit,
  } = useResumeContext();

  useEffect(() => {
    document.title = "Cognitive Resume Analyzer & Builder";
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
        console.error("Failed to parse uploaded JSON resume file:", err);
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
    <div className="h-screen flex flex-col bg-md-surface text-md-on-surface font-sans overflow-hidden print:h-auto print:block print:overflow-visible print:bg-white relative">
      <Toolbar 
        onFileUpload={handleFileUpload}
        onDownloadPdf={handleDownloadPdf}
        onDownloadDocx={handleDownloadDocx}
        onPrint={handlePrint}
        isGenerating={isGenerating}
        isGeneratingDoc={isGeneratingDoc}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenDesignSystem={() => setShowDesignSystem(true)}
      />

      <div className="flex flex-1 overflow-hidden relative print:overflow-visible print:block">
        {/* Sidebar Panel: Desktop collapses to 72px vertical rail, mobile collapses to 0 */}
        <aside 
          className={`shrink-0 transition-[width] duration-300 ease-in-out z-20 print:hidden flex overflow-hidden ${
            sidebarOpen 
              ? 'w-full md:w-[490px] lg:w-[530px] border-r border-white/[0.08]' 
              : 'w-0 md:w-[72px] border-r-0 md:border-r border-white/[0.08]'
          }`}
          aria-label="Application tools"
        >
          <div className="w-full md:w-[490px] lg:w-[530px] shrink-0 h-full overflow-hidden">
            <SidebarEditor
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isExpanded={sidebarOpen}
              onToggleExpand={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
        </aside>

        {/* Main Resume Canvas Area */}
        <main className="flex-1 overflow-y-auto w-full bg-md-surface p-4 md:p-8 flex justify-center print:p-0 print:block print:overflow-visible relative">
          <div className="w-full max-w-[210mm] transition-all duration-300 ease-in-out print:max-w-none print:w-full min-h-full">
            <ResumePaper 
              data={resumeData} 
              paddingTopBottom={paddingTopBottom}
              paddingLeftRight={paddingLeftRight}
              sectionSpacing={sectionSpacing}
              itemSpacing={itemSpacing}
              showPageGuides={showPageGuides}
              enableAdaptiveFit={enableAdaptiveFit}
            />
            <footer className="mt-8 mb-4 text-center text-md-on-surface-variant text-xs print:hidden">
               <p>&copy; {new Date().getFullYear()} Cognitive Resume Analyzer &amp; Builder. Optimized for recruiter attention &amp; print consistency.</p>
            </footer>
          </div>
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
           className="md:hidden fixed inset-0 z-10 bg-black/60 backdrop-blur-sm print:hidden" 
           onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Material 3 (2026 Edition) Design System Modal */}
      {showDesignSystem && (
        <DesignSystemPage onClose={() => setShowDesignSystem(false)} />
      )}
    </div>
  );
};

export default App;
