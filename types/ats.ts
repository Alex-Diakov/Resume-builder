export interface AtsCategoryBreakdown {
  label: string;
  found: number;
  total: number;
  percentage: number;
}

export interface AtsAnalysisResult {
  matchScore: number;
  grade: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  categoryBreakdown?: AtsCategoryBreakdown[];
}
