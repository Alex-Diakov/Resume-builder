import React, { useState, useRef, useEffect } from 'react';
import { Switch } from "./ui/Switch";
import { Download, Loader2, PanelLeftClose, PanelLeftOpen, ChevronDown, FileDown, FileText, FileType, Printer } from 'lucide-react';
import { useResumeContext } from '../contexts/ResumeContext';
import { motion, AnimatePresence } from 'motion/react';

interface ToolbarProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadPdf: () => void;
  onDownloadDocx: () => void;
  onPrint: () => void;
  isGenerating: boolean;
  isGeneratingDoc?: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onFileUpload,
  onDownloadPdf,
  onDownloadDocx,
  onPrint,
  isGenerating,
  isGeneratingDoc = false,
  sidebarOpen,
  onToggleSidebar
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { compressPdf, setCompressPdf, pdfImageQuality, setPdfImageQuality } = useResumeContext();

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const getCompressionEstimate = () => {
    if (!compressPdf) return { size: '~1.5 - 2.5 MB', savings: '0%' };
    if (pdfImageQuality <= 0.4) return { size: '~150 - 250 KB', savings: '~90%' };
    if (pdfImageQuality <= 0.7) return { size: '~300 - 500 KB', savings: '~75%' };
    return { size: '~500 - 800 KB', savings: '~60%' };
  };

  const estimate = getCompressionEstimate();

  return (
    <nav className="shrink-0 z-50 bg-ds-panel/95 backdrop-blur-xl border-b border-ds-border px-6 py-3.5 print:hidden">
      <div className="w-full flex items-center justify-between gap-4">
        {/* App Title / Brand & Toggle Sidebar */}
        <div className="flex items-center gap-4">
           <button 
             onClick={onToggleSidebar}
             className="p-2.5 text-ds-text-muted hover:text-ds-text-high hover:bg-ds-hover rounded-xl transition-all cursor-pointer duration-200 active:scale-95 focus:outline-none focus-visible:outline-none focus:ring-0"
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
          
          {/* Quick Word DOCX Export Button */}
          <button
            onClick={onDownloadDocx}
            disabled={isGeneratingDoc || isGenerating}
            className="hidden sm:flex items-center gap-2 bg-ds-panel hover:bg-ds-hover border border-ds-border hover:border-ds-border-focus text-ds-text-high px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-sans cursor-pointer uppercase tracking-wider shadow-sm"
            title="Export as Microsoft Word (.docx)"
          >
            {isGeneratingDoc ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <FileType className="w-4 h-4 text-cyan-400" />
            )}
            <span>Export DOCX</span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <div className="flex group">
              <button
                onClick={onDownloadPdf}
                disabled={isGenerating || isGeneratingDoc}
                className="flex items-center gap-2 bg-ds-primary hover:bg-ds-primary-hover focus-visible:bg-ds-primary-hover focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-panel disabled:bg-ds-active text-white pl-5 pr-4 py-2.5 rounded-l-xl font-semibold text-xs transition-all duration-200 shadow-[0_4px_12px_rgba(168,85,247,0.25)] group-hover:shadow-[0_4px_16px_rgba(168,85,247,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-sans cursor-pointer uppercase tracking-wider border-r border-ds-primary-hover/50 relative z-10"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-white" />
                )}
                <span>Export PDF</span>
              </button>
              
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={isGenerating || isGeneratingDoc}
                className="bg-ds-primary hover:bg-ds-primary-hover focus-visible:bg-ds-primary-hover focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-panel disabled:bg-ds-active text-white px-2 rounded-r-xl transition-all duration-200 flex items-center justify-center cursor-pointer group-hover:shadow-[0_4px_16px_rgba(168,85,247,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                aria-label="Export settings"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full right-0 mt-3 w-80 bg-ds-container border border-ds-border rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] p-4 z-[100] origin-top-right"
                >
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#312e39]/50">
                     <div className="flex items-center gap-2">
                       <FileDown className="w-4 h-4 text-ds-primary" />
                       <span className="font-bold text-[10px] uppercase tracking-wider text-ds-text-high font-display">Export Formats & Options</span>
                     </div>
                  </div>

                  {/* FORMAT ACTIONS */}
                  <div className="space-y-2 mb-4 pb-3 border-b border-[#312e39]/50">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onDownloadDocx();
                      }}
                      disabled={isGeneratingDoc}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-ds-panel hover:bg-ds-hover border border-ds-border hover:border-cyan-500/50 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                          <FileType className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-ds-text-high group-hover:text-cyan-300">Microsoft Word (.docx)</span>
                          <span className="block text-[10px] text-ds-text-muted">Editable & ATS Recruiter Ready</span>
                        </div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-ds-text-muted group-hover:text-cyan-300" />
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onDownloadPdf();
                      }}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-ds-panel hover:bg-ds-hover border border-ds-border hover:border-ds-primary/50 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-ds-primary/10 text-ds-primary group-hover:bg-ds-primary/20">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-ds-text-high group-hover:text-ds-primary">PDF Document (.pdf)</span>
                          <span className="block text-[10px] text-ds-text-muted">Vector layout & pixel perfect</span>
                        </div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-ds-text-muted group-hover:text-ds-primary" />
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onPrint();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-ds-panel hover:bg-ds-hover border border-ds-border hover:border-purple-500/50 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                          <Printer className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-ds-text-high group-hover:text-purple-300">Direct Print</span>
                          <span className="block text-[10px] text-ds-text-muted">Send straight to printer</span>
                        </div>
                      </div>
                      <Printer className="w-3.5 h-3.5 text-ds-text-muted group-hover:text-purple-300" />
                    </button>
                  </div>

                  {/* PDF COMPRESSION TOGGLE */}
                  <div 
                    className="flex items-center justify-between cursor-pointer group mb-3 p-2 rounded-xl hover:bg-ds-hover transition-colors -mx-2"
                    onClick={() => setCompressPdf(!compressPdf)}
                  >
                    <div>
                      <span className="block text-[11px] text-ds-text-high font-bold uppercase tracking-wider transition-colors group-hover:text-ds-primary">Compress PDF</span>
                      <span className="block text-[10px] text-ds-text-muted mt-0.5 transition-colors group-hover:text-ds-text-high">Reduce PDF file size</span>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-0 ${
                        compressPdf ? 'bg-ds-primary shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-[#49454f]'
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                        compressPdf ? 'translate-x-3.5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* PDF IMAGE QUALITY CONTROLS */}
                  {compressPdf && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-3 border-t border-[#312e39]/50 space-y-4"
                    >
                      <div>
                        <span className="block text-[10px] text-ds-text-medium font-bold uppercase tracking-wider mb-2">PDF Compression Level</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'small', label: 'Smallest', value: 0.4 },
                            { id: 'balanced', label: 'Balanced', value: 0.7 },
                            { id: 'high', label: 'High Res', value: 0.9 }
                          ].map((preset) => {
                            const closestPreset = [0.4, 0.7, 0.9].reduce((prev, curr) => 
                              Math.abs(curr - pdfImageQuality) < Math.abs(prev - pdfImageQuality) ? curr : prev
                            );
                            const isActive = closestPreset === preset.value;
                            return (
                              <button
                                key={preset.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPdfImageQuality(preset.value);
                                }}
                                className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all uppercase tracking-wider text-center cursor-pointer select-none border focus:outline-none focus-visible:outline-none focus:ring-0 ${
                                  isActive 
                                    ? 'bg-ds-primary text-white border-ds-primary-hover shadow-[0_0_12px_rgba(168,85,247,0.3)] scale-[1.02]' 
                                    : 'bg-ds-panel text-ds-text-medium border-ds-border hover:bg-ds-hover hover:text-ds-text-high hover:border-ds-border-focus'
                                }`}
                              >
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-4 border border-[#312e39]/50 bg-[#1c1b21]/60 rounded-xl p-3.5 flex flex-col gap-2 shadow-inner">
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] text-ds-text-muted font-bold uppercase tracking-wider">Estimated PDF Size</span>
                       <span className="text-xs font-mono font-bold text-ds-text-high">{estimate.size}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] text-ds-text-muted font-bold uppercase tracking-wider">Storage Savings</span>
                       <span className="text-[11px] font-mono font-bold text-green-400">{estimate.savings}</span>
                     </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

