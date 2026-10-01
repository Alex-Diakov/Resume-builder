import React, { useState, useRef } from 'react';
import { Button } from '../../ui/Button';
import { 
  Check, 
  Copy, 
  Clipboard,
  AlertTriangle 
} from 'lucide-react';

interface SidebarJsonTabProps {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  jsonError: string | null;
}

export const SidebarJsonTab: React.FC<SidebarJsonTabProps> = ({
  jsonInput,
  setJsonInput,
  jsonError
}) => {
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    // 1. Highlight and focus the textarea instantly
    textareaRef.current?.focus();
    
    try {
      setPasteError(null);
      // Modern clipboard read check
      const text = await navigator.clipboard.readText();
      if (text) {
        setJsonInput(text);
        setPasted(true);
        setTimeout(() => setPasted(false), 2000);
      } else {
        setPasteError("System clipboard is empty.");
        setTimeout(() => setPasteError(null), 4000);
      }
    } catch (err) {
      console.warn("Clipboard auto-paste blocked by browser security sandbox context:", err);
      // Perfect UX feedback: Help them understand the browser sandbox limit and instantly help them paste manually
      setPasteError("Iframe sandbox restricted direct clipboard access. We've focused the editor for you — just press Ctrl+V (Cmd+V)!");
      setTimeout(() => setPasteError(null), 7000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in font-sans relative bg-md-surface-container">
      <div className="flex items-center justify-between px-5 py-2.5 bg-md-surface-container-low border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={jsonError ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-md-error opacity-75" : "absolute inline-flex rounded-full h-2.5 w-2.5 bg-md-success hidden"}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${jsonError ? 'bg-md-error' : 'bg-md-success'}`}></span>
          </span>
          <span className="text-xs text-md-on-surface font-semibold">
            {jsonError ? 'Syntax Invalid' : 'A4 Realtime Synced'}
          </span>
        </div>
        
        {/* Sleek Segmented Actions */}
        <div className="flex items-center bg-white/[0.04] p-0.5 rounded-full border border-white/[0.08]">
          <button 
            type="button" 
            onClick={handlePaste} 
            title="Paste JSON from clipboard" 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            {pasted ? <Check className="w-3.5 h-3.5 text-md-success" /> : <Clipboard className="w-3.5 h-3.5 text-md-primary" />}
            <span>{pasted ? 'Pasted!' : 'Paste'}</span>
          </button>

          <div className="w-[1px] h-3 bg-white/[0.10]" />

          <button 
            type="button" 
            onClick={handleCopy} 
            title="Copy JSON" 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-md-success" /> : <Copy className="w-3.5 h-3.5 text-md-primary" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative flex flex-col min-h-0 bg-md-surface-container">
        <textarea
          ref={textareaRef}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="flex-1 w-full p-4.5 bg-md-surface-container text-md-on-surface font-mono text-xs leading-relaxed resize-none outline-none focus:outline-none focus:ring-0 caret-md-primary"
          spellCheck={false}
          placeholder="Paste your JSON here..."
        />

        {/* CLIPPED HELPER EXPLANATION GIVEN SANDBOX PERMISSION ISSUES */}
        {pasteError && (
          <div className="absolute top-3.5 left-3.5 right-3.5 p-3.5 bg-md-surface-container-high border border-md-primary/40 text-md-on-surface text-xs leading-relaxed flex items-start gap-3 shadow-md-elevation-2 rounded-md-md animate-fade-in z-20">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-md-primary mt-0.5" />
            <span>{pasteError}</span>
          </div>
        )}
      </div>

      {jsonError && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-md-error-container/30 border-t border-md-error/40 text-md-on-error-container backdrop-blur-md text-xs flex items-start gap-3 shadow-md-elevation-3 rounded-t-md-md z-10">
          <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-md-error mt-0.5" />
          <span className="font-mono text-xs break-all leading-normal">{jsonError}</span>
        </div>
      )}
    </div>
  );
};
