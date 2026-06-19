import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Main Resume Cognitive Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { resumeData } = req.body;
      if (!resumeData) {
        return res.status(400).json({ error: "Missing resumeData in request body." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      
      // Fallback response for graceful degradation if API key is not configured yet
      if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not defined. Returning pre-configured heuristics.");
        const fallbackAnalysis = generateHeuristicBackupAnalysis(resumeData);
        return res.json({
          ...fallbackAnalysis,
          warning: "GEMINI_API_KEY is not configured in Secrets. Showing local heuristic analysis. Connect a key in Settings > Secrets for customized dynamic neural analysis!"
        });
      }

      // Initialize Google GenAI with recommended httpOptions and user-agent
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Prepare text summary of the resume
      const textRepresentation = serializeResume(resumeData);

      const systemInstruction = `You are an elite Executive Recruiter and Neuro-Cognitive Usability specialist. You evaluate professional resume presentations based on scientific laws of attention, cognitive load, and visual processing:
1. Miller's Law (magic number 7±2): Keep category items and bullets grouped & sized appropriately to not fatigue working memory.
2. The 6-Second Screen Rule: A recruiter filters resumes in 6-8 seconds. The visual anchors (Name, Current Title, Key Milestones) must dominate instantly.
3. F-Pattern Scanning Flow: Eye-tracking shows readers capture content left-to-right, then skip down. Layout and key metrics must align to this.
4. Fitts' focus: Concrete, numeric proof points (e.g. percentages, values, size of impacts) act as magnets of attention.

Evaluate the submitted resume text, issue numeric diagnostic scoring, and construct precise sentence rewrites to compress text and heighten quantifiable outcomes.`;

      const prompt = `Perform a high-precision cognitive diagnostic analysis on this candidate's resume:

---
${textRepresentation}
---

Provide specific diagnostics mentioning psychological bases, scoring, major visual hotspots, and text replacements. Follow the schema strictly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER, description: "A comprehensive recruiter read score out of 100." },
              cognitiveScore: { type: Type.INTEGER, description: "Cognitive load and processing ease score (1-100)." },
              scanningScore: { type: Type.INTEGER, description: "Visual eye-tracking scanning readiness score (1-100)." },
              kpiScore: { type: Type.INTEGER, description: "How effectively metrics and impact are structured (1-100)." },
              summaryFeedback: { type: Type.STRING, description: "A high-level scannable narrative assessing reading friction and cognitive weight." },
              diagnostics: {
                type: Type.ARRAY,
                description: "Deep diagnostic findings based on information laws.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING, description: "E.g., Work Experience, Professional Summary, Skills, or Contact Coordinates" },
                    severity: { type: Type.STRING, description: "low, medium, or high" },
                    finding: { type: Type.STRING, description: "Explain the visual/cognitive hurdle found in this section." },
                    psychologicalBasis: { type: Type.STRING, description: "References Miller's Law, F-Pattern Scanning, Hick's Law, or Fitts' law." },
                    suggestion: { type: Type.STRING, description: "Concrete structural recommendation to solve the hurdle." }
                  },
                  required: ["section", "severity", "finding", "psychologicalBasis", "suggestion"]
                }
              },
              scanningHotspots: {
                type: Type.ARRAY,
                description: "Key elements that will successfully capture a recruiter's eye during a 6-second scan.",
                items: { type: Type.STRING }
              },
              rewrites: {
                type: Type.ARRAY,
                description: "High-impact sentence revisions to maximize quantifiable facts while shrinking word counts to minimize cognitive load.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    where: { type: Type.STRING, description: "Identify which company/role or heading this pertains to." },
                    original: { type: Type.STRING, description: "The original line or statement." },
                    replacement: { type: Type.STRING, description: "Active-verb revision stressing a metric/outcome clearly." },
                    benefit: { type: Type.STRING, description: "How this rewrite decreases information density or increases visual bite." }
                  },
                  required: ["where", "original", "replacement", "benefit"]
                }
              }
            },
            required: ["overallScore", "cognitiveScore", "scanningScore", "kpiScore", "summaryFeedback", "diagnostics", "scanningHotspots", "rewrites"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini AI.");
      }

      const parsedResult = JSON.parse(responseText.trim());
      return res.json(parsedResult);

    } catch (apiError: any) {
      console.error("Gemini analysis api failure:", apiError);
      // Fail gracefully: fallback to heuristic scoring dynamically
      const fallbackAnalysis = generateHeuristicBackupAnalysis(req.body.resumeData);
      return res.json({
        ...fallbackAnalysis,
        warning: `AI Analysis connection timed out or errored: ${apiError.message || apiError}. Showing local heuristic-based evaluation.`
      });
    }
  });

  // Serve static assets in production, otherwise mount Vite in development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express and Vite development server listening on port ${PORT}`);
  });
}

// Convert resume structure to clean readable text for prompt
function serializeResume(data: any): string {
  let text = `Name: ${data.name || "Untitled"}\nTitle: ${data.title || "Untitled"}\n\n`;
  text += `Summary:\n${Array.isArray(data.summary) ? data.summary.join("\n") : (data.summary || "")}\n\n`;
  text += `Experience:\n`;
  if (Array.isArray(data.experience)) {
    data.experience.forEach((exp: any) => {
      text += `- ${exp.role} at ${exp.company} (${exp.duration}) - ${exp.type}\n`;
      if (Array.isArray(exp.highlights)) {
        exp.highlights.forEach((h: any) => {
          text += `  * ${h.title}: ${h.description}\n`;
        });
      }
    });
  }
  text += `\nProjects:\n`;
  if (Array.isArray(data.projects)) {
    data.projects.forEach((proj: any) => {
      text += `- ${proj.title} (Role: ${proj.role})\n`;
      text += `  Description: ${proj.description}\n`;
      if (Array.isArray(proj.details)) {
        proj.details.forEach((d: any) => {
          text += `  * ${d.label}: ${d.value}\n`;
        });
      }
    });
  }
  text += `\nSkills:\n`;
  if (data.skills) {
    Object.entries(data.skills).forEach(([cat, val]) => {
      text += `- ${cat}: ${val}\n`;
    });
  }
  return text;
}

