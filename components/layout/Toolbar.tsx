import React, { useState, useRef, useEffect } from 'react';
import { Switch } from '../ui/Switch';
import { Badge } from '../ui/Badge';
import { Download, Loader2, PanelLeftClose, PanelLeftOpen, ChevronDown, FileDown, FileText, FileType, Printer, Sparkles } from 'lucide-react';
import { useResumeContext } from '../../contexts/ResumeContext';
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
  onOpenDesignSystem?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onFileUpload,
  onDownloadPdf,
  onDownloadDocx,
  onPrint,
  isGenerating,
  isGeneratingDoc = false,
  sidebarOpen,
  onToggleSidebar,
  onOpenDesignSystem
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
    <nav className="shrink-0 z-50 bg-ds-panel/95 backdrop-blur-xl border-b border-ds-border px-4 sm:px-6 py-2.5 sm:py-3 print:hidden transition-colors">
      <div className="w-full flex items-center justify-between gap-4">
        {/* App Title / Brand & Toggle Sidebar */}
        <div className="flex items-center gap-3 sm:gap-4">
           <button 
             onClick={onToggleSidebar}
             className="p-2 text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover rounded-ds-md border border-transparent hover:border-ds-border transition-all cursor-pointer duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/40"
             title={sidebarOpen ? "Hide Left Panel" : "Show Left Panel"}
             aria-label={sidebarOpen ? "Hide Left Panel" : "Show Left Panel"}
           >
             {sidebarOpen ? <PanelLeftClose className="w-4.5 h-4.5" /> : <PanelLeftOpen className="w-4.5 h-4.5" />}
           </button>
           
           <div className="flex items-center gap-2.5">
             <div className="h-8.5 w-8.5 bg-gradient-to-tr from-ds-primary to-purple-400 rounded-ds-md flex items-center justify-center text-white font-extrabold text-sm shadow-ds-sm select-none">
               R
             </div>
             <div>
               <h1 className="text-ds-text-high font-bold text-sm tracking-tight flex items-center gap-2 font-display">
                 <span>Resume Studio</span>
                 <button
                   type="button"
                   onClick={onOpenDesignSystem}
                   className="group/badge inline-flex items-center gap-1 bg-ds-primary/15 hover:bg-ds-primary/30 text-ds-primary hover:text-white text-[9.5px] px-2.5 py-0.5 rounded-full font-mono font-medium border border-ds-primary/30 hover:border-ds-primary transition-all duration-200 cursor-pointer active:scale-95 shadow-ds-sm select-none"
                   title="Open Material 3 Design System"
                 >
                   <span>M3 2026</span>
                   <Sparkles className="w-2.5 h-2.5 text-ds-secondary group-hover/badge:rotate-12 transition-transform" />
                 </button>
               </h1>
               <p className="text-[10px] text-ds-text-muted -mt-0.5 font-medium hidden xs:block">Realtime ATS Scoring & Page Budget Calibration</p>
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <div className="flex group shadow-ds-sm">
              <button
                onClick={onDownloadPdf}
                disabled={isGenerating || isGeneratingDoc}
                className="flex items-center gap-2 bg-ds-primary hover:bg-ds-primary-hover focus-visible:bg-ds-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/50 disabled:bg-ds-active text-white pl-4 pr-3.5 py-2 rounded-l-ds-md font-semibold text-xs transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed font-sans cursor-pointer uppercase tracking-wider border-r border-ds-primary-hover/50 relative z-10"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-white" />
                )}
                <span>Export PDF</span>
              </button>
              
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={isGenerating || isGeneratingDoc}
                className="bg-ds-primary hover:bg-ds-primary-hover focus-visible:bg-ds-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/50 disabled:bg-ds-active text-white px-2 rounded-r-ds-md transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                aria-label="Export settings"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full right-0 mt-2.5 w-80 bg-ds-container border border-ds-border rounded-ds-lg shadow-ds-lg p-3.5 z-[100] origin-top-right"
                >
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-ds-border">
                     <div className="flex items-center gap-2">
                       <FileDown className="w-4 h-4 text-ds-primary" />
                       <span className="font-semibold text-[11px] uppercase tracking-wider text-ds-text-high font-sans">Export Formats & Options</span>
                     </div>
                  </div>

                  {/* FORMAT ACTIONS */}
                  <div className="space-y-1.5 mb-3.5 pb-3 border-b border-ds-border">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onDownloadDocx();
                      }}
                      disabled={isGeneratingDoc}
                      className="w-full flex items-center justify-between p-2 rounded-ds-md bg-ds-panel hover:bg-ds-hover border border-ds-border hover:border-ds-secondary/50 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-ds-sm bg-ds-secondary/10 text-ds-secondary group-hover:bg-ds-secondary/20">
                          <FileType className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-ds-text-high group-hover:text-ds-secondary">Microsoft Word (.docx)</span>
                          <span className="block text-[10px] text-ds-text-muted">Editable & ATS Recruiter Ready</span>
                        </div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-ds-text-muted group-hover:text-ds-secondary" />
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onDownloadPdf();
                      }}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-between p-2 rounded-ds-md bg-ds-panel hover:bg-ds-hover border border-ds-border hover:border-ds-primary/50 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-ds-sm bg-ds-primary/10 text-ds-primary group-hover:bg-ds-primary/20">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-ds-text-high group-hover:text-ds-primary">PDF Document (.pdf)</span>
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
                      className="w-full flex items-center justify-between p-2 rounded-ds-md bg-ds-panel hover:bg-ds-hover border border-ds-border hover:border-ds-primary/40 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-ds-sm bg-ds-primary/10 text-ds-primary group-hover:bg-ds-primary/20">
                          <Printer className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-ds-text-high group-hover:text-ds-primary">Direct Print</span>
                          <span className="block text-[10px] text-ds-text-muted">Send straight to printer</span>
                        </div>
                      </div>
                      <Printer className="w-3.5 h-3.5 text-ds-text-muted group-hover:text-ds-primary" />
                    </button>
                  </div>

                  {/* PDF COMPRESSION TOGGLE */}
                  <div className="flex items-center justify-between mb-3 p-2 rounded-ds-md hover:bg-ds-hover transition-colors">
                    <div>
                      <span className="block text-[11px] text-ds-text-high font-semibold uppercase tracking-wider">Compress PDF</span>
                      <span className="block text-[10px] text-ds-text-muted mt-0.5">Reduce output PDF file footprint</span>
                    </div>
                    <Switch
                      checked={compressPdf}
                      onCheckedChange={setCompressPdf}
                      size="sm"
                    />
                  </div>

                  {/* PDF IMAGE QUALITY CONTROLS */}
                  {compressPdf && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2.5 border-t border-ds-border space-y-3"
                    >
                      <div>
                        <span className="block text-[10px] text-ds-text-medium font-semibold uppercase tracking-wider mb-2">PDF Compression Level</span>
                        <div className="grid grid-cols-3 gap-1.5">
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
                                className={`py-1.5 px-1 rounded-ds-md text-[10px] font-semibold transition-all uppercase tracking-wider text-center cursor-pointer select-none border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-primary/40 ${
                                  isActive 
                                    ? 'bg-ds-primary text-white border-ds-primary shadow-ds-sm' 
                                    : 'bg-ds-panel text-ds-text-medium border-ds-border hover:bg-ds-hover hover:text-ds-text-high hover:border-ds-border-focus/40'
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

                  <div className="mt-3 border border-ds-border bg-ds-panel rounded-ds-md p-3 flex flex-col gap-2">
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] text-ds-text-muted font-semibold uppercase tracking-wider">Estimated PDF Size</span>
                       <span className="text-xs font-mono font-semibold text-ds-text-high">{estimate.size}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-[10px] text-ds-text-muted font-semibold uppercase tracking-wider">Storage Savings</span>
                       <span className="text-[11px] font-mono font-bold text-ds-success">{estimate.savings}</span>
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

