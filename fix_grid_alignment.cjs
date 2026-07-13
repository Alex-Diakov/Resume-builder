const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

// Ensure imports for Slider and Switch exist
if (!content.includes('import { Slider }')) {
  content = content.replace("import { Button }", "import { Button }\nimport { Slider } from './ui/Slider';\nimport { Switch } from './ui/Switch';");
}

// 1. Fix the preset pills
content = content.replace(
  /className=\{`py-2 px-2\.5 rounded-xl text-\[11px\] font-bold transition-all uppercase tracking-wider text-center cursor-pointer select-none border focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ds-primary\/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel \$\{[\s\S]*?\}`\}/g,
  `className={\`py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider text-center cursor-pointer select-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ds-panel \${
                      spacingPreset === preset 
                        ? 'bg-ds-primary text-white border-ds-primary-hover shadow-md' 
                        : 'bg-ds-container text-ds-text-medium border-ds-border hover:bg-ds-hover hover:text-ds-text-high'
                    }\`}`
);

// 2. Replace the ugly sliders with our new Slider component
const paddingTopRegex = /<input\s+type="range"\s+min="5"\s+max="20"\s+step="0\.5"\s+value=\{paddingTopBottom\}\s+onChange=\{\(e\) => setPaddingTopBottom\(parseFloat\(e\.target\.value\)\)\}\s+className="[^"]+"\s*\/>/g;
content = content.replace(paddingTopRegex, `<Slider 
                  min={5} 
                  max={20} 
                  step={0.5} 
                  value={paddingTopBottom} 
                  onChange={(e) => setPaddingTopBottom(parseFloat(e.target.value))}
                />`);

const paddingLeftRegex = /<input\s+type="range"\s+min="8"\s+max="20"\s+step="0\.5"\s+value=\{paddingLeftRight\}\s+onChange=\{\(e\) => setPaddingLeftRight\(parseFloat\(e\.target\.value\)\)\}\s+className="[^"]+"\s*\/>/g;
content = content.replace(paddingLeftRegex, `<Slider 
                  min={8} 
                  max={20} 
                  step={0.5} 
                  value={paddingLeftRight} 
                  onChange={(e) => setPaddingLeftRight(parseFloat(e.target.value))}
                />`);

const sectionsRegex = /<input\s+type="range"\s+min="0\.5"\s+max="1\.5"\s+step="0\.05"\s+value=\{sectionSpacing\}\s+onChange=\{\(e\) => setSectionSpacing\(parseFloat\(e\.target\.value\)\)\}\s+className="[^"]+"\s*\/>/g;
content = content.replace(sectionsRegex, `<Slider 
                    min={0.5} 
                    max={1.5} 
                    step={0.05} 
                    value={sectionSpacing} 
                    onChange={(e) => setSectionSpacing(parseFloat(e.target.value))}
                  />`);

const blocksRegex = /<input\s+type="range"\s+min="0\.4"\s+max="1\.5"\s+step="0\.05"\s+value=\{itemSpacing\}\s+onChange=\{\(e\) => setItemSpacing\(parseFloat\(e\.target\.value\)\)\}\s+className="[^"]+"\s*\/>/g;
content = content.replace(blocksRegex, `<Slider 
                    min={0.4} 
                    max={1.5} 
                    step={0.05} 
                    value={itemSpacing} 
                    onChange={(e) => setItemSpacing(parseFloat(e.target.value))}
                  />`);

// Fix text colors of the values from text-ds-primary to text-ds-text-high
content = content.replace(/text-sm text-ds-primary font-mono font-bold/g, 'text-sm text-ds-text-high font-mono font-bold');

// Replace the native toggle with our Switch component
const toggleRegex = /<div className=\{`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 \$\{showPageGuides \? 'bg-ds-primary shadow-\[0_0_8px_rgba\(255,255,255,0\.2\)\]' : 'bg-ds-border'\}`\}>\s*<span className=\{`inline-block h-3\.5 w-3\.5 transform rounded-full bg-white transition-transform duration-300 ease-in-out \$\{showPageGuides \? 'translate-x-4\.5' : 'translate-x-1'\}`\} \/>\s*<\/div>/g;
content = content.replace(toggleRegex, `<Switch checked={showPageGuides} onCheckedChange={setShowPageGuides} />`);

// Also change the onClick handler in the container to avoid double-firing
const containerRegex = /<div \s*className="flex items-center justify-between pt-3 border-t border-ds-border font-sans cursor-pointer group"\s*onClick=\{\(\) => setShowPageGuides\(!showPageGuides\)\}\s*>/g;
content = content.replace(containerRegex, `<div className="flex items-center justify-between pt-3 border-t border-ds-border font-sans">`);
// Wait, we need to add the label correctly to trigger the switch. Or just keep it.
// Let's replace the whole Page Divider section:

const fullPageGuideRegex = /\{\/\* PAGE GUIDE TOGGLE \*\/\}([\s\S]*?)Current content density height scale/g;

content = content.replace(fullPageGuideRegex, `{/* PAGE GUIDE TOGGLE */}
            <div className="flex items-center justify-between pt-3 border-t border-ds-border font-sans">
              <span className="text-[10px] text-ds-text-medium font-bold uppercase tracking-wider transition-colors">Show A4 Page Dividers</span>
              <Switch checked={showPageGuides} onCheckedChange={setShowPageGuides} />
            </div>
            <div className="text-[10px] text-ds-text-muted/80 text-center leading-normal pt-1.5 border-t border-ds-border/30">
              Current content density height scale`);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Done grid tuning rewrite');
