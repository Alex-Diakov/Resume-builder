const fs = require('fs');

let content = fs.readFileSync('server/services/geminiService.ts', 'utf8');

content = content.replace("  }\n}\n  public async analyzeAts", "  }\n\n  public async analyzeAts");

// Let's just find "public async analyzeAts" and ensure there's no stray "}" before it which closes the class early.
const lines = content.split('\n');
const fixedLines = [];
let foundAnalyzeAts = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("public async analyzeAts")) {
    if (fixedLines[fixedLines.length - 1] === '}') {
      fixedLines.pop(); // remove the class-closing brace
    }
  }
  fixedLines.push(lines[i]);
}

// Add the closing brace before the export
const finalLines = [];
for (let i = 0; i < fixedLines.length; i++) {
  if (fixedLines[i].includes("export const geminiService = new GeminiService();")) {
    finalLines.push("}");
  }
  finalLines.push(fixedLines[i]);
}

fs.writeFileSync('server/services/geminiService.ts', finalLines.join('\n'));
