import React from 'react';

interface CustomGeneratorProps {
  code: string;
  setCode: (code: string) => void;
}

export const CustomGenerator: React.FC<CustomGeneratorProps> = ({ code, setCode }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-8 max-w-[95vw] xl:max-w-[1400px] mx-auto">
      {/* Editor Section */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            HTML Editor
          </h3>
          <span className="text-xs text-slate-400">Paste your HTML code here</span>
        </div>
        <div className="relative group flex-1">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[80vh] bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none shadow-inner"
            placeholder="<div class='p-10'><h1>Hello World</h1><p>Start typing HTML...</p></div>"
            spellCheck={false}
          />
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
         <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Live Preview (A4)
          </h3>
          <span className="text-xs text-slate-400">What you see is what you print</span>
        </div>
        
        <div className="overflow-auto bg-slate-800/50 rounded-xl border border-slate-700 p-4 h-[80vh] flex justify-center items-start">
          <div 
            id="custom-preview-content"
            className="bg-white shadow-2xl shrink-0 transition-transform origin-top"
            style={{ 
              width: '210mm', 
              minHeight: '297mm',
            }}
          >
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: code }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
