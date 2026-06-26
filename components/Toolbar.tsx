import React from 'react';
import { Download, Loader2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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
  return (
    <nav className="shrink-0 z-50 bg-ds-panel/95 backdrop-blur-xl border-b border-ds-border px-6 py-3.5 print:hidden">
      <div className="w-full flex items-center justify-between gap-4">
        {/* App Title / Brand & Toggle Sidebar */}
        <div className="flex items-center gap-4">
           <button 
             onClick={onToggleSidebar}
             className="p-2.5 text-ds-text-muted hover:text-ds-text-high hover:bg-ds-hover rounded-xl transition-all cursor-pointer duration-200 active:scale-95"
             title={sidebarOpen ? "Hide Left Panel" : "Show Left Panel"}
           >
             {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
           </button>
           
           <div className="flex items-center gap-2.5">
             <div className="h-9 w-9 bg-gradient-to-tr from-ds-primary to-purple-400 rounded-full flex items-center justify-center text-white font-extrabold text-base shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
               R
             </div>
             <div>
               <h1 className="text-ds-text-high font-bold text-sm tracking-tight flex items-center gap-1.5 font-display">
                 Resume Studio <span className="bg-ds-primary/20 text-ds-border-focus text-[9.5px] px-2 py-0.5 rounded-full font-mono font-medium border border-[#bb86fc]/25">M3 2026</span>
               </h1>
               <p className="text-[10px] text-ds-text-muted/85 -mt-0.5 font-medium hidden xs:block">Realtime ATS Scoring & Page Budget Calibration</p>
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onDownloadPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-ds-primary hover:bg-ds-primary-hover disabled:bg-ds-active text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 shadow-[0_4px_12px_rgba(168,85,247,0.25)] hover:shadow-glow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-sans cursor-pointer uppercase tracking-wider"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4 text-white" />
            )}
            <span>Export Document</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
