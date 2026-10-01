export interface CognitiveDiagnosticItem {
  section: string;
  severity: 'low' | 'medium' | 'high';
  finding: string;
  psychologicalBasis: string;
  suggestion: string;
}

export interface CognitiveRewriteItem {
  where: string;
  original: string;
  replacement: string;
  benefit: string;
}

export interface CognitiveAnalysisResult {
  overallScore: number;
  cognitiveScore: number;
  scanningScore: number;
  kpiScore: number;
  summaryFeedback: string;
  diagnostics: CognitiveDiagnosticItem[];
  scanningHotspots: string[];
  rewrites: CognitiveRewriteItem[];
  warning?: string;
}
