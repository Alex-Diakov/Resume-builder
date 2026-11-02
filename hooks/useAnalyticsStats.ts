import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getUnifiedAllTimeSummary,
  getUnifiedMonthSummary,
  getUnifiedStreak,
  recordExportAction,
  loadSampleDemoExports,
  clearExportHistory,
  getStoredExportLogs,
} from '../services/analytics/analyticsStorage';
import {
  computeAllTimeExportSummary,
  computeMonthExportSummary,
  computeExportStreak,
} from '../services/analytics/analyticsEngine';
import {
  AllTimeExportSummary,
  MonthExportSummary,
  ExportStreakData,
  ExportFormat,
  ExportActivityEntry
} from '../services/analytics/analyticsTypes';

export function useAnalyticsStats(
  year?: number, 
  monthIndex?: number, 
  customLogs?: ExportActivityEntry[]
) {
  const now = new Date();
  const currentYear = year !== undefined ? year : now.getFullYear();
  const currentMonthIndex = monthIndex !== undefined ? monthIndex : now.getMonth();

  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setVersion(v => v + 1);
    };

    window.addEventListener('resume_analytics_updated', handleUpdate);
    window.addEventListener('resume_downloaded', handleUpdate);
    window.addEventListener('resume_activity_logged', handleUpdate);
    return () => {
      window.removeEventListener('resume_analytics_updated', handleUpdate);
      window.removeEventListener('resume_downloaded', handleUpdate);
      window.removeEventListener('resume_activity_logged', handleUpdate);
    };
  }, []);

  const allTimeStats: AllTimeExportSummary = useMemo(() => {
    if (customLogs && customLogs.length >= 0) {
      return computeAllTimeExportSummary(customLogs);
    }
    return getUnifiedAllTimeSummary();
  }, [version, customLogs]);

  const monthSummary: MonthExportSummary = useMemo(() => {
    if (customLogs && customLogs.length >= 0) {
      return computeMonthExportSummary(customLogs, currentYear, currentMonthIndex);
    }
    return getUnifiedMonthSummary(currentYear, currentMonthIndex);
  }, [currentYear, currentMonthIndex, version, customLogs]);

  const streak: ExportStreakData = useMemo(() => {
    if (customLogs && customLogs.length >= 0) {
      return computeExportStreak(customLogs);
    }
    return getUnifiedStreak();
  }, [version, customLogs]);

  const logExport = useCallback((
    format: ExportFormat,
    title: string = 'Professional Resume'
  ) => {
    return recordExportAction(format, title);
  }, []);

  const loadDemo = useCallback(() => {
    loadSampleDemoExports();
    setVersion(v => v + 1);
  }, []);

  const clearHistory = useCallback(() => {
    clearExportHistory();
    setVersion(v => v + 1);
  }, []);

  return {
    allTimeStats,
    monthSummary,
    streak,
    logExport,
    loadDemo,
    clearHistory,
    refresh: () => setVersion(v => v + 1),
    getRawLogs: customLogs ? () => customLogs : getStoredExportLogs,
  };
}
