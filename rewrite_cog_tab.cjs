const fs = require('fs');

let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

// 1. We need to extract the tabs out of the scrollable container and put them above the offline warning.
// Wait, putting them after warnings or before?
// Usually tabs are at the very top.
// So right under `<div className="flex flex-col h-full bg-[#110f15] pb-16 font-sans text-left">`

// 2. The old sticky block to remove:
const regexSticky = /\{\/\*\s*COGNITIVE SUB-TABS WITH GLIDE SLIDER EFFECT\s*\*\/\}\s*<div className="sticky top-0 z-20 flex bg-ds-panel\/95 backdrop-blur-md px-3 py-2 gap-1 shrink-0 border-b border-ds-border -mx-5 -mt-4 mb-5 pt-4">[\s\S]*?<\/div>/;

content = content.replace(regexSticky, '');

// 3. The new tabs to insert at the top
const newTabsAtTop = `
      {/* COGNITIVE SUB-TABS (FIXED AT TOP) */}
      {!analyzing && analysisResult && (
        <div className="px-5 py-4 shrink-0 border-b border-[#2d2a33] bg-[#110f15]">
          <div className="flex bg-ds-container p-1.5 rounded-xl border border-ds-border gap-1 relative">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={\`flex-grow relative py-2 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 z-10 focus-visible:outline-none \${
                activeSubTab === 'overview' ? 'text-white' : 'text-ds-text-medium hover:text-ds-text-high'
              }\`}
            >
              {activeSubTab === 'overview' && (
                <motion.div 
                  layoutId="cognitiveSubTabBg"
                  className="absolute inset-0 bg-ds-primary rounded-lg -z-10 shadow-sm shadow-glow border border-ds-border"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <Eye className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveSubTab('laws')}
              className={\`flex-grow relative py-2 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 z-10 focus-visible:outline-none \${
                activeSubTab === 'laws' ? 'text-white' : 'text-ds-text-medium hover:text-ds-text-high'
              }\`}
            >
              {activeSubTab === 'laws' && (
                <motion.div 
                  layoutId="cognitiveSubTabBg"
                  className="absolute inset-0 bg-ds-primary rounded-lg -z-10 shadow-sm shadow-glow border border-ds-border"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <BookOpen className="w-3.5 h-3.5" />
              <span>Laws</span>
            </button>
            <button
              onClick={() => setActiveSubTab('frames')}
              className={\`flex-grow relative py-2 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 z-10 focus-visible:outline-none \${
                activeSubTab === 'frames' ? 'text-white' : 'text-ds-text-medium hover:text-ds-text-high'
              }\`}
            >
              {activeSubTab === 'frames' && (
                <motion.div 
                  layoutId="cognitiveSubTabBg"
                  className="absolute inset-0 bg-ds-primary rounded-lg -z-10 shadow-sm shadow-glow border border-ds-border"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <Zap className="w-3.5 h-3.5" />
              <span>Frames</span>
            </button>
          </div>
        </div>
      )}`;

// We need to make sure the imports have BookOpen, Zap, Eye
if (!content.includes('BookOpen')) content = content.replace('Target', 'Target,\n  BookOpen,\n  Zap,\n  Eye');

content = content.replace(
  '<div className="flex flex-col h-full bg-[#110f15] pb-16 font-sans text-left">',
  '<div className="flex flex-col h-full bg-[#110f15] pb-16 font-sans text-left">' + newTabsAtTop
);

fs.writeFileSync('components/SidebarCognitiveTab.tsx', content);
console.log('Restructured Cognitive Tab!');
