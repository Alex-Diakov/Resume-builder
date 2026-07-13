const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

content = content.replace(
  /'bg-ds-container text-ds-text-medium border-ds-border hover:bg-ds-hover hover:text-ds-text-high'/g,
  "'bg-ds-active text-ds-text-medium border-ds-border hover:bg-ds-hover hover:text-ds-text-high'"
);

content = content.replace(
  /<button \s*onClick=\{autoFitContent\}\s*className="flex items-center gap-1\.5 bg-ds-primary hover:bg-ds-primary-hover focus-visible:bg-ds-primary-hover focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ds-primary\/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-panel text-white font-bold text-\[11px\] px-3\.5 py-1\.5 rounded-xl shadow-md hover:shadow-\[0_4px_16px_rgba\(168,85,247,0\.4\)\] active:scale-95 transition-all cursor-pointer uppercase tracking-wider"\s*title="([^"]+)"\s*>/g,
  `<Button onClick={autoFitContent} title="$1" className="h-auto py-1.5 px-3 text-[10px] gap-1.5 rounded-xl shadow-glow">`
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed grid buttons');
