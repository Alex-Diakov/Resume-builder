import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full bg-ds-container text-ds-text-high border border-ds-border rounded-xl px-4 py-3 text-sm font-sans focus-visible:outline-none focus-visible:border-ds-border-focus focus-visible:ring-1 focus-visible:ring-ds-primary/50 transition-all placeholder:text-ds-text-disabled min-h-[100px] resize-y leading-relaxed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
