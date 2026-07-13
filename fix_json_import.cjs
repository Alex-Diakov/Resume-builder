const fs = require('fs');
let content = fs.readFileSync('components/SidebarJsonTab.tsx', 'utf8');

if (!content.includes('import { Button }')) {
  content = content.replace("import { ", "import { Button } from './ui/Button';\nimport { ");
}

fs.writeFileSync('components/SidebarJsonTab.tsx', content);
