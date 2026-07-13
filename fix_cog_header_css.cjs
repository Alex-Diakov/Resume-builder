const fs = require('fs');
let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

const currentSticky = '<div className="sticky top-0 z-30 bg-ds-container pt-4 pb-4 px-5 mb-0 mt-0">';
const correctedSticky = '<div className="sticky top-0 z-30 bg-ds-container/95 backdrop-blur-md pt-4 pb-3 px-5 mb-2 mt-0 border-b border-ds-border/50 shadow-sm">';

content = content.replace(currentSticky, correctedSticky);

fs.writeFileSync('components/SidebarCognitiveTab.tsx', content);
