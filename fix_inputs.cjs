const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

if (!content.includes("import { Input }")) {
  content = content.replace("import { Slider }", "import { Slider }\nimport { Input } from './ui/Input';\nimport { Textarea } from './ui/Textarea';");
}

content = content.replace(
  /<input\s+([^>]*?)className="w-full bg-ds-container text-ds-text-high border border-ds-border rounded-xl px-4 py-2\.5 text-sm font-sans focus-visible:outline-none focus-visible:border-ds-border-focus focus-visible:ring-1 focus-visible:ring-ds-primary\/50 transition-all placeholder:text-ds-text-disabled"([^>]*?)>/g,
  '<Input $1$2/>'
);

content = content.replace(
  /<textarea\s+([^>]*?)className="w-full bg-ds-container text-ds-text-high border border-ds-border rounded-xl px-4 py-3 text-sm font-sans focus-visible:outline-none focus-visible:border-ds-border-focus focus-visible:ring-1 focus-visible:ring-ds-primary\/50 transition-all placeholder:text-ds-text-disabled min-h-\[100px\] resize-y leading-relaxed"([^>]*?)>/g,
  '<Textarea $1$2/>'
);

content = content.replace(
  /<textarea\s+([^>]*?)className="w-full bg-ds-container text-ds-text-high border border-ds-border rounded-xl px-4 py-3 text-sm font-sans focus-visible:outline-none focus-visible:border-ds-border-focus focus-visible:ring-1 focus-visible:ring-ds-primary\/50 transition-all placeholder:text-ds-text-disabled min-h-\[100px\] resize-y leading-relaxed"([^>]*?)><\/textarea>/g,
  '<Textarea $1$2/>'
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Done fixing inputs');
