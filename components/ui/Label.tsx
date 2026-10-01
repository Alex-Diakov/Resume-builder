import React from 'react';
import { cn } from '../../utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, optional, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "flex items-center justify-between text-xs font-medium text-md-on-surface-variant mb-1.5 select-none font-sans tracking-normal",
          className
        )}
        {...props}
      >
        <span className="inline-flex items-center gap-1.5">
          {children}
          {required && <span className="text-md-error text-xs font-bold leading-none" aria-hidden="true">*</span>}
        </span>
        {optional && (
          <span className="text-[11px] text-md-outline lowercase font-normal tracking-normal">
            optional
          </span>
        )}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };
