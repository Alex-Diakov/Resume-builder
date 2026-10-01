import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-[13px] font-sans font-medium tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-md-surface disabled:pointer-events-none disabled:opacity-38 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        // M3 Canonical Variants
        filled: "bg-md-primary text-md-on-primary font-semibold hover:bg-[#bda0fa] shadow-none hover:shadow-md-elevation-1 active:shadow-none border border-transparent",
        tonal: "bg-md-secondary-container text-md-on-secondary-container font-medium hover:bg-[#575066] shadow-none hover:shadow-md-elevation-1 border border-transparent",
        elevated: "bg-md-surface-container text-md-primary font-medium shadow-md-elevation-1 hover:shadow-md-elevation-2 active:shadow-md-elevation-1 border border-white/[0.08] hover:bg-md-surface-container-high",
        outlined: "border border-white/[0.12] bg-transparent hover:bg-white/[0.06] text-md-on-surface hover:text-md-primary hover:border-md-primary/40 active:bg-white/[0.08] font-medium",
        text: "bg-transparent text-md-primary hover:bg-white/[0.06] active:bg-white/[0.10] border border-transparent font-medium",

        // Backward compatibility mappings
        default: "bg-md-primary text-md-on-primary font-semibold hover:bg-[#bda0fa] shadow-none hover:shadow-md-elevation-1 active:shadow-none border border-transparent",
        primary: "bg-md-primary text-md-on-primary font-semibold hover:bg-[#bda0fa] shadow-none hover:shadow-md-elevation-1 active:shadow-none border border-transparent",
        secondary: "bg-white/[0.05] text-md-on-surface font-medium hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.16] shadow-none",
        outline: "border border-white/[0.12] bg-transparent hover:bg-white/[0.06] text-md-on-surface hover:text-md-primary hover:border-md-primary/40 font-medium",
        ghost: "bg-transparent text-md-on-surface-variant hover:text-md-on-surface hover:bg-white/[0.06] border border-transparent font-medium",
        danger: "bg-md-error-container text-md-on-error-container font-medium hover:bg-[#a4231c] border border-md-error/30 shadow-none hover:shadow-md-elevation-1",
        success: "bg-md-success-container text-md-on-success-container font-medium hover:bg-[#12682e] border border-md-success/30 shadow-none hover:shadow-md-elevation-1",
        info: "bg-md-info-container text-md-on-info-container font-medium hover:bg-[#28636e] border border-md-info/30 shadow-none hover:shadow-md-elevation-1",
      },
      size: {
        default: "h-10 px-5 py-2 text-[13px]",
        sm: "h-8.5 px-3.5 py-1 text-xs",
        lg: "h-11 px-6 py-2.5 text-sm",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8.5 w-8.5 p-0",
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
