const fs = require('fs');
let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

// Find the block to replace using regex
const regex = /\{\/\*\s*COGNITIVE SUB-TABS WITH GLIDE SLIDER EFFECT\s*\*\/\}\s*<div className="flex bg-ds-container p-1\.5 rounded-xl border border-ds-border gap-1 shrink-0 relative">[\s\S]*?<\/div>/;

const newTabs = `{/* COGNITIVE SUB-TABS WITH GLIDE SLIDER EFFECT */}
            <div className="sticky top-0 z-20 flex bg-ds-panel/95 backdrop-blur-md px-3 py-2 gap-1 shrink-0 border-b border-ds-border -mx-5 -mt-4 mb-5 pt-4">
              <button
                onClick={() => setActiveSubTab('overview')}
                className={\`relative px-2 py-3 rounded-xl text-[10px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 focus-visible:outline-none focus-visible:bg-ds-hover \${
                  activeSubTab === 'overview' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
                }\`}
              >
                <span>Overview</span>
                {activeSubTab === 'overview' && (
                  <motion.span 
                    layoutId="activeSubTabUnderline"
                    className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-ds-primary rounded-full shadow-glow"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveSubTab('laws')}
                className={\`relative px-2 py-3 rounded-xl text-[10px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 focus-visible:outline-none focus-visible:bg-ds-hover \${
                  activeSubTab === 'laws' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
                }\`}
              >
                <span>Laws</span>
                {activeSubTab === 'laws' && (
                  <motion.span 
                    layoutId="activeSubTabUnderline"
                    className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-ds-primary rounded-full shadow-glow"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveSubTab('frames')}
                className={\`relative px-2 py-3 rounded-xl text-[10px] uppercase tracking-wider font-extrabold flex-1 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer select-none group z-10 focus-visible:outline-none focus-visible:bg-ds-hover \${
                  activeSubTab === 'frames' ? 'text-ds-text-high' : 'text-ds-text-muted hover:text-ds-text-high'
                }\`}
              >
                <span>Frames</span>
                {activeSubTab === 'frames' && (
                  <motion.span 
                    layoutId="activeSubTabUnderline"
                    className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-ds-primary rounded-full shadow-glow"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            </div>`;

if (regex.test(content)) {
    content = content.replace(regex, newTabs);
    fs.writeFileSync('components/SidebarCognitiveTab.tsx', content);
    console.log('Successfully replaced via regex');
} else {
    console.log('Regex did not match');
}
