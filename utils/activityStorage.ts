/**
 * Activity Storage Adapter (Compatibility Bridge)
 * Translates legacy exporter calls directly into the Export Telemetry Engine.
 */

import {
  getStoredExportLogs,
  recordExportAction,
  initializeSampleExports,
  getUnifiedAllTimeSummary,
  getUnifiedMonthSummary,
  getUnifiedStreak,
} from '../services/analytics/analyticsStorage';
import {
  ExportActivityEntry,
  ExportFormat,
  MonthExportSummary as UnifiedMonthSummary,
  AllTimeExportSummary,
} from '../services/analytics/analyticsTypes';

export type ResumeActivityEntry = {
  id: string;
  timestamp: string;
  dateStr: string;
  resumeTitle: string;
  actionType: 'exported';
};

export type DayActivity = {
  dateStr: string;
  dayNumber: number;
  count: number;
  entries: ResumeActivityEntry[];
};

export interface MonthActivitySummary {
  year: number;
  monthIndex: number;
  monthNameStr: string;
  daysInMonth: number;
  totalResumes: number;
  activeDaysCount: number;
  mostProductiveDay: { dateStr: string; dayNumber: number; count: number } | null;
  dailyMap: Record<string, DayActivity>;
  growthVsPrevMonth: number;
}

export interface AllTimeSummary {
  totalAllTime: number;
  totalExports: number;
  totalTailored: number;
  totalCreated: number;
  pdfExports: number;
  docxExports: number;
  printExports: number;
  availableMonths: { year: number; monthIndex: number; monthNameStr: string; count: number }[];
}

export function getActivityLogs(): ResumeActivityEntry[] {
  const logs = getStoredExportLogs();
  return logs.map(l => ({
    id: l.id,
    timestamp: l.timestamp,
    dateStr: l.dateStr,
    resumeTitle: l.resumeTitle,
    actionType: 'exported',
  }));
}

export function recordActivity(
  resumeTitle: string = 'Professional Resume',
  _actionType: string = 'exported'
): ResumeActivityEntry {
  let format: ExportFormat = 'pdf';
  const lower = resumeTitle.toLowerCase();
  if (lower.includes('docx') || lower.includes('word')) {
    format = 'docx';
  } else if (lower.includes('print') || lower.includes('печать')) {
    format = 'print';
  } else {
    format = 'pdf';
  }

  const recorded = recordExportAction(format, resumeTitle);
  return {
    id: recorded.id,
    timestamp: recorded.timestamp,
    dateStr: recorded.dateStr,
    resumeTitle: recorded.resumeTitle,
    actionType: 'exported',
  };
}

export function initSampleActivityLogsIfEmpty(): ResumeActivityEntry[] {
  const logs = getStoredExportLogs();
  if (logs.length === 0) {
    initializeSampleExports();
  }
  return getActivityLogs();
}

export function getMonthSummary(year: number, monthIndex: number): MonthActivitySummary {
  const unified = getUnifiedMonthSummary(year, monthIndex);
  
  const dailyMap: Record<string, DayActivity> = {};
  for (const [dateStr, day] of Object.entries(unified.dailyMap)) {
    dailyMap[dateStr] = {
      dateStr: day.dateStr,
      dayNumber: day.dayNumber,
      count: day.totalExports,
      entries: day.entries.map(e => ({
        id: e.id,
        timestamp: e.timestamp,
        dateStr: e.dateStr,
        resumeTitle: e.resumeTitle,
        actionType: 'exported',
      })),
    };
  }

  return {
    year: unified.year,
    monthIndex: unified.monthIndex,
    monthNameStr: unified.monthNameStr,
    daysInMonth: unified.daysInMonth,
    totalResumes: unified.totalExports,
    activeDaysCount: unified.activeDaysCount,
    mostProductiveDay: unified.peakDay ? {
      dateStr: unified.peakDay.dateStr,
      dayNumber: unified.peakDay.dayNumber,
      count: unified.peakDay.count,
    } : null,
    dailyMap,
    growthVsPrevMonth: unified.growthVsPrevMonth,
  };
}

export function getAllTimeSummary(): AllTimeSummary {
  const unified = getUnifiedAllTimeSummary();
  return {
    totalAllTime: unified.totalExports,
    totalExports: unified.totalExports,
    totalTailored: 0,
    totalCreated: 0,
    pdfExports: unified.pdfExports,
    docxExports: unified.docxExports,
    printExports: unified.printExports,
    availableMonths: unified.availableMonths.map(m => ({
      year: m.year,
      monthIndex: m.monthIndex,
      monthNameStr: m.monthNameStr,
      count: m.totalExports,
    })),
  };
}

export function calculateStreak(): { currentStreak: number; maxStreak: number } {
  const streak = getUnifiedStreak();
  return {
    currentStreak: streak.currentStreak,
    maxStreak: streak.maxStreak,
  };
}
