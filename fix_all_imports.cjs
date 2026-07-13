const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

const importsToAdd = `
import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Label } from './ui/Label';
`;

if (!content.includes('import { Slider }')) {
  content = content.replace("import { useResumeContext } from '../contexts/ResumeContext';", "import { useResumeContext } from '../contexts/ResumeContext';\n" + importsToAdd);
}

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed all imports');
