import React from 'react';
import { FileJson, Code2, AlertTriangle, Copy, Check } from 'lucide-react';

interface SidebarEditorProps {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  atsInput: string;
  setAtsInput: (val: string) => void;
  jsonError: string | null;
  activeTab: 'json' | 'ats';
  setActiveTab: (tab: 'json' | 'ats') => void;
}

export const SidebarEditor: React.FC<SidebarEditorProps> = ({
  jsonInput,
  setJsonInput,
  atsInput,
  setAtsInput,
  jsonError,
  activeTab,
  setActiveTab
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 border-r border-slate-700 w-full shrink-0 print:hidden shadow-xl z-20">
      {/* Tabs */}
      <div className="flex border-b border-slate-700 shrink-0 bg-slate-800/50">
        <button
          onClick={() => setActiveTab('json')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'json' ? 'border-resume-accent text-white bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          JSON Data
        </button>
        <button
          onClick={() => setActiveTab('ats')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ats' ? 'border-purple-500 text-white bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileJson className="w-4 h-4" />
          ATS Injector
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-slate-900">
        {activeTab === 'json' ? (
          <>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                   <span className={jsonError ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" : "absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 hidden"}></span>
                   <span className={`relative inline-flex rounded-full h-2 w-2 ${jsonError ? 'bg-red-500' : 'bg-green-500'}`}></span>
                 </span>
                 <span className="text-xs text-slate-400 font-medium tracking-wide">
                   {jsonError ? 'Syntax Error' : 'Live Previewing'}
                 </span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                title="Copy JSON"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="flex-1 w-full p-4 bg-transparent text-slate-300 font-mono text-[13px] leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
              placeholder="Paste your JSON here..."
            />
            {jsonError && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-red-900/95 border-t border-red-700 text-red-200 text-sm flex items-start gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] fade-in duration-300">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                <span className="font-mono text-xs break-words pt-0.5">{jsonError}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="px-4 py-4 bg-slate-800/80 border-b border-slate-700 shrink-0">
              <p className="text-xs text-slate-400 leading-relaxed text-justify">
                <strong className="text-purple-400 font-medium tracking-wide">Pro Tip:</strong> Paste the target job description or highly specific keywords here. This content is embedded invisibly in the PDF layer, allowing ATS scrapers to match your profile without polluting the visual layout for human reviewers.
              </p>
            </div>
            <textarea
              value={atsInput}
              onChange={(e) => setAtsInput(e.target.value)}
              className="flex-1 w-full p-4 bg-transparent text-slate-300 font-sans text-[13px] leading-relaxed resize-none focus:outline-none placeholder-slate-700 focus:bg-slate-800/50 transition-colors"
              spellCheck={false}
              placeholder="Example: Managed cross-functional Agile teams, delivered robust GraphQL endpoints, implemented SOC2 compliance..."
            />
          </>
        )}
      </div>
    </div>
  );
};
