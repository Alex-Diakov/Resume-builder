const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

content = content.replace(
  /<label\s+className="[^"]+">\s*([^<]+?)\s*<\/label>/g,
  '<Label>$1</Label>'
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed multiline labels');
