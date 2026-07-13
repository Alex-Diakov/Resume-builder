const fs = require('fs');
let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

const currentSticky = '<div className="sticky top-0 z-30 bg-ds-container pt-4 pb-4 px-5 -mx-5 mb-2 mt-0">';
const correctedSticky = '<div className="sticky top-0 z-30 bg-ds-container pt-4 pb-4 px-5 mb-0 mt-0">';

content = content.replace(currentSticky, correctedSticky);

fs.writeFileSync('components/SidebarCognitiveTab.tsx', content);
