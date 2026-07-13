const fs = require('fs');

let content = fs.readFileSync('server/services/geminiService.ts', 'utf8');

// The issue is `  }\n}\n  public async analyzeAts` or similar. Let's find exactly what it is.
console.log(JSON.stringify(content.substring(content.indexOf('JSON.parse(responseText.trim());') - 20, content.indexOf('JSON.parse(responseText.trim());') + 100)));

content = content.replace("JSON.parse(responseText.trim());\n  }\n}\n  public async analyzeAts", "JSON.parse(responseText.trim());\n  }\n\n  public async analyzeAts");
content = content.replace("JSON.parse(responseText.trim());\r\n  }\r\n}\r\n  public async analyzeAts", "JSON.parse(responseText.trim());\r\n  }\r\n\r\n  public async analyzeAts");

fs.writeFileSync('server/services/geminiService.ts', content);
