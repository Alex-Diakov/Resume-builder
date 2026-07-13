const fs = require('fs');

let content = fs.readFileSync('components/SidebarJsonTab.tsx', 'utf8');

if (!content.includes('import { Button }')) {
  content = content.replace("import { Check,", "import { Button } from './ui/Button';\nimport { Check,");
}

content = content.replace(
  /<button\s+onClick=\{handlePaste\}\s+className="flex items-center gap-1\.5 text-xs text-ds-text-muted hover:text-ds-text-high transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-ds-text-high focus-visible:underline"\s+title="Paste JSON from system clipboard"\s*>\s*\{pasted \? <Check className="w-4 h-4 text-emerald-400" \/> : <Clipboard className="w-4 h-4 text-ds-primary" \/>\}\s*<span className="text-\[11px\] font-bold uppercase tracking-wider">\{pasted \? 'Pasted!' : 'Paste'\}<\/span>\s*<\/button>/g,
  `<Button variant="ghost" size="sm" onClick={handlePaste} title="Paste JSON from system clipboard" className="gap-1.5 text-ds-text-muted">
            {pasted ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4 text-ds-primary" />}
            <span>{pasted ? 'Pasted!' : 'Paste'}</span>
          </Button>`
);

content = content.replace(
  /<button\s+onClick=\{handleCopy\}\s+className="flex items-center gap-1\.5 text-xs text-ds-text-muted hover:text-ds-text-high transition-colors cursor-pointer border-l border-ds-border pl-3\.5 focus-visible:outline-none focus-visible:text-ds-text-high focus-visible:underline"\s+title="Copy JSON Code"\s*>\s*\{copied \? <Check className="w-4 h-4 text-emerald-400" \/> : <Copy className="w-4 h-4 text-ds-primary" \/>\}\s*<span className="text-\[11px\] font-bold uppercase tracking-wider">\{copied \? 'Copied' : 'Copy'\}<\/span>\s*<\/button>/g,
  `<Button variant="ghost" size="sm" onClick={handleCopy} title="Copy JSON Code" className="gap-1.5 text-ds-text-muted border-l border-ds-border rounded-none pl-3.5 hover:bg-transparent">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-ds-primary" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>`
);

fs.writeFileSync('components/SidebarJsonTab.tsx', content);
console.log('Fixed Json Tab buttons');
