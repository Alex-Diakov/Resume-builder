import React, { useMemo } from 'react';
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Pencil,
  Check
} from 'lucide-react';
import { useResumeContext } from '../../contexts/ResumeContext';
import { useTranslation } from '../../contexts/LanguageContext';

export interface CanvasToolbarProps {
  className?: string;
  themeVariant?: 'dark-glass' | 'light-glass' | 'solid-dark' | 'm3-expressive';
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  className = '',
  themeVariant = 'dark-glass',
}) => {
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    zoomLevel,
    zoomIn,
    zoomOut,
    resetZoom,
    isInlineEditing,
    setIsInlineEditing,
  } = useResumeContext();

  const { t } = useTranslation();

  const isMac = useMemo(() => {
    return typeof navigator !== 'undefined' && (/Mac|iPhone|iPod|iPad/i.test(navigator.userAgent || navigator.platform || ''));
  }, []);

  const undoShortcut = isMac ? '⌘Z' : 'Ctrl+Z';
  const redoShortcut = isMac ? '⌘Y' : 'Ctrl+Y';

  // Variant themes for the floating toolbar
  const variantStyles = useMemo(() => {
    switch (themeVariant) {
      case 'light-glass':
        return 'bg-white/85 text-neutral-800 border-neutral-200/80 shadow-xl backdrop-blur-xl';
      case 'solid-dark':
        return 'bg-[#181a20] text-neutral-100 border-neutral-700/80 shadow-2xl';
      case 'm3-expressive':
        return 'bg-gradient-to-r from-[#1e2230]/95 via-[#1a1d27]/95 to-[#241e2f]/95 text-neutral-100 border-primary-500/30 shadow-2xl backdrop-blur-xl';
      case 'dark-glass':
      default:
        return 'bg-[#14161c]/90 text-neutral-100 border-white/[0.14] shadow-2xl backdrop-blur-xl';
    }
  }, [themeVariant]);

  const buttonBase = 'relative group flex items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none hover:bg-white/[0.10] text-neutral-300 hover:text-white';
  const divider = 'h-5 w-[1px] bg-white/[0.12] mx-0.5';

  return (
    <div 
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 print:hidden select-none animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto ${className}`}
      role="toolbar"
      aria-label={t.canvas.inlineEdit}
    >
      <div 
        className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-2xl border ${variantStyles}`}
      >
        {/* Undo Action */}
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className={buttonBase}
          title={`${t.canvas.undo} (${undoShortcut})`}
          aria-label={t.canvas.undo}
        >
          <Undo2 className="w-4 h-4" />
          <span className="sr-only">{t.canvas.undo}</span>
          {/* Tooltip badge */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 py-1 px-2 rounded-md bg-[#0f1117] text-[11px] text-white border border-white/10 shadow-lg whitespace-nowrap z-40">
            {t.canvas.undo} <span className="opacity-60 text-[10px] ml-1">{undoShortcut}</span>
          </div>
        </button>

        {/* Redo Action */}
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className={buttonBase}
          title={`${t.canvas.redo} (${redoShortcut})`}
          aria-label={t.canvas.redo}
        >
          <Redo2 className="w-4 h-4" />
          <span className="sr-only">{t.canvas.redo}</span>
          {/* Tooltip badge */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 py-1 px-2 rounded-md bg-[#0f1117] text-[11px] text-white border border-white/10 shadow-lg whitespace-nowrap z-40">
            {t.canvas.redo} <span className="opacity-60 text-[10px] ml-1">{redoShortcut}</span>
          </div>
        </button>

        <div className={divider} />

        {/* Zoom Out */}
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoomLevel <= 0.5}
          className={buttonBase}
          title={t.canvas.zoomOut}
          aria-label={t.canvas.zoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Zoom Reset / Current Display */}
        <button
          type="button"
          onClick={resetZoom}
          className="px-2 py-1 rounded-lg text-xs font-mono font-medium text-neutral-300 hover:text-white hover:bg-white/[0.10] transition-colors"
          title={t.canvas.resetZoom}
        >
          {Math.round(zoomLevel * 100)}%
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoomLevel >= 1.6}
          className={buttonBase}
          title={t.canvas.zoomIn}
          aria-label={t.canvas.zoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className={divider} />

        {/* Direct Canvas WYSIWYG Editing Toggle */}
        <button
          type="button"
          onClick={() => setIsInlineEditing(prev => !prev)}
          className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${
            isInlineEditing
              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-[0_0_14px_rgba(16,185,129,0.25)] hover:bg-emerald-500/30'
              : 'text-neutral-300 hover:text-white hover:bg-white/[0.10]'
          }`}
          title={isInlineEditing ? t.canvas.inlineEditActiveTooltip : t.canvas.inlineEditTooltip}
          aria-pressed={isInlineEditing}
          aria-label={t.canvas.inlineEdit}
        >
          {isInlineEditing ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-semibold tracking-wide">{t.canvas.inlineEditActive}</span>
            </>
          ) : (
            <>
              <Pencil className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              <span>{t.canvas.inlineEdit}</span>
            </>
          )}

          {/* Floating Tooltip Guide */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 py-1 px-2.5 rounded-md bg-[#0f1117] text-[11px] text-white border border-white/10 shadow-xl whitespace-nowrap z-40">
            {isInlineEditing ? t.canvas.inlineEditActiveTooltip : t.canvas.inlineEditTooltip}
          </div>
        </button>
      </div>
    </div>
  );
};
