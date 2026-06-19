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
    <nav className="shrink-0 z-50 bg-[#141218]/95 backdrop-blur-xl border-b border-[#2d2a33] px-6 py-3.5 print:hidden">
      <div className="w-full flex items-center justify-between gap-4">
        {/* App Title / Brand & Toggle Sidebar */}
        <div className="flex items-center gap-4">
           <button 
             onClick={onToggleSidebar}
             className="p-2.5 text-[#cac4d0] hover:text-[#e6e1e5] hover:bg-[#2b2930] rounded-full transition-all duration-200 active:scale-95"
             title={sidebarOpen ? "Hide Left Panel" : "Show Left Panel"}
           >
             {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
           </button>
           
           <div className="flex items-center gap-2.5">
             <div className="h-9 w-9 bg-gradient-to-tr from-[#6750A4] to-[#bb86fc] rounded-full flex items-center justify-center text-white font-extrabold text-base shadow-[0_2px_8px_rgba(103,80,164,0.4)]">
               R
             </div>
             <div>
               <h1 className="text-[#e6e1e5] font-bold text-sm tracking-tight flex items-center gap-1.5 font-display">
                 Resume Studio <span className="bg-[#4f378b]/40 text-[#bb86fc] text-[9.5px] px-2 py-0.5 rounded-full font-mono font-medium border border-[#bb86fc]/25">M3 2026</span>
               </h1>
               <p className="text-[10px] text-[#cac4d0]/60 -mt-0.5 font-medium hidden xs:block">Realtime ATS Scoring & Page Budget Calibration</p>
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onDownloadPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-[#6750A4] hover:bg-[#7c52ff] disabled:bg-[#4f378b]/45 text-white px-5 py-2.5 rounded-full font-semibold text-xs transition-all duration-200 shadow-[0_4px_12px_rgba(103,80,164,0.3)] hover:shadow-[0_6px_16px_rgba(103,80,164,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-sans cursor-pointer uppercase tracking-wider"
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
