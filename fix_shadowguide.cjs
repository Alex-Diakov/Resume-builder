const fs = require('fs');
let content = fs.readFileSync('components/ShadowGuide.tsx', 'utf8');

content = content.replace("Действие:", "Action:");
content = content.replace("Зачем:", "Why:");

fs.writeFileSync('components/ShadowGuide.tsx', content);
