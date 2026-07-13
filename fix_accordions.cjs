const fs = require('fs');
let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

// Remove overflow-hidden from wrappers
content = content.replace(/border transition-all duration-200 overflow-hidden/g, 'border transition-all duration-200');

// Make buttons sticky and add background
content = content.replace(/className="w-full flex items-center justify-between p-4\.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl"/g, 
'className="sticky top-0 z-10 w-full flex items-center justify-between p-4.5 text-sm font-semibold text-ds-text-high cursor-pointer focus-visible:outline-none focus-visible:bg-ds-hover rounded-xl bg-ds-panel/95 backdrop-blur-md"');

// Remove icons from the headers:
// <User ... />, <Briefcase ... />, <Layers ... />, <Settings ... />, <GraduationCap ... />, <Sliders ... />
// But wait, they have dynamic classnames based on activeAccordion!
// Let's just use regex to remove them.

const icons = ['User', 'Briefcase', 'Layers', 'Settings', 'GraduationCap', 'Sliders'];
icons.forEach(icon => {
  const regex = new RegExp(`<${icon}\\s+className={\`w-4\\.5 h-4\\.5 transition-colors duration-200 \\\${activeAccordion === '[a-z]+' \\? 'text-ds-primary' : 'text-ds-text-muted'}\`}\\s*/>\\s*`);
  content = content.replace(regex, '');
});

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed accordions');
