const fs = require('fs');

let apiContent = fs.readFileSync('server/routes/api.ts', 'utf8');

const atsEndpoint = `
router.post("/ats", async (req: Request, res: Response) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: "Missing resumeData or jobDescription." });
    }
    const result = await geminiService.analyzeAts(resumeData, jobDescription);
    return res.json(result);
  } catch (apiError: any) {
    console.error("Gemini API Error in /ats:", apiError);
    return res.json({
      score: 50,
      found: [],
      missing: ["Failed to connect to API"],
      improvements: ["Check your API key"],
      warning: "Error connecting to AI service. Ensure you have GEMINI_API_KEY set."
    });
  }
});
`;

if (!apiContent.includes('/ats')) {
  apiContent = apiContent.replace("export default router;", atsEndpoint + "\nexport default router;");
  fs.writeFileSync('server/routes/api.ts', apiContent);
}

let geminiContent = fs.readFileSync('server/services/geminiService.ts', 'utf8');

const atsFunction = `
  public async analyzeAts(resumeData: any, jobDescription: string) {
    if (!this.isConfigured()) {
      return {
        score: 65,
        found: ["Skill 1 (Example)", "Skill 2"],
        missing: ["Missing Skill 1", "Missing Skill 2"],
        improvements: [
          "Include GEMINI_API_KEY in secrets to get real ATS analysis.",
          "Add more relevant skills.",
          "Quantify your experience."
        ],
        warning: "GEMINI_API_KEY is not configured in Secrets. Showing dummy data."
      };
    }

    const textRepresentation = serializeResume(resumeData);
    const prompt = \`Analyze this resume against the following job description (or keywords) for ATS compatibility.

Job Description/Keywords:
\${jobDescription}

Resume Data:
\${textRepresentation}

Identify which keywords/skills are found in the resume, which ones from the job description are missing, and provide 3 concrete suggestions for improving the resume to better match the job description. Give an overall match score from 0 to 100.\`;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Match score from 0 to 100." },
            found: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Keywords or skills found in the resume."
            },
            missing: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Keywords or skills required by the job description but missing from the resume."
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 concrete, actionable suggestions to improve the match score."
            }
          },
          required: ["score", "found", "missing", "improvements"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  }
`;

if (!geminiContent.includes('analyzeAts')) {
  geminiContent = geminiContent.replace("export const geminiService", atsFunction + "\nexport const geminiService");
  fs.writeFileSync('server/services/geminiService.ts', geminiContent);
}

console.log('Fixed backend');
