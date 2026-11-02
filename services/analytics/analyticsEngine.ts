/**
 * Export Analytics Engine (Pure Mathematical Computation)
 * Exclusively computes export metrics (PDF, DOCX, Print) in English.
 * Guarantees mathematical truth:
 * totalExports === pdfExports + docxExports + printExports
 */

import {
  ExportActivityEntry,
  MonthExportSummary,
  AllTimeExportSummary,
  ExportStreakData,
  DayExportData,
} from './analyticsTypes';

export const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Compute all-time exports summary from raw logs
 */
export function computeAllTimeExportSummary(logs: ExportActivityEntry[]): AllTimeExportSummary {
  let pdfExports = 0;
  let docxExports = 0;
  let printExports = 0;

  const monthsMap: Record<string, {
    year: number;
    monthIndex: number;
    monthNameStr: string;
    totalExports: number;
  }> = {};

  for (const log of logs) {
    if (log.format === 'pdf') {
      pdfExports++;
    } else if (log.format === 'docx') {
      docxExports++;
    } else if (log.format === 'print') {
      printExports++;
    }

    const d = new Date(log.timestamp);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const key = `${year}_${monthIndex}`;
      if (!monthsMap[key]) {
        monthsMap[key] = {
          year,
          monthIndex,
          monthNameStr: `${MONTH_NAMES_EN[monthIndex]} ${year}`,
          totalExports: 0,
        };
      }
      monthsMap[key].totalExports++;
    }
  }

  const totalExports = pdfExports + docxExports + printExports;

  const availableMonths = Object.values(monthsMap).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.monthIndex - a.monthIndex;
  });

  return {
    totalExports,
    pdfExports,
    docxExports,
    printExports,
    availableMonths,
  };
}

/**
 * Compute monthly exports summary and day-by-day heatmap
 */
export function computeMonthExportSummary(
  logs: ExportActivityEntry[],
  year: number,
  monthIndex: number
): MonthExportSummary {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthNameStr = `${MONTH_NAMES_EN[monthIndex]} ${year}`;

  const dailyMap: Record<string, DayExportData> = {};

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dayPadded = String(dayNum).padStart(2, '0');
    const monthPadded = String(monthIndex + 1).padStart(2, '0');
    const dateStr = `${year}-${monthPadded}-${dayPadded}`;

    dailyMap[dateStr] = {
      dateStr,
      dayNumber: dayNum,
      totalExports: 0,
      pdfExports: 0,
      docxExports: 0,
      printExports: 0,
      entries: [],
    };
  }

  let totalExports = 0;
  let pdfExports = 0;
  let docxExports = 0;
  let printExports = 0;

  for (const log of logs) {
    const d = new Date(log.timestamp);
    if (d.getFullYear() === year && d.getMonth() === monthIndex) {
      totalExports++;
      if (log.format === 'pdf') pdfExports++;
      else if (log.format === 'docx') docxExports++;
      else if (log.format === 'print') printExports++;

      const slot = dailyMap[log.dateStr];
      if (slot) {
        slot.totalExports++;
        if (log.format === 'pdf') slot.pdfExports++;
        else if (log.format === 'docx') slot.docxExports++;
        else if (log.format === 'print') slot.printExports++;
        slot.entries.push(log);
      }
    }
  }

  // Active export days & peak export day
  let activeDaysCount = 0;
  let peakDay: MonthExportSummary['peakDay'] = null;

  for (const day of Object.values(dailyMap)) {
    if (day.totalExports > 0) {
      activeDaysCount++;
      if (!peakDay || day.totalExports > peakDay.count) {
        peakDay = {
          dateStr: day.dateStr,
          dayNumber: day.dayNumber,
          count: day.totalExports,
          pdfCount: day.pdfExports,
          docxCount: day.docxExports,
          printCount: day.printExports,
        };
      }
    }
  }

  const activeDaysPercent = daysInMonth > 0 
    ? Math.round((activeDaysCount / daysInMonth) * 100) 
    : 0;

  // Previous month exports for growth calculation
  const prevMonthDate = new Date(year, monthIndex - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonthIndex = prevMonthDate.getMonth();

  let prevMonthExports = 0;
  for (const log of logs) {
    const d = new Date(log.timestamp);
    if (d.getFullYear() === prevYear && d.getMonth() === prevMonthIndex) {
      prevMonthExports++;
    }
  }

  let growthVsPrevMonth = 0;
  if (prevMonthExports === 0) {
    growthVsPrevMonth = totalExports > 0 ? 100 : 0;
  } else {
    growthVsPrevMonth = Math.round(((totalExports - prevMonthExports) / prevMonthExports) * 100);
  }

  return {
    year,
    monthIndex,
    monthNameStr,
    daysInMonth,
    totalExports,
    pdfExports,
    docxExports,
    printExports,
    growthVsPrevMonth,
    activeDaysCount,
    activeDaysPercent,
    peakDay,
    dailyMap,
  };
}

/**
 * Calculate active consecutive days with exports
 */
export function computeExportStreak(logs: ExportActivityEntry[]): ExportStreakData {
  if (logs.length === 0) {
    return { currentStreak: 0, maxStreak: 0, isActiveToday: false };
  }

  const uniqueDates = Array.from(new Set(logs.map(l => l.dateStr))).sort().reverse();
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, maxStreak: 0, isActiveToday: false };
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const isActiveToday = uniqueDates.includes(todayStr);
  const hasYesterday = uniqueDates.includes(yesterdayStr);

  let currentStreak = 0;
  let checkDate = new Date(today);

  if (!isActiveToday && !hasYesterday) {
    currentStreak = 0;
  } else {
    if (!isActiveToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate max streak in history
  let maxStreak = currentStreak;
  let tempStreak = 0;
  const sortedAsc = [...uniqueDates].sort();

  if (sortedAsc.length > 0) {
    tempStreak = 1;
    let prevD = new Date(sortedAsc[0]);

    for (let i = 1; i < sortedAsc.length; i++) {
      const currD = new Date(sortedAsc[i]);
      const diffTime = Math.abs(currD.getTime() - prevD.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
      prevD = currD;
    }
  }

  return {
    currentStreak,
    maxStreak,
    isActiveToday,
  };
}
