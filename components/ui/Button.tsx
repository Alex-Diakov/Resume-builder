import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[13px] font-sans font-medium tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2 focus-visible:ring-offset-md-surface disabled:pointer-events-none disabled:opacity-38 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        // M3 Canonical Variants
        filled: "bg-md-primary text-md-on-primary font-semibold hover:bg-md-primary-hover active:bg-md-primary-active shadow-none hover:shadow-md-elevation-1 active:shadow-none border border-transparent",
        tonal: "bg-md-secondary-container text-md-on-secondary-container font-medium hover:bg-md-secondary-container-hover active:brightness-95 shadow-none hover:shadow-md-elevation-1 border border-transparent",
        elevated: "bg-md-surface-container text-md-primary font-medium shadow-md-elevation-1 hover:shadow-md-elevation-2 active:shadow-md-elevation-1 border border-white/[0.08] hover:bg-md-surface-container-high",
        outlined: "border border-white/[0.12] bg-transparent hover:bg-white/[0.06] text-md-on-surface hover:text-md-primary hover:border-md-primary/40 active:bg-white/[0.08] font-medium",
        text: "bg-transparent text-md-primary hover:bg-white/[0.06] active:bg-white/[0.10] border border-transparent font-medium",

        // Backward compatibility mappings
        default: "bg-md-primary text-md-on-primary font-semibold hover:bg-md-primary-hover active:bg-md-primary-active shadow-none hover:shadow-md-elevation-1 active:shadow-none border border-transparent",
        primary: "bg-md-primary text-md-on-primary font-semibold hover:bg-md-primary-hover active:bg-md-primary-active shadow-none hover:shadow-md-elevation-1 active:shadow-none border border-transparent",
        secondary: "bg-white/[0.05] text-md-on-surface font-medium hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.16] shadow-none",
        outline: "border border-white/[0.12] bg-transparent hover:bg-white/[0.06] text-md-on-surface hover:text-md-primary hover:border-md-primary/40 font-medium",
        ghost: "bg-transparent text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.06] border border-transparent font-medium",
        danger: "bg-md-error-container text-md-on-error-container font-medium hover:bg-md-error-container-hover border border-md-error/30 shadow-none hover:shadow-md-elevation-1",
        success: "bg-md-success-container text-md-on-success-container font-medium hover:bg-md-success-container-hover border border-md-success/30 shadow-none hover:shadow-md-elevation-1",
        info: "bg-md-info-container text-md-on-info-container font-medium hover:bg-md-info-container-hover border border-md-info/30 shadow-none hover:shadow-md-elevation-1",
      },
      size: {
        // W3C WCAG 2.2 Compliant Button Scale (Non-squashed vertical breathing room + Base 8px Rule)
        xs: "h-8 min-h-[32px] px-3 py-1.5 text-xs rounded-[4px]",
        sm: "h-9.5 min-h-[38px] px-4 py-2 text-xs rounded-[6px]",
        default: "h-11 min-h-[44px] px-5 py-2.5 text-[13.5px] rounded-[8px]",
        md: "h-11 min-h-[44px] px-5 py-2.5 text-[13.5px] rounded-[8px]",
        lg: "h-12 min-h-[48px] px-6 py-3 text-sm rounded-[10px]",
        xl: "h-14 min-h-[56px] px-8 py-3.5 text-base rounded-[12px]",
        "icon-xs": "w-8 h-8 min-w-[32px] min-h-[32px] p-0 rounded-[4px]",
        "icon-sm": "w-9.5 h-9.5 min-w-[38px] min-h-[38px] p-0 rounded-[6px]",
        icon: "w-11 h-11 min-w-[44px] min-h-[44px] p-0 rounded-[8px]",
        "icon-lg": "w-12 h-12 min-w-[48px] min-h-[48px] p-0 rounded-[10px]",
      },
      fullWidth: {
        true: "w-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2 shrink-0" />}
        {!loading && leftIcon && <span className="mr-2 shrink-0 inline-flex items-center">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2 shrink-0 inline-flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
