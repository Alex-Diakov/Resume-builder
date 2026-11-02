/**
 * Export Telemetry Storage Service
 * Single Source of Truth for document downloads: PDF, Word DOCX, and Print.
 * Eliminates all fake data injection by default. Reflects real user exports.
 */

import {
  ExportActivityEntry,
  ExportFormat,
  MonthExportSummary,
  AllTimeExportSummary,
  ExportStreakData,
} from './analyticsTypes';
import {
  computeAllTimeExportSummary,
  computeMonthExportSummary,
  computeExportStreak,
} from './analyticsEngine';

const STORAGE_KEY_EXPORTS = 'resume_export_telemetry_v2';
const MAX_STORED_LOGS = 500;
let memoryFallbackLogs: ExportActivityEntry[] | null = null;

/**
 * Retrieve all persistent export logs (real data only by default)
 */
export function getStoredExportLogs(): ExportActivityEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXPORTS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
    }

    // Check memory fallback if localStorage is empty or blocked
    if (memoryFallbackLogs !== null) {
      return [...memoryFallbackLogs];
    }

    // Check if user previously had real PDF downloads recorded via resume_download_count
    const legacyCount = parseInt(localStorage.getItem('resume_download_count') || '0', 10);
    if (legacyCount > 0 && legacyCount < 20) {
      const initialLogs: ExportActivityEntry[] = [];
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];

      for (let i = 0; i < legacyCount; i++) {
        initialLogs.push({
          id: `real_pdf_${Date.now()}_${i}`,
          timestamp: new Date(now.getTime() - i * 60 * 60 * 1000).toISOString(),
          dateStr,
          resumeTitle: 'Professional Resume (PDF)',
          format: 'pdf',
        });
      }
      saveExportLogs(initialLogs);
      return initialLogs;
    }
  } catch (e) {
    console.warn('Failed to parse export telemetry:', e);
    if (memoryFallbackLogs !== null) {
      return [...memoryFallbackLogs];
    }
  }

  // Pure clean state: 0 exports until user actually downloads a file
  return [];
}

/**
 * Save export logs to storage and notify UI
 */
export function saveExportLogs(logs: ExportActivityEntry[]) {
  // Bound to maximum 500 entries to prevent localStorage quota exhaustion
  const boundedLogs = logs.slice(0, MAX_STORED_LOGS);
  memoryFallbackLogs = boundedLogs;

  try {
    localStorage.setItem(STORAGE_KEY_EXPORTS, JSON.stringify(boundedLogs));
    localStorage.setItem('resume_download_count', boundedLogs.length.toString());

    window.dispatchEvent(new CustomEvent('resume_analytics_updated', { detail: { count: boundedLogs.length } }));
    window.dispatchEvent(new Event('resume_downloaded'));
    if (boundedLogs.length > 0) {
      window.dispatchEvent(new CustomEvent('resume_activity_logged', { detail: boundedLogs[0] }));
    }
  } catch (e) {
    console.warn('LocalStorage unavailable or quota exceeded; using memory telemetry cache:', e);
  }
}

/**
 * Synchronize cloud export records from Firestore into local telemetry cache
 */
export function syncCloudExportsToStorage(cloudEntries: ExportActivityEntry[]) {
  if (!Array.isArray(cloudEntries)) return;
  saveExportLogs(cloudEntries);
}

/**
 * Record a real user export (PDF, Word DOCX, or Print)
 */
export function recordExportAction(
  format: ExportFormat,
  resumeTitle: string = 'Professional Resume'
): ExportActivityEntry {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const entry: ExportActivityEntry = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    dateStr,
    resumeTitle,
    format,
  };

  const currentLogs = getStoredExportLogs();
  const updated = [entry, ...currentLogs];
  saveExportLogs(updated);

  return entry;
}

/**
 * Optional: Populate realistic demo data for testing & presentation
 */
export function loadSampleDemoExports(): ExportActivityEntry[] {
  const titles = [
    'Senior Frontend Engineer Resume',
    'Fullstack Developer CV',
    'Engineering Manager Resume',
    'Product Solutions Architect CV',
    'Lead Software Engineer Resume',
    'UX & System Designer Resume',
  ];

  const now = new Date();
  const logs: ExportActivityEntry[] = [];

  const demoItems: { daysAgo: number; format: ExportFormat; titleIdx: number }[] = [
    // This month (October)
    { daysAgo: 0, format: 'pdf', titleIdx: 0 },
    { daysAgo: 1, format: 'pdf', titleIdx: 1 },
    { daysAgo: 2, format: 'docx', titleIdx: 2 },
    { daysAgo: 4, format: 'pdf', titleIdx: 3 },
    { daysAgo: 6, format: 'print', titleIdx: 4 },
    { daysAgo: 8, format: 'pdf', titleIdx: 0 },
    { daysAgo: 11, format: 'docx', titleIdx: 1 },
    { daysAgo: 14, format: 'pdf', titleIdx: 2 },
    // Previous month (September)
    { daysAgo: 25, format: 'pdf', titleIdx: 3 },
    { daysAgo: 28, format: 'docx', titleIdx: 4 },
    { daysAgo: 32, format: 'pdf', titleIdx: 5 },
    { daysAgo: 38, format: 'print', titleIdx: 0 },
    { daysAgo: 45, format: 'pdf', titleIdx: 1 },
  ];

  demoItems.forEach((item, index) => {
    const targetDate = new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000);
    const dateYear = targetDate.getFullYear();
    const dateMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dateDay = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${dateYear}-${dateMonth}-${dateDay}`;

    const title = titles[item.titleIdx];
    const formatLabel = item.format.toUpperCase();
    targetDate.setHours(10 + (index % 8), (index * 17) % 60, (index * 11) % 60);

    logs.push({
      id: `demo_${index}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: targetDate.toISOString(),
      dateStr,
      resumeTitle: `${title} (${formatLabel})`,
      format: item.format,
    });
  });

  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  saveExportLogs(logs);
  return logs;
}

export const initializeSampleExports = loadSampleDemoExports;

/**
 * Clear all export history completely to 0
 */
export function clearExportHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEY_EXPORTS, '[]');
    localStorage.removeItem('resume_export_telemetry_v1');
    localStorage.removeItem('resume_activity_logs');
    localStorage.removeItem('resume_analytics_store_v4');
    localStorage.setItem('resume_download_count', '0');

    window.dispatchEvent(new CustomEvent('resume_analytics_updated', { detail: { count: 0 } }));
    window.dispatchEvent(new Event('resume_downloaded'));
  } catch (e) {
    console.error('Failed to clear export history:', e);
  }
}

export function getUnifiedAllTimeSummary(): AllTimeExportSummary {
  const logs = getStoredExportLogs();
  return computeAllTimeExportSummary(logs);
}

export function getUnifiedMonthSummary(year: number, monthIndex: number): MonthExportSummary {
  const logs = getStoredExportLogs();
  return computeMonthExportSummary(logs, year, monthIndex);
}

export function getUnifiedStreak(): ExportStreakData {
  const logs = getStoredExportLogs();
  return computeExportStreak(logs);
}
