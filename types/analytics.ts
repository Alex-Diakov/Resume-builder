export interface AnalyticsData {
  detectedRole: string;
  detectedIndustry: string;
  warning?: string;
}

export interface AnalyticsMetrics {
  wordCount: number;
  readingTimeMinutes: number;
  bulletCount: number;
  quantifiedBulletRatio: number;
  exportCount: number;
  profile?: AnalyticsData;
}
