import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../utils/cn';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export function Tabs({ 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className 
}: { 
  defaultValue?: string; 
  value?: string; 
  onValueChange?: (v: string) => void; 
  children: React.ReactNode; 
  className?: string;
}) {
  const [tab, setTab] = useState(value || defaultValue || "");
  
  const handleValueChange = (v: string) => {
    if (onValueChange) {
      onValueChange(v);
    } else {
      setTab(v);
    }
  };

  return (
    <TabsContext.Provider value={{ value: value !== undefined ? value : tab, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex bg-md-surface-container-low p-1 rounded-full border border-md-outline-variant/40 shadow-none gap-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  children, 
  className,
  icon: Icon,
  badge
}: { 
  value: string; 
  children: React.ReactNode; 
  className?: string;
  icon?: any;
  badge?: React.ReactNode;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        "flex-1 relative py-1.5 px-3 rounded-full text-xs font-sans font-medium transition-all duration-200 cursor-pointer select-none text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/50 flex items-center justify-center gap-1.5",
        isActive 
          ? "bg-md-secondary-container text-md-on-secondary-container font-semibold z-10 shadow-none" 
          : "bg-transparent text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-container-high/60",
        className
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
      {badge && <span className="ml-1 shrink-0">{badge}</span>}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.value !== value) return null;

  return (
    <div className={cn("mt-3 animate-fade-in", className)}>
      {children}
    </div>
  );
}
