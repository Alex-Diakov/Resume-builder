const fs = require('fs');
let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

const linkedinInput = `              <div>
                <Label>LinkedIn URL</Label>
                <Input type="text" value={resumeData.contact.linkedin} onChange={(e) => handleFieldChange('contact.linkedin', e.target.value)}  />
              </div>`;

const videoInput = `              <div>
                <Label>Video Pitch (Loom / YouTube)</Label>
                <Input type="text" value={resumeData.contact.videoPitch || ''} onChange={(e) => handleFieldChange('contact.videoPitch', e.target.value)} placeholder="https://loom.com/..." />
              </div>`;

content = content.replace(linkedinInput, linkedinInput + "\n" + videoInput);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
