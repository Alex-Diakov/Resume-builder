import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full bg-ds-container text-ds-text-high border border-ds-border rounded-xl px-4 py-2.5 text-sm font-sans focus-visible:outline-none focus-visible:border-ds-border-focus focus-visible:ring-1 focus-visible:ring-ds-primary/50 transition-all placeholder:text-ds-text-disabled",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
