const fs = require('fs');

let content = fs.readFileSync('server/services/geminiService.ts', 'utf8');

// replace multiple exports with just one
content = content.replace(/export const geminiService = new GeminiService\(\);\nexport const geminiService = new GeminiService\(\);/g, 'export const geminiService = new GeminiService();');
content = content.replace(/export const geminiService = new GeminiService\(\);\s*export const geminiService = new GeminiService\(\);/g, 'export const geminiService = new GeminiService();');

// Also remove `public async analyzeAts...` hanging outside the class.
const badCodeRegex = /public async analyzeAts[\s\S]*?}\n/g;
const matches = content.match(badCodeRegex);
if (matches && matches.length > 1) {
    // leave the last one which is inside the class? Let's be precise.
}

fs.writeFileSync('server/services/geminiService.ts', content);
