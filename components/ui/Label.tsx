import React from 'react';
import { cn } from '../../utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-[10px] font-bold text-ds-text-muted uppercase tracking-wider mb-2",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };
