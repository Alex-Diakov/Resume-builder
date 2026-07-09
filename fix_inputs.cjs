const fs = require('fs');
const files = ['components/SidebarFormTab.tsx', 'components/SidebarAtsTab.tsx', 'components/SidebarJsonTab.tsx', 'components/SidebarCognitiveTab.tsx', 'components/SidebarEditor.tsx'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the specific long chains that sed created
    content = content.replace(/focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-ds-primary focus-visible:border-ds-primary/g, 'focus:outline-none focus:ring-0 focus:border-ds-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:border-ds-primary');
    
    // If it has standard focus rings left over
    content = content.replace(/focus-visible:outline-none focus-visible:ring-[^ ]+/g, 'focus-visible:outline-none focus-visible:ring-0');
    content = content.replace(/focus:outline-none focus:ring-[^ ]+/g, 'focus:outline-none focus:ring-0');
    
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed classes');
