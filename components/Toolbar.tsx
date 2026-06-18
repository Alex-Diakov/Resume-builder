import React, { useRef } from 'react';
import { Upload, Download, Printer, Loader2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface ToolbarProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
  isGenerating: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onFileUpload,
  onDownloadPdf,
  onPrint,
  isGenerating,
  sidebarOpen,
  onToggleSidebar
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <nav className="shrink-0 z-50 bg-slate-800/95 backdrop-blur border-b border-slate-700 shadow-sm px-4 py-3 print:hidden">
      <div className="w-full flex items-center justify-between gap-4">
        {/* App Title / Brand & Toggle Sidebar */}
        <div className="flex items-center gap-3">
           <button 
             onClick={onToggleSidebar}
             className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
             title={sidebarOpen ? "Close Editor" : "Open Editor"}
           >
             {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
           </button>
           <div className="w-8 h-8 bg-resume-accent rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-inner">
             R
           </div>
           <span className="text-white font-semibold tracking-wide hidden sm:inline">Resume <span className="text-slate-400 font-normal">Builder</span></span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md font-medium text-xs transition-all border border-slate-600 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Load JSON</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            className="hidden"
            accept=".json"
          />

          <div className="h-6 w-px bg-slate-600 mx-1 hidden sm:block"></div>

          <button
            onClick={onPrint}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-resume-accent hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
