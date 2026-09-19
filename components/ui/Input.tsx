import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  status?: 'default' | 'error' | 'success';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, status, ...props }, ref) => {
    const isError = error || status === 'error';
    const isSuccess = status === 'success';

    return (
      <input
        type={type}
        className={cn(
          "w-full bg-ds-container text-ds-text-high border rounded-ds-md px-3.5 py-2 text-sm font-sans transition-all duration-150",
          "placeholder:text-ds-text-disabled focus-visible:outline-none",
          !isError && !isSuccess && "border-ds-border focus-visible:border-ds-border-focus focus-visible:ring-1 focus-visible:ring-ds-primary/40",
          isError && "border-ds-error focus-visible:border-ds-error focus-visible:ring-1 focus-visible:ring-ds-error/40 text-ds-error-light",
          isSuccess && "border-ds-success focus-visible:border-ds-success focus-visible:ring-1 focus-visible:ring-ds-success/40",
          "disabled:opacity-50 disabled:cursor-not-allowed",
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
