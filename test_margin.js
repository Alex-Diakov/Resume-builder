const fs = require('fs');
let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

// Just remove the -mt-4 to be safe, top-0 is enough to make it sticky when you scroll down to it.
// Actually, if we just use sticky top-0, it will stick to the top edge when it reaches there.
content = content.replace('-mx-5 -mt-4 mb-5', '-mx-5 -mt-1 mb-5'); // Or maybe just keep it but adjust

fs.writeFileSync('components/SidebarCognitiveTab.tsx', content);
