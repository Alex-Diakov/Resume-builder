export interface DocumentProfile {
  targetRole: string;
  seniorityLevel: string;
  primaryDomain: string;
  keyStrengths: string[];
  suggestedFocus: string;
}

export interface AnalyticsMetrics {
  wordCount: number;
  readingTimeMinutes: number;
  bulletCount: number;
  quantifiedBulletRatio: number;
  exportCount: number;
  profile?: DocumentProfile;
}
