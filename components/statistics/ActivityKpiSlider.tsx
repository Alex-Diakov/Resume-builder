import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useAnalyticsStats } from '../../hooks/useAnalyticsStats';
import {
  FileText,
  Flame,
  Award,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Download
} from 'lucide-react';

import { ExportActivityEntry } from '../../services/analytics/analyticsTypes';

interface ActivityKpiSliderProps {
  selectedYear: number;
  selectedMonthIndex: number;
  customLogs?: ExportActivityEntry[];
}

export const ActivityKpiSlider: React.FC<ActivityKpiSliderProps> = ({
  selectedYear,
  selectedMonthIndex,
  customLogs
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Unified Analytics Hook
  const { allTimeStats, monthSummary, streak } = useAnalyticsStats(selectedYear, selectedMonthIndex, customLogs);

  // Check scroll position and active index
  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, clientWidth } = el;
    const cardElements = el.querySelectorAll<HTMLElement>('[data-kpi-slide]');
    if (cardElements.length === 0) return;

    let closestIdx = 0;
    let minDistance = Infinity;
    const centerPoint = scrollLeft + clientWidth / 2;

    cardElements.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - centerPoint);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScrollState();
    const handleScroll = () => {
      requestAnimationFrame(updateScrollState);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollState]);

  // Scroll to index
  const scrollToSlide = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-kpi-slide]');
    if (cards[index]) {
      const card = cards[index];
      const targetLeft = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
      el.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToSlide(activeIndex - 1);
    } else {
      scrollToSlide(3); // loop to end
    }
  };

  const handleNext = () => {
    if (activeIndex < 3) {
      scrollToSlide(activeIndex + 1);
    } else {
      scrollToSlide(0); // loop to start
    }
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const el = containerRef.current;
    if (el) {
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    }
  };

  const monthShort = monthSummary.monthNameStr.split(' ')[0];

  return (
    <div className="bg-md-surface-container-low border border-white/[0.08] rounded-md-lg p-4 shadow-md-elevation-1 space-y-3 font-sans select-none">
      {/* HEADER: Title & Slider Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-md-on-surface font-display truncate">
              Export KPIs ({monthShort})
            </h4>
          </div>
          <p className="text-[11px] text-md-on-surface-variant truncate mt-0.5">
            Swipe or click arrows to view monthly export metrics
          </p>
        </div>

        {/* Action Controls: Prev/Next buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              title="Previous card"
              aria-label="Previous card"
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-[6px] flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.10] active:scale-95 text-md-on-surface border border-white/[0.08] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Next card"
              aria-label="Next card"
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-[6px] flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.10] active:scale-95 text-md-on-surface border border-white/[0.08] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* NATIVE SLIDER VIEWPORT */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-1 px-0.5 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* ====================================================================
            CARD 1: THIS MONTH
            ==================================================================== */}
        <div
          data-kpi-slide
          className={`snap-center shrink-0 w-[84%] sm:w-[260px] bg-md-surface-container-high/60 border rounded-md-lg p-3.5 transition-all duration-200 flex flex-col justify-between ${
            activeIndex === 0 
              ? 'border-md-primary/40 shadow-md ring-1 ring-md-primary/20 bg-md-surface-container-high/90' 
              : 'border-white/[0.08] hover:border-white/[0.16]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-md-on-surface flex items-center gap-1.5 truncate">
                <span>This Month</span>
                <span className="text-[10px] font-normal text-md-on-surface-variant font-mono">
                  ({monthShort})
                </span>
              </span>
              <div className="w-7 h-7 rounded-md-sm bg-md-primary/15 text-md-primary flex items-center justify-center shrink-0">
                <Download className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-md-on-surface tabular-nums">
                  {monthSummary.totalExports}
                </span>
                <span className="text-xs text-md-on-surface-variant font-medium">exports</span>
              </div>

              {monthSummary.growthVsPrevMonth !== 0 && (
                <div
                  className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                    monthSummary.growthVsPrevMonth > 0
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {monthSummary.growthVsPrevMonth > 0 ? (
                    <TrendingUp className="w-3 h-3 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 shrink-0" />
                  )}
                  <span className="font-mono tabular-nums">
                    {monthSummary.growthVsPrevMonth > 0 ? `+${monthSummary.growthVsPrevMonth}%` : `${monthSummary.growthVsPrevMonth}%`}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-1.5 text-[11px] text-md-on-surface-variant font-mono">
              {monthSummary.pdfExports} PDF · {monthSummary.docxExports} DOCX · {monthSummary.printExports} Print
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs min-w-0">
            <span className="text-md-on-surface-variant truncate text-[11px]">
              All-time total:
            </span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tabular-nums shrink-0 ml-1">
              {allTimeStats.totalExports} exports
            </span>
          </div>
        </div>

        {/* ====================================================================
            CARD 2: EXPORT STREAK
            ==================================================================== */}
        <div
          data-kpi-slide
          className={`snap-center shrink-0 w-[84%] sm:w-[260px] bg-md-surface-container-high/60 border rounded-md-lg p-3.5 transition-all duration-200 flex flex-col justify-between ${
            activeIndex === 1 
              ? 'border-amber-400/40 shadow-md ring-1 ring-amber-400/20 bg-md-surface-container-high/90' 
              : 'border-white/[0.08] hover:border-white/[0.16]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-md-on-surface truncate">
                Export Streak
              </span>
              <div className="w-7 h-7 rounded-md-sm bg-amber-400/15 text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-amber-300 tabular-nums">
                  {streak.currentStreak}
                </span>
                <span className="text-xs text-md-on-surface-variant font-medium">days in a row</span>
              </div>

              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20 font-medium shrink-0">
                {streak.isActiveToday ? 'Exported today' : 'Export today'}
              </span>
            </div>

            <div className="mt-1.5 text-[11px] text-md-on-surface-variant">
              Active export days: <span className="font-mono font-semibold text-md-on-surface">{monthSummary.activeDaysCount} of {monthSummary.daysInMonth}</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs min-w-0">
            <span className="text-md-on-surface-variant truncate text-[11px]">
              Series record:
            </span>
            <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 tabular-nums shrink-0 ml-1">
              {streak.maxStreak} days
            </span>
          </div>
        </div>

        {/* ====================================================================
            CARD 3: MONTHLY PEAK
            ==================================================================== */}
        <div
          data-kpi-slide
          className={`snap-center shrink-0 w-[84%] sm:w-[260px] bg-md-surface-container-high/60 border rounded-md-lg p-3.5 transition-all duration-200 flex flex-col justify-between ${
            activeIndex === 2 
              ? 'border-emerald-400/40 shadow-md ring-1 ring-emerald-400/20 bg-md-surface-container-high/90' 
              : 'border-white/[0.08] hover:border-white/[0.16]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-md-on-surface truncate">
                Monthly Peak
              </span>
              <div className="w-7 h-7 rounded-md-sm bg-emerald-400/15 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-2">
              {monthSummary.peakDay ? (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-bold text-emerald-300 tabular-nums">
                      {monthSummary.peakDay.count}
                    </span>
                    <span className="text-xs text-md-on-surface-variant font-medium">exports</span>
                  </div>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 shrink-0 font-medium">
                    {monthShort} {monthSummary.peakDay.dayNumber}
                  </span>
                </>
              ) : (
                <div className="text-xs text-md-on-surface-variant italic py-1">
                  No exports this month
                </div>
              )}
            </div>

            {monthSummary.peakDay && (
              <div className="mt-1.5 text-[11px] text-md-on-surface-variant font-mono">
                {monthSummary.peakDay.pdfCount} PDF · {monthSummary.peakDay.docxCount} DOCX · {monthSummary.peakDay.printCount} Print
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs min-w-0">
            <span className="text-md-on-surface-variant truncate text-[11px]">
              Month vs all-time:
            </span>
            <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 tabular-nums shrink-0 ml-1">
              {monthSummary.totalExports} of {allTimeStats.totalExports}
            </span>
          </div>
        </div>

        {/* ====================================================================
            CARD 4: ACTIVE DAYS
            ==================================================================== */}
        <div
          data-kpi-slide
          className={`snap-center shrink-0 w-[84%] sm:w-[260px] bg-md-surface-container-high/60 border rounded-md-lg p-3.5 transition-all duration-200 flex flex-col justify-between ${
            activeIndex === 3 
              ? 'border-sky-400/40 shadow-md ring-1 ring-sky-400/20 bg-md-surface-container-high/90' 
              : 'border-white/[0.08] hover:border-white/[0.16]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-md-on-surface truncate">
                Active Export Days
              </span>
              <div className="w-7 h-7 rounded-md-sm bg-sky-400/15 text-sky-400 flex items-center justify-center shrink-0">
                <CalendarCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-sky-300 tabular-nums">
                  {monthSummary.activeDaysCount}
                </span>
                <span className="text-xs text-md-on-surface-variant font-medium">
                  of {monthSummary.daysInMonth} days
                </span>
              </div>

              <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/20 shrink-0 font-medium">
                {monthSummary.activeDaysPercent}%
              </span>
            </div>

            <div className="mt-1.5 text-[11px] text-md-on-surface-variant">
              Average: <span className="font-mono font-semibold text-sky-400">{monthSummary.activeDaysCount > 0 ? (monthSummary.totalExports / monthSummary.activeDaysCount).toFixed(1) : '0'} exports / active day</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs min-w-0">
            <span className="text-md-on-surface-variant truncate text-[11px]">
              Month exports:
            </span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tabular-nums shrink-0 ml-1">
              {monthSummary.totalExports} files
            </span>
          </div>
        </div>
      </div>

      {/* PAGINATION DOTS INDICATOR */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {[0, 1, 2, 3].map(idx => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToSlide(idx)}
            title={`Go to slide ${idx + 1}`}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 cursor-pointer h-1.5 rounded-full ${
              activeIndex === idx
                ? 'w-6 bg-md-primary shadow-xs'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
