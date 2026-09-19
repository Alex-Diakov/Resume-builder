import React from 'react';
import { cn } from '../../utils/cn';

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, size = 'md', disabled, ...props }, ref) => {
    const isSm = size === 'sm';

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-panel cursor-pointer select-none",
          isSm ? "h-4.5 w-8" : "h-5.5 w-10",
          checked 
            ? "bg-ds-primary shadow-[0_0_10px_rgba(168,85,247,0.35)]" 
            : "bg-ds-container border border-ds-border hover:border-ds-border-focus/40",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "inline-block rounded-full bg-white shadow-ds-sm transition-transform duration-200 ease-out",
            isSm 
              ? (checked ? "h-3.5 w-3.5 translate-x-4" : "h-3.5 w-3.5 translate-x-0.5") 
              : (checked ? "h-4.5 w-4.5 translate-x-5" : "h-4.5 w-4.5 translate-x-0.5")
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
