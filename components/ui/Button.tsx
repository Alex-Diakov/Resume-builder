import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-ds-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-panel disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default: "bg-ds-primary text-white shadow-ds-sm hover:shadow-ds-glow hover:bg-ds-primary-hover border border-ds-primary/40",
        primary: "bg-ds-primary text-white shadow-ds-sm hover:shadow-ds-glow hover:bg-ds-primary-hover border border-ds-primary/40",
        secondary: "bg-ds-active text-ds-text-high border border-ds-border hover:bg-ds-hover hover:border-ds-border-focus/40 shadow-ds-sm",
        outline: "border border-ds-border bg-transparent hover:bg-ds-hover text-ds-text-medium hover:text-ds-text-high hover:border-ds-border-focus/50",
        ghost: "bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover border border-transparent",
        danger: "bg-ds-error-bg text-ds-error border border-ds-error/30 hover:bg-ds-error/20",
        success: "bg-ds-success-bg text-ds-success border border-ds-success/30 hover:bg-ds-success/20",
        info: "bg-ds-info-bg text-ds-info border border-ds-info/30 hover:bg-ds-info/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7.5 px-3 py-1.5 text-[11px]",
        lg: "h-11 px-5 py-2.5 text-sm",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7.5 w-7.5 p-0",
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
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5 shrink-0" />}
        {!loading && leftIcon && <span className="mr-1.5 shrink-0 inline-flex items-center">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-1.5 shrink-0 inline-flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
