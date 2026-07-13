const fs = require('fs');

let content = fs.readFileSync('components/SidebarAtsTab.tsx', 'utf8');

// The replacement was duplicated somehow, let's fix it by searching for the duplicated block.
content = content.replace(/<\/Button>m<Button[\s\S]*?\{analyzing \? 'Analyzing Compatibility\.\.\.' : 'Run Deep ATS Scan'\}\s*<\/Button>/, '</Button>');

fs.writeFileSync('components/SidebarAtsTab.tsx', content);
console.log('Fixed ATS syntax again');
