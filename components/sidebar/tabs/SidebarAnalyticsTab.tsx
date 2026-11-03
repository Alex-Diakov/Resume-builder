import React, { useState } from 'react';
import { ResumeData } from '../../../types';
import { FileText, FileType, Printer } from 'lucide-react';
import { useAnalyticsStats } from '../../../hooks/useAnalyticsStats';
import { ActivityKpiSlider } from '../../statistics/ActivityKpiSlider';
import { ResumeActivityInfographic } from '../../statistics/ResumeActivityInfographic';
import { useTranslation } from '../../../contexts/LanguageContext';

interface SidebarAnalyticsTabProps {
  resumeData: ResumeData;
  atsInput?: string;
}

export const SidebarAnalyticsTab: React.FC<SidebarAnalyticsTabProps> = ({ 
  resumeData: _resumeData,
  atsInput: _atsInput
}) => {
  const { t } = useTranslation();
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(now.getMonth());

  // Unified Export Telemetry Hook
  const { allTimeStats } = useAnalyticsStats(selectedYear, selectedMonthIndex);

  const handlePrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedMonthIndex(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedMonthIndex(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonthIndex(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col pb-20 font-sans text-left">
      <div className="px-5 py-4 space-y-4">
        
        {/* 1. TOTAL EXPORTS CARD: PROMINENT GRAND TOTAL */}
        <div className="bg-md-surface-container-low border border-white/[0.08] rounded-md-lg p-4 shadow-md-elevation-1 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-md-on-surface block truncate">
                    {t.cabinet.totalExports}
                  </span>
                </div>
                <span className="text-xs text-md-on-surface-variant block truncate mt-0.5">
                  {t.cabinet.analyticsSubtitle}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="text-3xl font-mono font-bold text-emerald-300 tabular-nums">
                  {allTimeStats.totalExports}
                </span>
                <span className="text-xs text-md-on-surface-variant font-medium">{t.common.all}</span>
              </div>
            </div>

            {/* Granular Format Breakdown: PDF + DOCX + Print */}
            <div className="pt-2.5 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-xs">
              {/* PDF */}
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/[0.05] min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-md-primary shrink-0" />
                  <span className="text-[11px] text-md-on-surface-variant truncate">PDF</span>
                </div>
                <span className="font-mono font-bold text-md-on-surface tabular-nums shrink-0 ml-1">
                  {allTimeStats.pdfExports}
                </span>
              </div>

              {/* Word DOCX */}
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/[0.05] min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <FileType className="w-3.5 h-3.5 text-md-secondary shrink-0" />
                  <span className="text-[11px] text-md-on-surface-variant truncate">DOCX</span>
                </div>
                <span className="font-mono font-bold text-md-on-surface tabular-nums shrink-0 ml-1">
                  {allTimeStats.docxExports}
                </span>
              </div>

              {/* Print */}
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/[0.05] min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <Printer className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="text-[11px] text-md-on-surface-variant truncate">Print</span>
                </div>
                <span className="font-mono font-bold text-md-on-surface tabular-nums shrink-0 ml-1">
                  {allTimeStats.printExports}
                </span>
              </div>
            </div>
          </div>

        {/* 2. NATIVE KPI SLIDER */}
        <ActivityKpiSlider
          selectedYear={selectedYear}
          selectedMonthIndex={selectedMonthIndex}
        />

        {/* 3. EXPORT CALENDAR INFOGRAPHIC (Monthly Heatmap & Daily Logs) */}
        <ResumeActivityInfographic
          selectedYear={selectedYear}
          selectedMonthIndex={selectedMonthIndex}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>
    </div>
  );
};
