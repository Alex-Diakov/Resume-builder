import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'panel' | 'container' | 'outline' | 'interactive' | 'elevated' | 'filled' | 'outlined';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-md-lg text-md-on-surface transition-all duration-200",
        // M3 Elevated
        (variant === 'elevated' || variant === 'panel') && "bg-md-surface-container-low border border-md-outline-variant/40 shadow-md-elevation-1",
        // M3 Filled
        (variant === 'filled' || variant === 'container') && "bg-md-surface-container border border-transparent shadow-none",
        // M3 Outlined
        (variant === 'outlined' || variant === 'outline') && "bg-transparent border border-md-outline-variant shadow-none",
        // M3 Interactive
        variant === 'interactive' && "bg-md-surface-container-low border border-md-outline-variant/60 shadow-md-elevation-1 hover:shadow-md-elevation-2 hover:border-md-primary/40 hover:bg-md-surface-container cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-4.5", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-[15px] font-semibold tracking-tight text-md-on-surface font-sans", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs text-md-on-surface-variant leading-relaxed font-sans", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4.5 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-4.5 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
