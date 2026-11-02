/**
 * Export Telemetry & Analytics - Canonical Types (English)
 * Purely tracks real exports: PDF, Word DOCX, and System Print.
 * No editing, saving, or artificial conversion noise.
 */

export type ExportFormat = 'pdf' | 'docx' | 'print';

export interface ExportActivityEntry {
  id: string;
  timestamp: string; // ISO 8601
  dateStr: string;   // YYYY-MM-DD
  resumeTitle: string;
  format: ExportFormat;
  fileSizeBytes?: number;
}

export interface DayExportData {
  dateStr: string;      // YYYY-MM-DD
  dayNumber: number;    // 1-31
  totalExports: number; // PDF + DOCX + Print for this day
  pdfExports: number;
  docxExports: number;
  printExports: number;
  entries: ExportActivityEntry[];
}

export interface MonthExportSummary {
  year: number;
  monthIndex: number;     // 0-11
  monthNameStr: string;   // e.g. "October 2026"
  daysInMonth: number;    // 28-31
  
  totalExports: number;   // Total exports in this month
  pdfExports: number;     // PDF exports in this month
  docxExports: number;    // DOCX exports in this month
  printExports: number;   // Print jobs in this month
  
  growthVsPrevMonth: number; // Export count growth vs previous month (-100 to +Infinity)
  
  activeDaysCount: number;   // Number of days in month with at least 1 export
  activeDaysPercent: number; // Percentage of month days with exports
  peakDay: {
    dateStr: string;
    dayNumber: number;
    count: number;
    pdfCount: number;
    docxCount: number;
    printCount: number;
  } | null;
  
  dailyMap: Record<string, DayExportData>;
}

export interface AllTimeExportSummary {
  totalExports: number; // Grand total exports all-time (strictly pdfExports + docxExports + printExports)
  pdfExports: number;   // Total PDF exports all-time
  docxExports: number;  // Total Word DOCX exports all-time
  printExports: number; // Total Print jobs all-time
  
  availableMonths: {
    year: number;
    monthIndex: number;
    monthNameStr: string;
    totalExports: number;
  }[];
}

export interface ExportStreakData {
  currentStreak: number; // Consecutive active export days
  maxStreak: number;     // All-time record consecutive export days
  isActiveToday: boolean;
}
