const fs = require('fs');

let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

// 1. Remove h-full from root wrapper
content = content.replace('<div className="flex flex-col h-full bg-[#110f15] pb-16 font-sans text-left">', '<div className="flex flex-col pb-16 font-sans text-left">');

// 2. Remove overflow-y-auto and flex-1 from body container
content = content.replace('<div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">', '<div className="px-5 py-4 space-y-5">');

// 3. Find the tabs section to replace. It starts with "{/* COGNITIVE SUB-TABS (FIXED AT TOP) */}"
// and ends right before "      {/* BODY CONTENT CONTAINER */}" or similar.
const regexTabs = /\{\/\*\s*COGNITIVE SUB-TABS \(FIXED AT TOP\)\s*\*\/\}\s*\{\!analyzing && analysisResult && \(\s*<div className="px-5 py-4 shrink-0 border-b border-\[#2d2a33\] bg-\[#110f15\]">[\s\S]*?<\/div>\s*\)\}/;

const newTabs = `{/* COGNITIVE SUB-TABS (STICKY AT TOP) */}
      {!analyzing && analysisResult && (
        <div className="sticky top-3 z-30 mx-5 mt-4 mb-2 flex bg-ds-panel/95 backdrop-blur-md p-1.5 rounded-xl border border-ds-border shadow-md">
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
    console.log('Restructured Cognitive Tab sub-tabs!');
} else {
    console.log('Regex did not match the sub-tabs section.');
}
