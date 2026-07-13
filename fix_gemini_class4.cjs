const fs = require('fs');

let content = fs.readFileSync('server/services/geminiService.ts', 'utf8');
content = content.replace("  }\n}\n  public async analyzeAts", "  }\n  public async analyzeAts");
fs.writeFileSync('server/services/geminiService.ts', content);
