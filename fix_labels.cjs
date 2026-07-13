const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

if (!content.includes('import { Label }')) {
  content = content.replace("import { Textarea }", "import { Textarea }\nimport { Label } from './ui/Label';");
}

content = content.replace(
  /<label className="[^"]+">([^<]+)<\/label>/g,
  '<Label>$1</Label>'
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed labels');
