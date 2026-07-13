const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

content = content.replace(
  /<input\s+type="text"\s+defaultValue=\{category\}\s+onBlur=\{\(e\) => handleUpdateSkillCategory\(category, e\.target\.value, skills\)\}\s+className="[^"]+"\s*\/>/g,
  '<Input type="text" defaultValue={category} onBlur={(e) => handleUpdateSkillCategory(category, e.target.value, skills)} />'
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed blur input');
