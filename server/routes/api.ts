import { Router, Request, Response, NextFunction } from "express";
import { geminiService } from "../services/geminiService";
import { generateHeuristicBackupAnalysis } from "../../utils/heuristicEngine";

const router = Router();

router.post("/analyze", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "Missing resumeData in request body." });
    }

    const result = await geminiService.analyzeResume(resumeData);
    return res.json(result);

  } catch (apiError: any) {
    console.error("Gemini API Error in /analyze:", apiError);
    // Zero-Downtime Design: fallback to scientific heuristic scoring dynamically
    const fallbackAnalysis = generateHeuristicBackupAnalysis(req.body.resumeData);
    return res.json({
      ...fallbackAnalysis,
      warning: "The neural diagnostic network is currently experiencing latency spikes. We've instantly activated our fallback HCI heuristics to maintain zero-delay service!"
    });
  }
});


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

export default router;
