import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  status?: 'default' | 'error' | 'success';
  supportingText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, status, supportingText, ...props }, ref) => {
    const isError = error || status === 'error';
    const isSuccess = status === 'success';

    return (
      <div className="w-full flex flex-col space-y-1">
        <textarea
          className={cn(
            "w-full bg-md-surface-container-lowest text-md-on-surface border rounded-md-md px-3.5 py-2.5 text-[13px] font-sans transition-colors duration-150 outline-none min-h-[96px] resize-y leading-relaxed caret-md-primary",
            "placeholder:text-md-outline/60",
            !isError && !isSuccess && "border-white/[0.10] hover:border-white/[0.22] focus:border-md-primary/60 focus:ring-1 focus:ring-md-primary/30",
            isError && "border-md-error focus:border-md-error focus:ring-1 focus:ring-md-error text-md-on-surface",
            isSuccess && "border-md-success focus:border-md-success focus:ring-1 focus:ring-md-success",
            "disabled:opacity-38 disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          {...props}
        />
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
Textarea.displayName = "Textarea";

export { Textarea };
