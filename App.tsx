import React, { useCallback, useEffect, useState } from 'react';
import { Brain, Code2, Sliders } from 'lucide-react';
import { ResumePaper } from './components/ResumePaper';
import { Toolbar } from './components/Toolbar';
import { SidebarEditor } from './components/SidebarEditor';
import { INITIAL_RESUME_DATA } from './constants';
import { ResumeData } from './types';

// Declare html2pdf on window
declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [jsonInput, setJsonInput] = useState(() => JSON.stringify(INITIAL_RESUME_DATA, null, 2));
  const [atsInput, setAtsInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  // Layout Controls State
  const [paddingTopBottom, setPaddingTopBottom] = useState(12.7);
  const [paddingLeftRight, setPaddingLeftRight] = useState(14);
  const [sectionSpacing, setSectionSpacing] = useState(1.0);
  const [itemSpacing, setItemSpacing] = useState(1.0);
  const [spacingPreset, setSpacingPreset] = useState<'standard' | 'compact' | 'super'>('standard');
  const [showPageGuides, setShowPageGuides] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'form' | 'json' | 'ats'>('form');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resumeHeight, setResumeHeight] = useState(0);

  // Load from LocalStorage on mount
  useEffect(() => {
    document.title = "Resume Builder Pro";
    const savedData = localStorage.getItem('resume_data_v1');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure mergedData has all keys
        const merged = { ...INITIAL_RESUME_DATA, ...parsed };
        setResumeData(merged);
        setJsonInput(JSON.stringify(merged, null, 2));
        setAtsInput(merged.atsKeywords || '');
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  // Monitor Height for Live A4 Split Statistics
  useEffect(() => {
    const el = document.getElementById('resume-content');
    if (!el) return;
    
    // Initial value setup
    setResumeHeight(el.clientHeight);

    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setResumeHeight(entry.target.clientHeight);
      }
    });
    
    obs.observe(el);
    return () => obs.disconnect();
  }, [resumeData, paddingTopBottom, paddingLeftRight, sectionSpacing, itemSpacing, activeTab, sidebarOpen]);

  // Debounced parsing of JSON input
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonInput);
        const mergedData = { ...INITIAL_RESUME_DATA, ...parsed, atsKeywords: atsInput };
        setResumeData(mergedData);
        setJsonError(null);
        localStorage.setItem('resume_data_v1', JSON.stringify(mergedData));
      } catch (err: any) {
        setJsonError(err.message);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [jsonInput, atsInput]);

  // Apply Spacing Presets
  const handleApplySpacingPreset = (preset: 'standard' | 'compact' | 'super') => {
    setSpacingPreset(preset);
    if (preset === 'standard') {
      setPaddingTopBottom(12.7);
      setPaddingLeftRight(14);
      setSectionSpacing(1.0);
      setItemSpacing(1.0);
    } else if (preset === 'compact') {
      setPaddingTopBottom(10.0);
      setPaddingLeftRight(12.0);
      setSectionSpacing(0.75);
      setItemSpacing(0.75);
    } else if (preset === 'super') {
      setPaddingTopBottom(8.0);
      setPaddingLeftRight(10.0);
      setSectionSpacing(0.55);
      setItemSpacing(0.55);
    }
  };

  // Auto-fit function inside App to adjust spacings dynamically based on page overflow
  const autoFitContent = useCallback(() => {
    const el = document.getElementById('resume-content');
    if (!el) return;
    const height = el.clientHeight;
    
    // Standard 2 A4 pages height is around 2245 pixels
    if (height > 2245) {
      // Over second page, apply super-compact settings
      setSpacingPreset('super');
      setPaddingTopBottom(8.0);
      setPaddingLeftRight(10.0);
      setSectionSpacing(0.55);
      setItemSpacing(0.55);
    } else {
      // Small/moderate spill, compact preset is perfect
      setSpacingPreset('compact');
      setPaddingTopBottom(10.0);
      setPaddingLeftRight(12.0);
      setSectionSpacing(0.75);
      setItemSpacing(0.75);
    }
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
    clone.style.paddingTop = `${paddingTopBottom}mm`;
    clone.style.paddingBottom = `${paddingTopBottom}mm`;
    clone.style.paddingLeft = `${paddingLeftRight}mm`;
    clone.style.paddingRight = `${paddingLeftRight}mm`;
    clone.style.minHeight = '297mm';
    clone.style.boxSizing = 'border-box';
    clone.style.backgroundColor = '#ffffff';
    clone.classList.remove('mx-auto', 'shadow-xl', 'relative', 'z-0'); 
    
    container.appendChild(clone);
    document.body.appendChild(container);

    // Clean, direct, human-authored file naming based on user's exact name
    const rawName = resumeData.name || 'Resume';
    // Remove invalid OS characters, replace spaces with underscores, support Cyrillic characters cleanly
    const nameStr = rawName.trim().replace(/[^a-zA-Z0-9а-яА-Я- ]/g, '').replace(/\s+/g, '_');
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

  const handleUpdateResumeData = (newData: ResumeData) => {
    setResumeData(newData);
    setJsonInput(JSON.stringify(newData, null, 2));
    localStorage.setItem('resume_data_v1', JSON.stringify(newData));
  };

  // Convert height in pixels to actual A4 fraction
  // Page height is 297mm. At 96DPI, 297mm equals 297 * 3.7795 px = 1122.5 pixels
  const pageFraction = resumeHeight === 0 ? '2.0' : (resumeHeight / 1122.5).toFixed(1);

  return (
    <div className="h-screen flex flex-col bg-slate-900 font-sans overflow-hidden print:h-auto print:block print:overflow-visible print:bg-white relative">
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
              jsonInput={jsonInput}
              setJsonInput={setJsonInput}
              atsInput={atsInput}
              setAtsInput={setAtsInput}
              jsonError={jsonError}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              
              paddingTopBottom={paddingTopBottom}
              setPaddingTopBottom={setPaddingTopBottom}
              paddingLeftRight={paddingLeftRight}
              setPaddingLeftRight={setPaddingLeftRight}
              sectionSpacing={sectionSpacing}
              setSectionSpacing={setSectionSpacing}
              itemSpacing={itemSpacing}
              setItemSpacing={setItemSpacing}
              spacingPreset={spacingPreset}
              onApplySpacingPreset={handleApplySpacingPreset}
              showPageGuides={showPageGuides}
              setShowPageGuides={setShowPageGuides}
              
              resumeData={resumeData}
              onChangeData={handleUpdateResumeData}
              autoFitContent={autoFitContent}
              pageFraction={pageFraction}
            />
          </div>
        </div>

        {/* Main Resume Canvas Area */}
        <main className="flex-1 overflow-y-auto w-full bg-slate-950/70 p-4 md:p-8 flex justify-center print:p-0 print:block print:overflow-visible relative">
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
