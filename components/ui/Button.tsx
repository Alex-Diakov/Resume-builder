import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-panel disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-ds-primary text-white shadow-md hover:shadow-glow hover:bg-ds-primary-hover border border-ds-border",
        secondary: "bg-ds-active text-ds-text-high border border-ds-border hover:bg-ds-hover",
        outline: "border border-ds-border bg-transparent hover:bg-ds-hover text-ds-text-medium hover:text-ds-text-high",
        ghost: "bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover",
        danger: "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20",
      },
      size: {
        default: "h-10 px-4.5 py-2",
        sm: "h-8 px-3 py-1.5 text-[10px]",
        lg: "h-12 px-6 py-3",
        icon: "h-9 w-9",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
