const fs = require('fs');

let content = fs.readFileSync('components/SidebarAtsTab.tsx', 'utf8');

if (!content.includes('import { Textarea }')) {
  content = content.replace("import { motion }", "import { motion }\nimport { Textarea } from './ui/Textarea';\nimport { Button } from './ui/Button';");
}

content = content.replace(
  /<textarea\s+value=\{atsInput\}\s+onChange=\{\(e\) => setAtsInput\(e\.target\.value\)\}\s+className="w-full p-3\.5 bg-ds-container border border-ds-border text-ds-text-high font-mono text-xs rounded-xl focus:border-ds-border-focus focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-1 focus-visible:ring-ds-primary\/20 resize-none transition-colors shadow-inner"\s+rows=\{6\}\s+placeholder="([^"]+)"\s*\/>/g,
  '<Textarea value={atsInput} onChange={(e) => setAtsInput(e.target.value)} rows={6} placeholder="$1" className="font-mono shadow-inner resize-none" />'
);

content = content.replace(
  /<button\s+onClick=\{handleAnalyze\}\s+disabled=\{analyzing || !atsInput.trim\(\)\}\s+className="w-full mt-4 flex items-center justify-center gap-2 bg-ds-primary hover:bg-ds-primary-hover disabled:bg-ds-active disabled:text-ds-text-disabled text-white font-bold py-3 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-md hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary\/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-panel uppercase tracking-wider text-xs"\s*>\s*\{analyzing \? \(\s*<RefreshCw className="w-4.5 h-4.5 animate-spin" \/>\s*\) : \(\s*<Scan className="w-4.5 h-4.5" \/>\s*\)\}\s*\{analyzing \? 'Analyzing Compatibility\.\.\.' : 'Run Deep ATS Scan'\}\s*<\/button>/g,
  `<Button 
              onClick={handleAnalyze} 
              disabled={analyzing || !atsInput.trim()} 
              fullWidth 
              size="lg"
              className="mt-4 gap-2"
            >
              {analyzing ? (
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <Scan className="w-4.5 h-4.5" />
              )}
              {analyzing ? 'Analyzing Compatibility...' : 'Run Deep ATS Scan'}
            </Button>`
);

fs.writeFileSync('components/SidebarAtsTab.tsx', content);
console.log('Fixed ATS Tab');
