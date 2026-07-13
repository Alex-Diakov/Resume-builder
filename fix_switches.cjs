const fs = require('fs');

let formTab = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

formTab = formTab.replace(
  /<button\s+type="button"\s+role="switch"\s+aria-checked=\{resumeData\.showPhoto !== false\}\s+onClick=\{\(\) => onChangeData\(\{ \.\.\.resumeData, showPhoto: resumeData\.showPhoto === false \}\)\}\s+className=\{`relative inline-flex h-4\.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-\[#bb86fc\]\/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel \$\{[\s\S]*?\}\`\}\s*>\s*<span\s+className=\{`pointer-events-none inline-block h-3\.5 w-3\.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out \$\{[\s\S]*?\}\`\}\s*\/>\s*<\/button>/g,
  `<Switch checked={resumeData.showPhoto !== false} onCheckedChange={(checked) => onChangeData({ ...resumeData, showPhoto: checked })} />`
);
fs.writeFileSync('components/SidebarFormTab.tsx', formTab);

let toolbar = fs.readFileSync('components/Toolbar.tsx', 'utf8');
if (!toolbar.includes('import { Switch }')) {
  toolbar = toolbar.replace('import { Download,', 'import { Switch } from "./ui/Switch";\nimport { Download,');
}
toolbar = toolbar.replace(
  /<button\s+onClick=\{\(\) => setCompressPdf\(!compressPdf\)\}\s+type="button"\s+className=\{`relative inline-flex h-4\.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-0 \$\{[\s\S]*?\}\`\}\s*>\s*<span className=\{`inline-block h-3\.5 w-3\.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out \$\{[\s\S]*?\}\`\} \/>\s*<\/button>/g,
  `<Switch checked={compressPdf} onCheckedChange={setCompressPdf} />`
);
fs.writeFileSync('components/Toolbar.tsx', toolbar);
console.log('Fixed additional switches');
