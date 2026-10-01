import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const badgeVariants = cva(
  "inline-flex items-center rounded-md-sm font-sans font-medium text-xs transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-md-primary text-md-on-primary font-semibold shadow-none",
        primary:
          "border border-transparent bg-md-primary text-md-on-primary font-semibold shadow-none",
        secondary:
          "border border-transparent bg-md-secondary-container text-md-on-secondary-container font-medium",
        tertiary:
          "border border-transparent bg-md-tertiary-container text-md-on-tertiary-container font-medium",
        outline:
          "border border-md-outline-variant/40 bg-transparent text-md-on-surface-variant hover:border-md-outline hover:text-md-on-surface",
        surface:
          "border border-md-outline-variant/30 bg-md-surface-container text-md-on-surface",
        success:
          "border border-md-success/30 bg-md-success-container/40 text-md-on-success-container font-medium",
        warning:
          "border border-md-warning/30 bg-md-warning-container/40 text-md-on-warning-container font-medium",
        danger:
          "border border-md-error/30 bg-md-error-container/40 text-md-on-error-container font-medium",
        info:
          "border border-md-info/30 bg-md-info-container/40 text-md-on-info-container font-medium",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] gap-1.5",
        default: "px-2.5 py-1 text-xs gap-1.5",
        lg: "px-3 py-1.5 text-xs font-semibold gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "w-2 h-2 rounded-full shrink-0",
            variant === 'success' && "bg-md-success animate-pulse",
            variant === 'warning' && "bg-md-warning",
            variant === 'danger' && "bg-md-error",
            variant === 'info' && "bg-md-info",
            (!variant || variant === 'default' || variant === 'primary') && "bg-md-on-primary",
            variant === 'secondary' && "bg-md-on-secondary-container",
            variant === 'tertiary' && "bg-md-tertiary",
            variant === 'outline' && "bg-md-outline",
            variant === 'surface' && "bg-md-on-surface-variant"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge };
