const fs = require('fs');
let content = fs.readFileSync('components/SidebarEditor.tsx', 'utf8');

content = content.replace(/<Sliders className=\{.*?\}\\s*\/>\s*/g, '');
content = content.replace(/<Code2 className=\{.*?\}\\s*\/>\s*/g, '');
// Brain icon is wrapped in a relative div with pinging dots
content = content.replace(/<div className="relative">\s*<Brain className=\{.*?\}\\s*\/>[\s\S]*?<\/div>\s*/g, '');
content = content.replace(/<Target className=\{.*?\}\\s*\/>\s*/g, '');

fs.writeFileSync('components/SidebarEditor.tsx', content);
console.log('Fixed tabs');
