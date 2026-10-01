import React from 'react';
import { cn } from '../../utils/cn';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="range"
        className={cn(
          "w-full h-2.5 bg-md-surface-container-highest border border-md-outline-variant/40 rounded-full appearance-none cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-md-surface",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-md-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-md-surface [&::-webkit-slider-thumb]:shadow-md-elevation-1 hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-all",
          "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-md-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-md-surface [&::-moz-range-thumb]:shadow-md-elevation-1 hover:[&::-moz-range-thumb]:scale-110 active:[&::-moz-range-thumb]:scale-125 [&::-moz-range-thumb]:transition-all",
          "[&::-moz-range-track]:bg-md-surface-container-highest [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full",
          "disabled:opacity-38 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
