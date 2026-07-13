const fs = require('fs');
let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

content = content.replace(
  /<Button onClick=\{autoFitContent\} title="([^"]+)" className="h-auto py-1\.5 px-3 text-\[10px\] gap-1\.5 rounded-xl shadow-glow">\s*<Sparkles className="w-3\.5 h-3\.5 text-white animate-pulse" \/>\s*<span>Auto-Fit 2 Pages<\/span>\s*<\/button>/g,
  `<Button onClick={autoFitContent} title="$1" className="h-auto py-1.5 px-3 text-[10px] gap-1.5 rounded-xl shadow-glow">
                <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>Auto-Fit 2 Pages</span>
              </Button>`
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed AutoFit Button');
