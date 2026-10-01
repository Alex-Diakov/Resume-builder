import React, { useState, useRef, useEffect } from 'react';
import { Switch } from '../ui/Switch';
import { 
  Download, 
  Loader2, 
  ChevronDown, 
  FileDown, 
  FileText, 
  FileType, 
  Printer, 
  Undo2, 
  Redo2, 
  Palette, 
  SlidersHorizontal
} from 'lucide-react';
import { useResumeContext } from '../../contexts/ResumeContext';
import { getCompressionProfile } from '../../services/export/pdfExporter';
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
  onFileUpload: _onFileUpload,
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
  
  const { 
    resumeData,
    compressPdf, 
    setCompressPdf, 
    pdfImageQuality, 
    setPdfImageQuality,
    pageFraction,
    canUndo,
    canRedo,
    undo,
    redo
  } = useResumeContext();

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

  const pageCount = Math.max(1, Math.round(Number(pageFraction) || 2));
  const compressionProfile = getCompressionProfile(compressPdf, pdfImageQuality, pageCount);

  return (
    <nav className="shrink-0 z-50 h-14 bg-md-surface-container-low/95 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-5 flex items-center justify-between print:hidden transition-colors select-none">
      {/* ZONE 1: BRAND IDENTITY */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md-sm bg-md-primary-container text-md-on-primary-container flex items-center justify-center font-display font-bold text-xs shadow-sm shrink-0 border border-white/[0.06]">
            CR
          </div>
          <div className="min-w-0">
            <span className="font-display font-semibold text-sm tracking-tight text-md-on-surface truncate block">
              Cognitive<span className="text-md-primary font-medium ml-1">Resume</span>
            </span>
          </div>
        </div>
      </div>

      {/* ZONE 3: ACTIONS & UTILITIES */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Design System Token Explorer Trigger */}
        {onOpenDesignSystem && (
          <button
            type="button"
            onClick={onOpenDesignSystem}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-md-on-surface-variant hover:text-md-on-surface bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] transition-all cursor-pointer active:scale-95"
            title="Inspect Material Design 3 Tokens"
          >
            <Palette className="w-3.5 h-3.5 text-md-primary" />
            <span className="text-[11px] font-sans">M3 Tokens</span>
          </button>
        )}

        {/* Undo / Redo Segmented Island */}
        <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-full p-0.5 shadow-sm">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="w-7 h-7 rounded-full flex items-center justify-center text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Undo change (Ctrl+Z / Cmd+Z)"
            aria-label="Undo change"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-white/[0.08] mx-0.5" />
          <button
            onClick={redo}
            disabled={!canRedo}
            className="w-7 h-7 rounded-full flex items-center justify-center text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Redo change (Ctrl+Y / Cmd+Shift+Z)"
            aria-label="Redo change"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export Split Button & Dropdown Sheet */}
        <div className="relative" ref={dropdownRef}>
          <div className="inline-flex rounded-full shadow-md-elevation-1">
            <button
              onClick={onDownloadPdf}
              disabled={isGenerating || isGeneratingDoc}
              className="inline-flex items-center gap-1.5 bg-md-primary hover:bg-[#bda0fa] focus-visible:ring-2 focus-visible:ring-md-primary/40 text-md-on-primary pl-3.5 pr-3 py-1.5 rounded-l-full font-semibold text-xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Export Vector-Grade PDF"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-md-on-primary" />
              ) : (
                <Download className="w-3.5 h-3.5 text-md-on-primary" />
              )}
              <span>Export PDF</span>
            </button>
            
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={isGenerating || isGeneratingDoc}
              className="inline-flex items-center justify-center bg-md-primary hover:bg-[#bda0fa] focus-visible:ring-2 focus-visible:ring-md-primary/40 text-md-on-primary px-2 py-1.5 rounded-r-full border-l border-md-on-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Export Formats & Compression Settings"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* M3 Export Surface Sheet Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-full right-0 mt-2 w-84 bg-md-surface-container-high border border-white/[0.12] rounded-md-xl shadow-2xl p-3 z-[100] origin-top-right text-md-on-surface"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-1 pb-2.5 mb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <FileDown className="w-4 h-4 text-md-primary" />
                    <span className="font-semibold text-xs text-md-on-surface">Export Options</span>
                  </div>
                  <span className="text-[10px] font-mono text-md-on-surface-variant font-medium">3 Formats</span>
                </div>

                {/* Primary Export Actions */}
                <div className="space-y-1 mb-3">
                  {/* PDF Document */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onDownloadPdf();
                    }}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-between p-2 rounded-md-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.15] transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md-sm bg-md-primary/15 text-md-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-md-on-surface">PDF Document</span>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-md-primary/20 text-md-primary font-mono font-medium">Vector</span>
                        </div>
                        <span className="text-[10.5px] text-md-on-surface-variant block truncate">Clickable links & ATS selectable text</span>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-md-on-surface-variant group-hover:text-md-primary shrink-0 ml-1.5" />
                  </button>

                  {/* Word DOCX */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onDownloadDocx();
                    }}
                    disabled={isGeneratingDoc}
                    className="w-full flex items-center justify-between p-2 rounded-md-lg bg-white/[0.02] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.15] transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md-sm bg-md-secondary/15 text-md-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FileType className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-md-on-surface">Microsoft Word</span>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-md-secondary/20 text-md-secondary font-mono font-medium">.docx</span>
                        </div>
                        <span className="text-[10.5px] text-md-on-surface-variant block truncate">Editable recruiter ATS copy</span>
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-md-on-surface-variant group-hover:text-md-secondary shrink-0 ml-1.5" />
                  </button>

                  {/* Native Print */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onPrint();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-md-lg bg-white/[0.02] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.15] transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md-sm bg-white/[0.06] text-md-on-surface-variant flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-md-on-surface block">Print / System PDF</span>
                        <span className="text-[10.5px] text-md-on-surface-variant block truncate">Direct browser vector printing</span>
                      </div>
                    </div>
                    <Printer className="w-3.5 h-3.5 text-md-on-surface-variant group-hover:text-md-on-surface shrink-0 ml-1.5" />
                  </button>
                </div>

                {/* PDF Compression Optimization Panel */}
                <div className="pt-2 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between px-1 py-1">
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-md-on-surface-variant" />
                      <span className="text-xs font-medium text-md-on-surface">Compress PDF</span>
                    </div>
                    <Switch
                      checked={compressPdf}
                      onCheckedChange={setCompressPdf}
                      size="sm"
                    />
                  </div>

                  {compressPdf && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 space-y-2"
                    >
                      {/* Presets Segmented Pill */}
                      <div className="grid grid-cols-3 gap-1 p-0.5 bg-white/[0.03] rounded-full border border-white/[0.08]">
                        {[
                          { id: 'small', label: 'Compact', value: 0.55 },
                          { id: 'balanced', label: 'Balanced', value: 0.72 },
                          { id: 'high', label: 'High Res', value: 0.88 }
                        ].map((preset) => {
                          const closestPreset = [0.55, 0.72, 0.88].reduce((prev, curr) => 
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
                              className={`py-1 text-[11px] font-medium rounded-full transition-all text-center cursor-pointer select-none ${
                                isActive 
                                  ? 'bg-md-primary text-md-on-primary shadow-sm font-semibold' 
                                  : 'text-md-on-surface-variant hover:text-md-on-surface'
                              }`}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Live Compression Metrics */}
                      <div className="bg-white/[0.03] rounded-md-md p-2.5 border border-white/[0.08] flex items-center justify-between text-[11px]">
                        <div className="flex flex-col">
                          <span className="text-md-on-surface-variant text-[10px]">Estimated Output</span>
                          <span className="font-mono font-medium text-md-on-surface">{compressionProfile.estimatedSize}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-md-on-surface-variant text-[10px]">Payload Reduction</span>
                          <span className="font-mono font-bold text-md-success">{compressionProfile.expectedSavings}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
