import React, { createContext, useContext, useState } from "react";

const TooltipContext = createContext({ open: false });

export function TooltipProvider({ children, delayDuration = 0 }) {
  return <>{children}</>;
}

export function Tooltip({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <TooltipContext.Provider value={{ open }}>
        {children}
      </TooltipContext.Provider>
    </div>
  );
}

export function TooltipTrigger({ children, asChild }) {
  return <>{children}</>;
}

export function TooltipContent({ children, className = "", sideOffset = 8 }) {
  const { open } = useContext(TooltipContext);
  if (!open) return null;
  return (
    <div
      className={`absolute -top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-2.5 py-0.5 text-[11px] font-medium text-white bg-[#1a1a1e]/90 backdrop-blur-md rounded-md shadow-xl border border-white/15 whitespace-nowrap transition-all ${className}`}
      style={{ marginBottom: `${sideOffset}px` }}
    >
      {children}
    </div>
  );
}
