import { Router, Request, Response, NextFunction } from "express";
import { geminiService } from "../services/geminiService";
import { 
  generateHeuristicBackupAnalysis, 
  generateHeuristicAtsAnalysis, 
  generateHeuristicAnalytics 
} from "../../services/heuristic/heuristicEngine";

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
    console.info("Info: Engaging backup heuristics for /analyze:", apiError?.message || apiError);
    const fallbackAnalysis = generateHeuristicBackupAnalysis(req.body.resumeData);
    return res.json({
      ...fallbackAnalysis,
      warning: "Diagnostic network currently busy. Local heuristic engine activated."
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
    console.warn("Notice: Heuristic fallback engaged for /ats:", apiError?.message || apiError);
    const fallbackAts = generateHeuristicAtsAnalysis(req.body.resumeData, req.body.jobDescription || "");
    return res.json({
      ...fallbackAts,
      warning: "AI service connection unavailable. Using offline keyword-frequency analyzer to ensure uninterrupted workflow."
    });
  }
});

router.post("/analytics", async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "Missing resumeData in request body." });
    }
    const result = await geminiService.analyzeAnalytics(resumeData);
    return res.json(result);
  } catch (apiError: any) {
    console.warn("Notice: Heuristic fallback engaged for /analytics:", apiError?.message || apiError);
    const fallbackAnalytics = generateHeuristicAnalytics(req.body.resumeData);
    return res.json({
      ...fallbackAnalytics,
      warning: "AI service connection unavailable. Displaying deterministic heuristic profile."
    });
  }
});

export default router;

