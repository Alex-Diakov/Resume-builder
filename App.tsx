import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ResumePaper } from './components/ResumePaper';
import { Printer, Loader2, Edit, Save, Upload, FileJson, Download } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [isAtsEditing, setIsAtsEditing] = useState(false);
  const [atsInput, setAtsInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    document.title = "Senior_Product_Designer_Alex_Diakov_2025";
    const savedData = localStorage.getItem('resume_data_v1');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setResumeData({ ...INITIAL_RESUME_DATA, ...parsed });
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('resume_data_v1', JSON.stringify(resumeData));
  }, [resumeData]);

  // Editing Handlers
  const handleEditClick = () => {
    setJsonInput(JSON.stringify(resumeData, null, 2));
    setJsonError(null);
    setIsEditing(true);
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const mergedData = { ...INITIAL_RESUME_DATA, ...parsed, atsKeywords: resumeData.atsKeywords || parsed.atsKeywords };
      setResumeData(mergedData);
      setIsEditing(false);
    } catch (e: any) {
      setJsonError("Invalid JSON: " + e.message);
    }
  };

  const handleSaveAts = () => {
    setResumeData(prev => ({ ...prev, atsKeywords: atsInput }));
    setIsAtsEditing(false);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "resume_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        const mergedData = { ...INITIAL_RESUME_DATA, ...parsed };
        setResumeData(mergedData);
        if (isEditing) {
          setJsonInput(JSON.stringify(mergedData, null, 2));
        }
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

    // Wait for fonts to be ready
    await document.fonts.ready;

    const element = document.getElementById('resume-content');
    if (!element) return;

    // 1. Create a container specifically sized for A4
    const container = document.createElement('div');
    container.style.position = 'fixed'; 
    container.style.left = '-10000px'; 
    container.style.top = '0';
    container.style.width = '210mm'; // Exact A4 width
    container.style.backgroundColor = '#ffffff';
    container.style.zIndex = '-9999';
    
    // 2. Clone the content
    const clone = element.cloneNode(true) as HTMLElement;
    
    // 3. Set clone properties to fit container
    clone.style.width = '100%';
    clone.style.margin = '0';
    clone.style.boxSizing = 'border-box';
    // Remove positioning/shadow classes that interfere with PDF gen
    clone.classList.remove('mx-auto', 'shadow-xl'); 
    
    container.appendChild(clone);
    document.body.appendChild(container);

    // 4. Configuration for html2pdf
    const opt = {
      margin: 0,
      filename: 'Senior_Product_Designer_Alex_Diakov_2025.pdf',
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { 
        scale: 2, // High resolution
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pb-12 print:bg-white print:pb-0 print:min-h-0 font-sans">
      <nav className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur border-b border-slate-700 shadow-lg px-4 py-3 print:hidden mb-8">
        <div className="max-w-[210mm] mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-resume-accent rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-inner">
               A
             </div>
             <span className="text-white font-semibold tracking-wide hidden sm:inline">Alex Diakov <span className="text-slate-400 font-normal">| Portfolio</span></span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
             <button 
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md font-medium text-xs transition-all border border-slate-600"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Data</span>
            </button>
            <button 
              onClick={() => {
                setAtsInput(resumeData.atsKeywords || '');
                setIsAtsEditing(true);
              }}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md font-medium text-xs transition-all border border-slate-600"
            >
              <FileJson className="w-4 h-4" />
              <span>ATS Text</span>
            </button>
            <button 
               onClick={handleImportClick}
               className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md font-medium text-xs transition-all border border-slate-600"
            >
              <Upload className="w-4 h-4" />
              <span>Load</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".json"
            />
            
            <div className="h-6 w-px bg-slate-600 mx-1 hidden sm:block"></div>

            <button 
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md font-medium text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Download PDF</span>
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-resume-accent hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Editor Modal - Hidden in Print */}
      {isEditing && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-800 w-full max-w-4xl h-[80vh] rounded-xl flex flex-col shadow-2xl border border-slate-700">
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
               <h3 className="text-white font-bold flex items-center gap-2">
                 <FileJson className="w-5 h-5 text-yellow-400" />
                 Resume Data Editor (JSON)
               </h3>
               <button onClick={handleExportJson} className="text-xs text-blue-400 hover:underline">Download JSON Backup</button>
            </div>
            <div className="flex-1 p-0 relative">
               <textarea 
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-full bg-slate-900 text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none"
                  spellCheck={false}
               />
               {jsonError && (
                 <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-red-200 px-4 py-2 rounded border border-red-700 text-sm">
                   {jsonError}
                 </div>
               )}
            </div>
            <div className="p-4 border-t border-slate-700 flex justify-end gap-3 bg-slate-800 rounded-b-xl">
               <button 
                 onClick={() => setIsEditing(false)}
                 className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSaveJson}
                 className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md flex items-center gap-2 shadow-lg hover:shadow-green-500/20 transition-all"
               >
                 <Save className="w-4 h-4" />
                 Save Changes
               </button>
            </div>
          </div>
        </div>
      )}

      {/* ATS Editor Modal */}
      {isAtsEditing && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-800 w-full max-w-4xl h-[80vh] rounded-xl flex flex-col shadow-2xl border border-slate-700">
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
               <h3 className="text-white font-bold flex items-center gap-2">
                 <FileJson className="w-5 h-5 text-purple-400" />
                 Invisible ATS Keywords Setup
               </h3>
               <span className="text-xs text-slate-400">Put plain text here for ATS scraping</span>
            </div>
            <div className="flex-1 p-0 relative">
               <textarea 
                  value={atsInput}
                  onChange={(e) => setAtsInput(e.target.value)}
                  placeholder="Paste your plain text here (job descriptions, extra keywords, etc.). It will be rendered invisibly behind the resume."
                  className="w-full h-full bg-slate-900 text-slate-300 font-sans text-sm p-4 resize-none focus:outline-none"
                  spellCheck={false}
               />
            </div>
            <div className="p-4 border-t border-slate-700 flex justify-end gap-3 bg-slate-800 rounded-b-xl">
               <button 
                 onClick={() => setIsAtsEditing(false)}
                 className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSaveAts}
                 className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-md flex items-center gap-2 shadow-lg hover:shadow-green-500/20 transition-all"
               >
                 <Save className="w-4 h-4" />
                 Save Changes
               </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex justify-center px-4 md:px-8 print:px-0 print:block print:w-full">
        <div className="w-full max-w-[210mm] print:max-w-none print:w-full">
          <div className="mb-4 text-center print:hidden">
            <p className="text-slate-400 text-sm">
              <strong className="text-green-400">New:</strong> Click "Edit Data" to customize your resume. Changes save automatically.
            </p>
          </div>
          
          <ResumePaper data={resumeData} />

          <footer className="mt-12 text-center text-slate-500 text-xs print:hidden">
             <p>&copy; {new Date().getFullYear()} Alex Diakov. Optimized for Print & ATS.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;