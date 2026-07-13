const fs = require('fs');
let content = fs.readFileSync('components/ResumePaper.tsx', 'utf8');

if (!content.includes('PlayCircle')) {
  content = content.replace("import { MapPin, Globe, Linkedin, Mail", "import { MapPin, Globe, Linkedin, Mail, PlayCircle");
}

const linkedinHtml = `{data.contact.linkedin && (
                              <>
                                <a href={formatUrl(data.contact.linkedin)} target="_blank" rel="noreferrer" className="flex items-center text-resume-accent font-medium hover:text-resume-primary transition-colors group">
                                  <Linkedin className="w-3.5 h-3.5 mr-1.5 text-resume-muted group-hover:text-resume-accent transition-colors" />
                                  LinkedIn
                                </a>
                                <span className="text-resume-border">•</span>
                              </>
                            )}`;

const videoHtml = `
                            {data.contact.videoPitch && (
                              <>
                                <a href={formatUrl(data.contact.videoPitch)} target="_blank" rel="noreferrer" className="flex items-center text-rose-500 font-bold hover:text-rose-600 transition-colors group">
                                  <PlayCircle className="w-3.5 h-3.5 mr-1.5 text-rose-400 group-hover:text-rose-500 transition-colors" />
                                  Video Pitch
                                </a>
                                <span className="text-resume-border">•</span>
                              </>
                            )}`;

content = content.replace(linkedinHtml, linkedinHtml + "\n" + videoHtml);

fs.writeFileSync('components/ResumePaper.tsx', content);
