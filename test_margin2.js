const fs = require('fs');
let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

content = content.replace('-mx-5 -mt-1 mb-5', '-mx-5 -mt-4 mb-5 pt-2 pb-2'); 

fs.writeFileSync('components/SidebarCognitiveTab.tsx', content);
