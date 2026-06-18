import React, { useCallback, useEffect, useState } from 'react';
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
  
  const [activeTab, setActiveTab] = useState<'json' | 'ats'>('json');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load from LocalStorage on mount
  useEffect(() => {
    document.title = "ResumeBuilder_Live";
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
    clone.style.width = '100%';
    clone.style.margin = '0';
    clone.style.boxSizing = 'border-box';
    clone.classList.remove('mx-auto', 'shadow-xl', 'relative', 'z-0'); 
    
    container.appendChild(clone);
    document.body.appendChild(container);

    const fileName = (resumeData.name || 'Resume').replace(/\s+/g, '_') + '_2025.pdf';

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      await window.html2pdf().set(opt).from(clone).save();
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF.');
    } finally {
      document.body.removeChild(container);
      setIsGenerating(false);
    }
  }, [resumeData.name]);

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
          <div className="w-full md:w-96 lg:w-[450px] shrink-0 h-full overflow-hidden">
            <SidebarEditor
              jsonInput={jsonInput}
              setJsonInput={setJsonInput}
              atsInput={atsInput}
              setAtsInput={setAtsInput}
              jsonError={jsonError}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* Main Resume Canvas Area */}
        <main className="flex-1 overflow-y-auto w-full bg-slate-900/50 p-4 md:p-8 flex justify-center print:p-0 print:block print:overflow-visible">
          <div className="w-full max-w-[210mm] transition-all duration-300 ease-in-out print:max-w-none print:w-full min-h-full">
            <ResumePaper data={resumeData} />
            <footer className="mt-8 mb-4 text-center text-slate-500 text-xs print:hidden">
               <p>&copy; {new Date().getFullYear()} Modern Resume API. Optimized for Scanners & Reviewers.</p>
            </footer>
          </div>
        </main>
      </div>
      
      {/* Mobile Overlay: If sidebar is open on small screens, dim the background */}
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
