const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

// Replace all remaining textareas
content = content.replace(
  /<textarea\s+value=\{([^}]+)\}\s+onChange=\{\(e\) => ([^}]+)\}\s+className="[^"]+"\s*rows=\{2\}\s*\/>/g,
  '<Textarea value={$1} onChange={(e) => $2} rows={2} />'
);

content = content.replace(
  /<textarea\s+value=\{([^}]+)\}\s+onChange=\{\(e\) => ([^}]+)\}\s+className="[^"]+"\s*\/>/g,
  '<Textarea value={$1} onChange={(e) => $2} />'
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed textareas');
