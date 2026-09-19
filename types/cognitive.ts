export interface UxLawItem {
  law: string;
  verdict: 'pass' | 'warning' | 'fail';
  description: string;
}

export interface CognitiveFramework {
  name: string;
  status: 'optimal' | 'warning' | 'needs_work';
  evaluation: string;
}

export interface RewriteItem {
  original: string;
  improved: string;
  principle: string;
}

export interface HotspotItem {
  zone: string;
  duration: string;
  density: 'High' | 'Medium' | 'Low';
  intent: string;
}

export interface CognitiveAnalysisResult {
  score: number;
  grade: string;
  fPatternCompliance: number;
  cognitiveLoadIndex: number;
  recruiterAttentionSpanSeconds: number;
  actionItemCount: number;
  executiveSummary: string;
  uxLaws: UxLawItem[];
  frameworks: CognitiveFramework[];
  rewrites: RewriteItem[];
  hotspots?: HotspotItem[];
  warning?: string;
}
