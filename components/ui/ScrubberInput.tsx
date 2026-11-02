import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface ScrubberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const ScrubberInput: React.FC<ScrubberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  className,
  icon
}) => {
  const [localStr, setLocalStr] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalStr(step < 1 ? value.toFixed(step < 0.1 ? 2 : 1) : value.toString());
    }
  }, [value, step, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalStr(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, min), max);
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(localStr);
    if (isNaN(parsed)) {
      setLocalStr(value.toString());
    } else {
      const clamped = Math.min(Math.max(parsed, min), max);
      onChange(clamped);
      setLocalStr(step < 1 ? clamped.toFixed(step < 0.1 ? 2 : 1) : clamped.toString());
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    onChange(num);
    setLocalStr(step < 1 ? num.toFixed(step < 0.1 ? 2 : 1) : num.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(value + step, max);
      onChange(next);
      setLocalStr(step < 1 ? next.toFixed(step < 0.1 ? 2 : 1) : next.toString());
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(value - step, min);
      onChange(prev);
      setLocalStr(step < 1 ? prev.toFixed(step < 0.1 ? 2 : 1) : prev.toString());
    } else if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  // Percentage for gradient track fill
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  return (
    <div className={cn("flex flex-col gap-1.5 py-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <label className="font-medium text-md-on-surface flex items-center gap-1.5 select-none">
          {icon}
          {label}
        </label>
        <div className="flex items-center gap-1 bg-md-surface-container-high border border-md-outline-variant/30 rounded-btn-sm px-1.5 py-0.5 focus-within:border-md-primary focus-within:ring-1 focus-within:ring-md-primary/40 transition-all">
          <input
            type="text"
            inputMode="decimal"
            value={localStr}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-11 bg-transparent text-right font-mono text-[11px] text-md-on-surface focus:outline-none"
          />
          {unit && (
            <span className="text-[10px] text-md-on-surface-variant font-mono select-none">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex items-center h-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className={cn(
            "w-full h-1.5 bg-md-surface-container-highest rounded-full appearance-none cursor-pointer select-none",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-md-primary/40",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-md-primary [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/40 [&::-webkit-slider-thumb]:shadow-xs hover:[&::-webkit-slider-thumb]:scale-125 active:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-transform",
            "[&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-md-primary [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/40 [&::-moz-range-thumb]:shadow-xs hover:[&::-moz-range-thumb]:scale-125 active:[&::-moz-range-thumb]:scale-125 [&::-moz-range-thumb]:transition-transform"
          )}
          style={{
            background: `linear-gradient(to right, var(--md-sys-color-primary) ${percentage}%, var(--md-sys-color-surface-container-highest) ${percentage}%)`
          }}
        />
      </div>
    </div>
  );
};
