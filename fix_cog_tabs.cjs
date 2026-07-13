const fs = require('fs');

let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

const regexTabs = /\{\/\*\s*COGNITIVE SUB-TABS \(STICKY AT TOP\)\s*\*\/\}\s*\{\!analyzing && analysisResult && \(\s*<div className="sticky top-0 z-30 flex items-center justify-between p-2 bg-ds-panel\/95 backdrop-blur-md border-b border-ds-border shadow-sm">[\s\S]*?<\/div>\s*\)\}/;

const newTabs = `{/* COGNITIVE SUB-TABS (STICKY AT TOP) */}
      {!analyzing && analysisResult && (
        <div className="sticky top-3 z-30 mx-5 mt-4 mb-4 flex bg-ds-panel/95 backdrop-blur-md p-1.5 rounded-xl border border-ds-border shadow-lg">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={\`flex-1 py-2.5 px-3 rounded-lg text-[10px] uppercase font-extrabold tracking-wider transition-all duration-300 cursor-pointer text-center focus-visible:outline-none \${
              activeSubTab === 'overview' ? 'bg-ds-primary text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-[1.02]' : 'bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover'
            }\`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('laws')}
            className={\`flex-1 py-2.5 px-3 rounded-lg text-[10px] uppercase font-extrabold tracking-wider transition-all duration-300 cursor-pointer text-center focus-visible:outline-none \${
              activeSubTab === 'laws' ? 'bg-ds-primary text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-[1.02]' : 'bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover'
            }\`}
          >
            Laws
          </button>
          <button
            onClick={() => setActiveSubTab('frames')}
            className={\`flex-1 py-2.5 px-3 rounded-lg text-[10px] uppercase font-extrabold tracking-wider transition-all duration-300 cursor-pointer text-center focus-visible:outline-none \${
              activeSubTab === 'frames' ? 'bg-ds-primary text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-[1.02]' : 'bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover'
            }\`}
          >
            Frames
          </button>
        </div>
      )}`;

if (regexTabs.test(content)) {
    content = content.replace(regexTabs, newTabs);
    fs.writeFileSync('components/SidebarCognitiveTab.tsx', content);
    console.log('Restructured Cognitive Tab sub-tabs to floating blurred pill!');
} else {
    console.log('Regex did not match.');
}
