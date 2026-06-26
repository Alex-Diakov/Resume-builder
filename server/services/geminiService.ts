import { GoogleGenAI, Type } from "@google/genai";
import { serializeResume, generateHeuristicBackupAnalysis } from "../../utils/heuristicEngine";

const SYSTEM_INSTRUCTION = `You are a World-Class Executive Career Architect, Neuro-Cognitive Usability specialist, and C-Level Negotiator. You evaluate professional resume presentations based on scientific laws of attention, cognitive load, and visual processing, and you rewrite elements using elite strategic framing:

1. SECTION LAWS & VISUAL PROCESSING (Overview & Laws tabs):
- Miller's Law (magic number 7±2): Group and size category items and bullets appropriately to not fatigue working memory.
- The 6-Second Screen Rule: Immediate recruiter visual anchors (Name, Current Title, Key Milestones) must dominate instantly.
- F-Pattern Scanning Flow: EYE-tracking visual alignment from left-to-right. Layout and key metrics must align to this.
- Fitts' focus: Concrete, numeric proof points (percentages, values, metrics) capture recruiter interest instantly.

2. PROFESSIONAL REWRITING FRAMEWORKS (Frames tab):
Your objective is to transform raw, task-based user inputs/sentences from the resume into high-status, teleological (value-driven) sentences. Completely eradicate junior/subordinate mindsets and rewrite the lines using these 3 core frameworks:
- Framework A: Teleological Thinking (The Business Frame): Do not describe processes, tools, or duties. Describe the BUSINESS IMPACT of those actions (How did this save money, make money, save time, or reduce risk?). Transform duties into metrics: Churn Rate, LTV, CAC, TTM, Cognitive Load, Engineering Hours Saved, Risk Mitigation.
- Framework B: Semantic Elevation (High-Status Framing): Elevate the vocabulary from physical action to systemic level (architecture/strategy).
  * BLACKLISTED WORDS (Do not use): helped, assisted, participated, tried, just, hobby, side-project, responsible for, making, drawing, writing.
  * WHITELISTED WORDS (Always prefer): Architected, Orchestrated, Engineered, Mitigated, Streamlined, Spearheaded, Transformed, Decoded, Formulated, Executed.
  * Example: "I made a website with tests" -> "Architected a diagnostic digital platform, mapping complex methodologies into low-friction user flows."
- Framework C: The "Prize" Frame (Zero Neediness): The tone must be cold, pragmatic, and confident as a Business Partner, not a desperate job seeker.

3. REWRITING RULES (Bullet Point Formula):
Every element in the "rewrites" array must follow this exact syntax strictly:
[Strong Action Verb] + [System/Process Improved] + [The Business Value / Metric Achieved].
If no specific number/metric is listed, use strong systemic outcomes (e.g. "drastically reduced technical debt" or "eliminated cognitive friction") instead of making up fake numbers.`;

export class GeminiService {
  private ai: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }

  public isConfigured(): boolean {
    return !!this.ai;
  }

  public async analyzeResume(resumeData: any) {
    if (!this.isConfigured()) {
      console.warn("[HEURISTIC FALLBACK] GEMINI_API_KEY not configured. Instantly firing backup assessment model.");
      const fallbackAnalysis = generateHeuristicBackupAnalysis(resumeData);
      return {
        ...fallbackAnalysis,
        warning: "GEMINI_API_KEY is not configured in Secrets. Showing local heuristic analysis. Connect a key in Settings > Secrets for customized dynamic neural analysis!"
      };
    }

    const textRepresentation = serializeResume(resumeData);
    const prompt = `Perform a high-precision neuro-cognitive and executive-framing diagnostic analysis on this resume:

---
${textRepresentation}
---

Provide specific diagnostics (Laws tab), scoring & hotspots (Overview tab), and highly professional value-driven sentence rewrites (Frames tab) formatted strictly according to the 3 Core Strategic Rewriting Frameworks and the strict Formula. Follow the schema strictly.`;

    let response;
    let lastError: any = null;
    let retryDelay = 2000;
    const maxRetries = 4;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        response = await this.ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
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
        
        clearTimeout(timeoutId);
        lastError = null;
        break; 
      } catch (err: any) {
        lastError = err;
        const status = err.status || "";
        const code = err.code || 0;
        const errMsg = err.message || "";
        
        const isTransient = 
          code === 503 || 
          code === 429 || 
          status === "UNAVAILABLE" || 
          status === "RESOURCE_EXHAUSTED" ||
          errMsg.includes("503") ||
          errMsg.includes("429") ||
          errMsg.toLowerCase().includes("unavailable") ||
          errMsg.toLowerCase().includes("high demand") ||
          errMsg.toLowerCase().includes("spikes in demand");

        if (isTransient && attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          retryDelay *= 2;
        } else {
          throw err;
        }
      }
    }

    if (lastError) {
      throw lastError;
    }

    const responseText = response?.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini AI after retries.");
    }

    return JSON.parse(responseText.trim());
  }
}

export const geminiService = new GeminiService();