// Fast elegant local backup heuristics in case Gemini key is missing or encounters a timeout
function generateHeuristicBackupAnalysis(data: any) {
  // Heuristic calculations
  const totalBullets = (data.experience || []).reduce((acc: number, item: any) => acc + (item.highlights?.length || 0), 0);
  const totalDetails = (data.projects || []).reduce((acc: number, item: any) => acc + (item.details?.length || 0), 0);
  const totalSkillsCategories = data.skills ? Object.keys(data.skills).length : 0;
  
  // Calculate scores based on resume characteristics and information laws
  // Miller's Law: 7 +/- 2 skill categories is great. Too many is noisy. 
  // Experience item bullets count: each job should optimally have 3-5 bullets. High bullet counts increase fatigue.
  const millerViolation = totalBullets > 15 || totalSkillsCategories > 6;
  
  let cognitiveScore = 85;
  if (millerViolation) cognitiveScore -= 15;
  if ((data.summary || []).length > 3) cognitiveScore -= 10;
  
  // Check for presence of metrics (%, $, increased, decreased, reduced, etc)
  let kpiScore = 65;
  let metricCount = 0;
  const metricsRegex = /\d%|\$\d|\d\s?percent|\d\s?billion|\d\s?million|\d+\+/i;
  
  const checkMetrics = (text: string) => {
    if (metricsRegex.test(text)) metricCount++;
  };
  
  (data.experience || []).forEach((exp: any) => {
    (exp.highlights || []).forEach((h: any) => {
      checkMetrics(h.title);
      checkMetrics(h.description);
    });
  });
  
  kpiScore += Math.min(metricCount * 5, 30);
  
  const scanningScore = data.title && data.name && (data.contact?.email || data.contact?.linkedin) ? 88 : 60;
  const overallScore = Math.round((cognitiveScore + kpiScore + scanningScore) / 3);

  // Generate customized diagnostics
  const diagnostics = [];
  
  if (totalBullets > 12) {
    diagnostics.push({
      section: "Work Experience",
      severity: "medium",
      finding: `Found ${totalBullets} total quantified bullet points across roles. When section length is high, information density increases visual friction.`,
      psychologicalBasis: "Miller's Law (magic memory retention thresholds)",
      suggestion: "Condense sub-highlights to prioritize the absolute top 3-4 landmark wins per employment tenure."
    });
  } else {
    diagnostics.push({
      section: "Work Experience",
      severity: "low",
      finding: `Well proportioned with ${totalBullets} primary action milestones. Working memory footprint is within thresholds.`,
      psychologicalBasis: "Miller's Law (7±2 elements)",
      suggestion: "Maintain current balance and ensure each milestone opens directly with an action-verb."
    });
  }

  if (metricCount < 4) {
    diagnostics.push({
      section: "Metrics Scannability",
      severity: "high",
      finding: "Sparsity of numerical results. Recruiters read with focus on tangible outcomes rather than simple tasks.",
      psychologicalBasis: "Fitts' Law (Visual Attraction Hotspots)",
      suggestion: "Formulate quantifiable improvements (e.g., 'reduced latency by 30%' or 'scaled active pipeline by $250k')."
    });
  }

  if (totalSkillsCategories > 5) {
    diagnostics.push({
      section: "Skills & Core Competencies",
      severity: "medium",
      finding: `Listed ${totalSkillsCategories} distinct skill headers. Too many grouping labels slows down recruiter comprehension.`,
      psychologicalBasis: "Hick's Law of Decision-making Speed",
      suggestion: "Consolidate into 3-4 pristine categories such as Core Engineering, Leadership Coordinates, and Frameworks."
    });
  }

  // Scanning Hotspots list
  const scanningHotspots = [
    data.name ? `Candidate name: ${data.name}` : "Core candidate identity",
    data.title ? `Job Target title banner: ${data.title}` : "Targeted positioning banner",
  ];
  if (data.contact?.linkedin) scanningHotspots.push("LinkedIn instant portfolio reference");

  // Custom rewrites suggestions
  const rewrites = [
    {
      where: "Professional Target Positioning",
      original: data.title || "Full Stack Developer",
      replacement: `${data.title || "Full Stack Lead"} | Delivering High-Scalability Systems & Cognitive Solutions`,
      benefit: "Frames target immediately as value-enabler instead of generic execution resource."
    }
  ];

  if ((data.experience || []).length > 0) {
    const firstRole = data.experience[0];
    rewrites.push({
      where: `${firstRole.company} - ${firstRole.role}`,
      original: "Responsible for development and maintaining frontend elements of the platform.",
      replacement: `Architected modern React/Vite interfaces reducing initial load interaction delays by 35%.`,
      benefit: "Replaces boilerplate list of duties with structured ownership and discrete physical outcomes."
    });
  }

  return {
    overallScore,
    cognitiveScore,
    scanningScore,
    kpiScore,
    summaryFeedback: `Your resume demonstrates excellent core structure. Based on recruiter scanning laws, you scored a solid ${overallScore}/100. To further lower cognitive load, focus on reducing plain prose and amplifying high-contrast elements like bold metrics or structured value badges on the F-Pattern left-margin axis.`,
    diagnostics,
    scanningHotspots,
    rewrites
  };
}

startServer();
