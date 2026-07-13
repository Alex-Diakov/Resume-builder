const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

content = content.replace(
  /<button\s+onClick=\{([^}]+)\}\s+className="w-full flex items-center justify-center gap-2 bg-ds-active hover:bg-ds-hover border border-ds-border text-ds-text-medium hover:text-ds-text-high py-2\.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-sm(?: focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ds-primary\/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel)?"\s*>\s*<Plus className="w-4 h-4" \/> ([^<]+)\s*<\/button>/g,
  '<Button onClick={$1} variant="secondary" fullWidth className="gap-2"><Plus className="w-4 h-4" /> $2</Button>'
);

content = content.replace(
  /<button\s+onClick=\{([^}]+)\}\s+className="w-full flex items-center justify-center gap-1\.5 bg-\[#1c1b21\] hover:bg-\[#2b2930\] text-\[#cac4d0\] py-2 rounded-lg text-\[10px\] uppercase font-bold tracking-wider border border-\[#312e39\] cursor-pointer(?: focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-\[#bb86fc\]\/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel)?"\s*>\s*<Plus className="w-3 h-3 text-\[#bb86fc\]" \/> ([^<]+)\s*<\/button>/g,
  '<Button onClick={$1} variant="secondary" size="sm" fullWidth className="gap-1.5"><Plus className="w-3 h-3 text-ds-primary" /> $2</Button>'
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed Add buttons');
