const fs = require('fs');

let content = fs.readFileSync('server/services/geminiService.ts', 'utf8');

const regex = /(public async analyzeAts[\s\S]*?})\nexport const geminiService = new GeminiService\(\);/;
const match = content.match(regex);

if (match) {
  const extractedFunction = match[1];
  
  content = content.replace(match[0], ''); // remove the bad placement
  
  // place it right before the last closing brace of the class
  // Wait, let's just find the `export class GeminiService {` and place it properly.
  // Actually, we can just find `\n}\nexport const geminiService` and replace it with `\n${extractedFunction}\n}\nexport const geminiService`
}

fs.writeFileSync('server/services/geminiService.ts', content);

