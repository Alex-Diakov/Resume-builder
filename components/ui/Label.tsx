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
          "flex items-center justify-between text-[11px] font-semibold text-ds-text-medium uppercase tracking-wider mb-1.5 select-none font-sans",
          className
        )}
        {...props}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          {required && <span className="text-ds-error text-xs leading-none">*</span>}
        </span>
        {optional && (
          <span className="text-[10px] text-ds-text-disabled lowercase font-normal">
            optional
          </span>
        )}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };
