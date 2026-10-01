export interface AtsResult {
  score: number;
  found: string[];
  missing: string[];
  improvements: string[];
  warning?: string;
}
