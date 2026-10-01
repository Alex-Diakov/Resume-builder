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
          "relative inline-flex shrink-0 items-center rounded-full transition-all duration-200 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-md-surface",
          isSm ? "h-6 w-11 p-0.5" : "h-8 w-[52px] p-1",
          checked 
            ? "bg-md-primary border-transparent" 
            : "bg-md-surface-container-highest border-2 border-md-outline hover:border-md-on-surface-variant",
          disabled && "opacity-38 cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "inline-block rounded-full transition-all duration-200 ease-out shadow-sm",
            checked
              ? (isSm 
                  ? "h-4.5 w-4.5 translate-x-5 bg-md-on-primary" 
                  : "h-6 w-6 translate-x-5 bg-md-on-primary")
              : (isSm 
                  ? "h-3.5 w-3.5 translate-x-0.5 bg-md-outline" 
                  : "h-4 w-4 translate-x-1 bg-md-outline")
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
