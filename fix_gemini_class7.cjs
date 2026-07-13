const fs = require('fs');

let content = fs.readFileSync('server/services/geminiService.ts', 'utf8');

content = content.replace("JSON.parse(responseText.trim());\n  }\n}\n\n\n  public async analyzeAts", "JSON.parse(responseText.trim());\n  }\n\n  public async analyzeAts");

fs.writeFileSync('server/services/geminiService.ts', content);
