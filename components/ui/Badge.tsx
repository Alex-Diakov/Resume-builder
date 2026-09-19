import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const badgeVariants = cva(
  "inline-flex items-center rounded-ds-xs font-semibold uppercase tracking-wider transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-ds-primary/40 bg-ds-primary text-white shadow-ds-sm hover:bg-ds-primary-hover",
        primary:
          "border border-ds-primary/40 bg-ds-primary text-white shadow-ds-sm hover:bg-ds-primary-hover",
        secondary:
          "border border-ds-secondary/40 bg-ds-secondary text-ds-bg font-bold hover:bg-ds-secondary-hover",
        outline:
          "border border-ds-border bg-transparent text-ds-text-medium hover:text-ds-text-high",
        surface:
          "border border-ds-border bg-ds-active text-ds-text-medium",
        success:
          "border border-ds-success/30 bg-ds-success-bg text-ds-success",
        warning:
          "border border-ds-warning/30 bg-ds-warning-bg text-ds-warning",
        danger:
          "border border-ds-error/30 bg-ds-error-bg text-ds-error",
        info:
          "border border-ds-info/30 bg-ds-info-bg text-ds-info",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[9px] leading-tight gap-1",
        default: "px-2 py-0.5 text-[10px] leading-tight gap-1.5",
        lg: "px-2.5 py-1 text-xs leading-tight gap-1.5",
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
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === 'success' && "bg-ds-success animate-pulse",
            variant === 'warning' && "bg-ds-warning",
            variant === 'danger' && "bg-ds-error",
            variant === 'info' && "bg-ds-info",
            (!variant || variant === 'default' || variant === 'primary') && "bg-white",
            variant === 'secondary' && "bg-ds-bg",
            (variant === 'outline' || variant === 'surface') && "bg-ds-text-muted"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge };
