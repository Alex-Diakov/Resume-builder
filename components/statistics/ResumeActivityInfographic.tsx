import React, { useState, useMemo } from 'react';
import { useAnalyticsStats } from '../../hooks/useAnalyticsStats';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  FileType,
  Printer,
  Download,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { DayExportData, ExportActivityEntry, ExportFormat } from '../../services/analytics/analyticsTypes';
import { WEEKDAYS_EN } from '../../services/analytics/analyticsEngine';

export interface ResumeActivityInfographicProps {
  selectedYear?: number;
  selectedMonthIndex?: number;
  customLogs?: ExportActivityEntry[];
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

export const ResumeActivityInfographic: React.FC<ResumeActivityInfographicProps> = ({
  selectedYear: controlledYear,
  selectedMonthIndex: controlledMonthIndex,
  customLogs,
  onPrevMonth,
  onNextMonth,
}) => {
  const now = new Date();
  const [internalYear, setInternalYear] = useState<number>(now.getFullYear());
  const [internalMonthIndex, setInternalMonthIndex] = useState<number>(now.getMonth());

  const selectedYear = controlledYear !== undefined ? controlledYear : internalYear;
  const selectedMonthIndex = controlledMonthIndex !== undefined ? controlledMonthIndex : internalMonthIndex;

  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  const [filterFormat, setFilterFormat] = useState<'all' | ExportFormat>('all');

  // Unified Analytics Hook
  const { monthSummary } = useAnalyticsStats(selectedYear, selectedMonthIndex, customLogs);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (onPrevMonth) {
      onPrevMonth();
    } else {
      if (internalMonthIndex === 0) {
        setInternalMonthIndex(11);
        setInternalYear(prev => prev - 1);
      } else {
        setInternalMonthIndex(prev => prev - 1);
      }
    }
    setSelectedDayStr(null);
  };

  const handleNextMonth = () => {
    if (onNextMonth) {
      onNextMonth();
    } else {
      if (internalMonthIndex === 11) {
        setInternalMonthIndex(0);
        setInternalYear(prev => prev + 1);
      } else {
        setInternalMonthIndex(prev => prev + 1);
      }
    }
    setSelectedDayStr(null);
  };

  // Selected day details
  const selectedDayData: DayExportData | null = useMemo(() => {
    if (!selectedDayStr) return null;
    const dayData = monthSummary.dailyMap[selectedDayStr] || null;
    if (!dayData) return null;

    if (filterFormat === 'all') return dayData;

    return {
      ...dayData,
      entries: dayData.entries.filter(e => e.format === filterFormat),
    };
  }, [selectedDayStr, monthSummary, filterFormat]);

  // Heatmap Color Scale based strictly on export count
  const getTileColor = (count: number, isSelected: boolean) => {
    let base = 'bg-md-surface-container-high/40 text-md-on-surface-variant hover:bg-md-surface-container-high border-md-outline-variant/20';
    if (count === 1) {
      base = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
    } else if (count === 2 || count === 3) {
      base = 'bg-emerald-500/50 text-emerald-100 border-emerald-400/60 hover:bg-emerald-500/60 shadow-sm';
    } else if (count >= 4) {
      base = 'bg-emerald-500 text-slate-950 font-bold border-emerald-300 hover:bg-emerald-400 shadow-md shadow-emerald-500/20';
    }

    if (isSelected) {
      return `${base} ring-2 ring-md-primary ring-offset-2 ring-offset-md-surface scale-105 z-10`;
    }
    return base;
  };

  // Pad first day offset in calendar matrix (Monday = 0)
  const firstDayOfWeek = (new Date(selectedYear, selectedMonthIndex, 1).getDay() + 6) % 7;
  const calendarCells = useMemo(() => {
    const cells: (DayExportData | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let dayNum = 1; dayNum <= monthSummary.daysInMonth; dayNum++) {
      const monthPadded = String(selectedMonthIndex + 1).padStart(2, '0');
      const dayPadded = String(dayNum).padStart(2, '0');
      const dateStr = `${selectedYear}-${monthPadded}-${dayPadded}`;
      cells.push(monthSummary.dailyMap[dateStr] || {
        dateStr,
        dayNumber: dayNum,
        totalExports: 0,
        pdfExports: 0,
        docxExports: 0,
        printExports: 0,
        entries: [],
      });
    }
    return cells;
  }, [monthSummary, firstDayOfWeek, selectedYear, selectedMonthIndex]);

  return (
    <div className="space-y-5 font-sans">
      {/* SECTION HEADER & MONTH NAVIGATION */}
      <div className="bg-md-surface-container-low border border-md-outline-variant/30 rounded-md-lg p-4 shadow-md-elevation-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-sm font-semibold text-md-on-surface font-display">
                Export Heatmap Calendar
              </h3>
              <p className="text-xs text-md-on-surface-variant">
                Daily log of PDF, DOCX, and Print exports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {/* Month Switcher Island */}
            <div className="flex items-center gap-1 bg-md-surface-container-high rounded-md-sm p-1 border border-md-outline-variant/20">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handlePrevMonth}
                title="Previous month"
                aria-label="Previous month"
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="w-4 h-4 text-md-on-surface" />
              </Button>

              <span className="text-xs font-semibold px-2 text-md-on-surface min-w-[110px] text-center font-mono tabular-nums">
                {monthSummary.monthNameStr}
              </span>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleNextMonth}
                title="Next month"
                aria-label="Next month"
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="w-4 h-4 text-md-on-surface" />
              </Button>
            </div>
          </div>
        </div>

        {/* MINIATURIZED HEATMAP MATRIX CALENDAR */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-md-on-surface-variant flex items-center gap-1.5">
              <span>Monthly Activity ({monthSummary.totalExports} exports)</span>
            </span>
            {/* Heatmap Legend */}
            <div className="flex items-center gap-1.5 text-[10px] text-md-on-surface-variant">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-sm bg-md-surface-container-high/40 border border-md-outline-variant/20" title="0 exports" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/40" title="1 export" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/50 border border-emerald-400/60" title="2-3 exports" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-300" title="4+ exports" />
              <span>More</span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center">
            {WEEKDAYS_EN.map(wd => (
              <div key={wd} className="text-[10px] font-medium text-md-on-surface-variant/70 uppercase">
                {wd}
              </div>
            ))}
          </div>

          {/* Calendar Day Tiles */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return (
                  <div
                    key={`empty_${idx}`}
                    className="h-8 rounded-md bg-transparent border border-transparent"
                  />
                );
              }

              const isSelected = selectedDayStr === cell.dateStr;

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelectedDayStr(isSelected ? null : cell.dateStr)}
                  className={`h-9 rounded-md border flex flex-col items-center justify-center transition-all cursor-pointer relative group ${getTileColor(
                    cell.totalExports,
                    isSelected
                  )}`}
                  title={`${cell.dayNumber} ${monthSummary.monthNameStr}: ${cell.totalExports} exports`}
                >
                  <span className="text-xs font-mono font-medium leading-none">{cell.dayNumber}</span>
                  {cell.totalExports > 0 && (
                    <span className="text-[9px] font-mono leading-none mt-0.5 opacity-90">
                      {cell.totalExports}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED DAY DETAILED LOG DRAWER */}
        {selectedDayData && (
          <div className="mt-4 pt-4 border-t border-md-outline-variant/30 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-md-primary" />
                <h4 className="text-xs font-semibold text-md-on-surface">
                  Exports on {selectedDayData.dayNumber} {monthSummary.monthNameStr} ({selectedDayData.totalExports} total)
                </h4>
              </div>

              {/* Action Filter Pills: PDF, DOCX, Print */}
              <div className="flex items-center gap-1 bg-md-surface-container-high rounded-md p-0.5 text-[10px]">
                {[
                  { id: 'all', label: `All (${selectedDayData.totalExports})` },
                  { id: 'pdf', label: `PDF (${selectedDayData.pdfExports})` },
                  { id: 'docx', label: `DOCX (${selectedDayData.docxExports})` },
                  { id: 'print', label: `Print (${selectedDayData.printExports})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterFormat(tab.id as any)}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium ${
                      filterFormat === tab.id
                        ? 'bg-md-primary text-md-on-primary shadow-xs font-bold'
                        : 'text-md-on-surface-variant hover:text-md-on-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedDayData.entries.length === 0 ? (
              <p className="text-xs text-md-on-surface-variant italic py-2">
                No exports found for the selected filter on this day.
              </p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {selectedDayData.entries.map(entry => {
                  const timeStr = new Date(entry.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  });

                  return (
                    <div
                      key={entry.id}
                      className="bg-md-surface-container-high/60 border border-md-outline-variant/20 rounded-md p-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {entry.format === 'pdf' ? (
                          <FileText className="w-3.5 h-3.5 text-md-primary shrink-0" />
                        ) : entry.format === 'docx' ? (
                          <FileType className="w-3.5 h-3.5 text-md-secondary shrink-0" />
                        ) : (
                          <Printer className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        )}
                        <span className="font-medium text-md-on-surface truncate">
                          {entry.resumeTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-md-on-surface-variant font-mono">
                          {timeStr}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            entry.format === 'pdf'
                              ? 'bg-md-primary/20 text-md-primary'
                              : entry.format === 'docx'
                              ? 'bg-md-secondary/20 text-md-secondary'
                              : 'bg-sky-500/20 text-sky-300'
                          }`}
                        >
                          {entry.format.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
