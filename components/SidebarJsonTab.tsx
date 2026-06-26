import React, { useState, useRef } from 'react';
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
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in font-sans relative">
      <div className="flex items-center justify-between px-4.5 py-2.5 bg-ds-panel/45 border-b border-ds-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={jsonError ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" : "absolute inline-flex rounded-full h-2 w-2 bg-green-500 hidden"}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${jsonError ? 'bg-red-500' : 'bg-green-500'}`}></span>
          </span>
          <span className="text-[11px] text-ds-text-muted font-bold uppercase tracking-wider font-display">
            {jsonError ? 'Syntax Invalid' : 'A4 Realtime Synced'}
          </span>
        </div>
        
        <div className="flex items-center gap-3.5">
          {/* PASTE FROM CLIPBOARD ACTION BUTTON */}
          <button 
            onClick={handlePaste}
            className="flex items-center gap-1.5 text-xs text-ds-text-muted hover:text-ds-text-high transition-colors cursor-pointer"
            title="Paste JSON from system clipboard"
          >
            {pasted ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4 text-ds-primary" />}
            <span className="text-[11px] font-bold uppercase tracking-wider">{pasted ? 'Pasted!' : 'Paste'}</span>
          </button>

          {/* COPY TO CLIPBOARD ACTION BUTTON */}
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-ds-text-muted hover:text-ds-text-high transition-colors cursor-pointer border-l border-ds-border pl-3.5"
            title="Copy JSON Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-ds-primary" />}
            <span className="text-[11px] font-bold uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative flex flex-col min-h-0">
        <textarea
          ref={textareaRef}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="flex-1 w-full p-4.5 bg-transparent text-ds-text-high font-mono text-[11px] leading-relaxed resize-none focus:outline-none"
          spellCheck={false}
          placeholder="Paste your JSON here..."
        />

        {/* CLIPPED HELPER EXPLANATION GIVEN SANDBOX PERMISSION ISSUES */}
        {pasteError && (
          <div className="absolute top-3 left-3 right-3 p-3 bg-ds-container border border-ds-primary/40 text-ds-text-high text-[11px] leading-relaxed flex items-start gap-2.5 shadow-xl rounded-xl animate-fade-in z-20">
            <AlertTriangle className="w-4 h-4 shrink-0 text-ds-primary mt-0.5" />
            <span>{pasteError}</span>
          </div>
        )}
      </div>

      {jsonError && (
        <div className="absolute bottom-0 left-0 right-0 p-4.5 bg-rose-950/95 border-t border-rose-800 text-rose-200 text-sm flex items-start gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] rounded-t-xl z-10">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-300 mt-0.5" />
          <span className="font-mono text-xs break-all leading-normal">{jsonError}</span>
        </div>
      )}
    </div>
  );
};
