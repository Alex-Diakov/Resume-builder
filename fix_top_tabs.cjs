const fs = require('fs');

let content = fs.readFileSync('components/SidebarEditor.tsx', 'utf8');

content = content.replace("<span>Form</span>", "<span>Редактор</span>");
// Keep JSON as JSON, it's clear
content = content.replace("<span>Cognitive</span>", "<span>Оценка UX</span>");
content = content.replace("<span>ATS</span>", "<span>ATS Сканер</span>");

fs.writeFileSync('components/SidebarEditor.tsx', content);
console.log('Fixed top tabs');
