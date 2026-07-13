import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-ds-primary text-white shadow-sm hover:bg-ds-primary-hover",
        secondary:
          "border-transparent bg-ds-secondary text-ds-bg hover:bg-ds-secondary-hover",
        outline: "text-ds-text-high border-ds-border",
        success: "border-transparent bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
        warning: "border-transparent bg-amber-500/15 text-amber-300 border border-amber-500/20",
        danger: "border-transparent bg-rose-500/15 text-rose-300 border border-rose-500/20",
        info: "border-transparent bg-cyan-500/15 text-cyan-300 border border-cyan-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
