import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'motion/react';

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
    <TabsContext.Provider value={{ value: value || tab, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex bg-ds-panel/95 backdrop-blur-md p-1.5 rounded-xl border border-ds-border shadow-md gap-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  children, 
  className,
  icon: Icon
}: { 
  value: string; 
  children: React.ReactNode; 
  className?: string;
  icon?: any;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={cn(
        "flex-1 relative py-2.5 px-3 rounded-lg text-[10px] uppercase font-extrabold tracking-wider transition-all duration-300 cursor-pointer text-center focus-visible:outline-none flex items-center justify-center gap-2",
        isActive 
          ? "bg-ds-primary text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-[1.02] z-10" 
          : "bg-transparent text-ds-text-medium hover:text-ds-text-high hover:bg-ds-hover",
        className
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{children}</span>
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.value !== value) return null;

  return (
    <div className={cn("mt-4 animate-fade-in", className)}>
      {children}
    </div>
  );
}
