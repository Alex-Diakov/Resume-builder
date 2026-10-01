import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  status?: 'default' | 'error' | 'success';
  supportingText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, status, supportingText, leadingIcon, trailingIcon, ...props }, ref) => {
    const isError = error || status === 'error';
    const isSuccess = status === 'success';

    return (
      <div className="w-full flex flex-col space-y-1">
        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-md-on-surface-variant">
              {leadingIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full bg-md-surface-container-lowest text-md-on-surface border rounded-md-md px-3.5 py-2 text-[13px] font-sans transition-colors duration-150 outline-none caret-md-primary",
              "placeholder:text-md-outline/60",
              leadingIcon ? "pl-9" : "pl-3.5",
              trailingIcon ? "pr-9" : "pr-3.5",
              !isError && !isSuccess && "border-white/[0.10] hover:border-white/[0.22] focus:border-md-primary/60 focus:ring-1 focus:ring-md-primary/30",
              isError && "border-md-error focus:border-md-error focus:ring-1 focus:ring-md-error text-md-on-surface",
              isSuccess && "border-md-success focus:border-md-success focus:ring-1 focus:ring-md-success",
              "disabled:opacity-38 disabled:cursor-not-allowed",
              className
            )}
            ref={ref}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-md-on-surface-variant">
              {trailingIcon}
            </div>
          )}
        </div>
        {supportingText && (
          <p className={cn(
            "text-xs px-1 font-sans",
            isError ? "text-md-error" : "text-md-on-surface-variant"
          )}>
            {supportingText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
