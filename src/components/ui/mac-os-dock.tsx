'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

export interface DockApp {
  id: string;
  name: string;
  icon: string;
  divider?: boolean;
}

export interface MacOSDockProps {
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps?: string[];
  className?: string;
}

interface DockIconProps {
  mouseX: MotionValue<number>;
  app: DockApp;
  onAppClick: (appId: string) => void;
  isOpen: boolean;
  baseSize: number;
}

const DockIcon: React.FC<DockIconProps> = ({
  mouseX,
  app,
  onAppClick,
  isOpen,
  baseSize,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isBouncing, setIsBouncing] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - (bounds.x + bounds.width / 2);
  });

  // Authentic macOS magnification: icons smoothly expand to ~1.46x peak width
  const widthSync = useTransform(distance, [-130, 0, 130], [baseSize, baseSize * 1.46, baseSize]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 18 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 700);
    onAppClick(app.id);
  };

  return (
    <div className="relative group flex flex-col items-center justify-end select-none">
      {/* Sleek macOS Floating Tooltip */}
      <div 
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 px-2.5 py-0.5 rounded-md bg-[#1e1e24]/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none"
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
        }}
      >
        {app.name}
      </div>

      {/* Magnified Icon Container */}
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        whileTap={{ scale: 0.9 }}
        className={`cursor-pointer flex items-center justify-center origin-bottom will-change-transform ${
          isBouncing ? "animate-dock-bounce" : ""
        }`}
        onClick={handleClick}
      >
        <img
          src={app.icon}
          alt={app.name}
          className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      {/* Running App Indicator Dot */}
      <div className="h-1.5 flex items-center justify-center mt-0.5">
        {isOpen && (
          <div className="w-1 h-1 rounded-full bg-white/90 shadow-[0_0_5px_rgba(255,255,255,0.85)]" />
        )}
      </div>
    </div>
  );
};

const MacOSDock: React.FC<MacOSDockProps> = ({
  apps,
  onAppClick,
  openApps = [],
  className = '',
}) => {
  const mouseX = useMotionValue(Infinity);
  const baseSize = 48;

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-end gap-1.5 sm:gap-2 px-3 py-1.5 rounded-2xl backdrop-blur-2xl ${className}`}
      style={{
        background: 'rgba(32, 32, 36, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: `
          0 12px 36px rgba(0, 0, 0, 0.45),
          0 2px 10px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.25),
          inset 0 -1px 0 rgba(0, 0, 0, 0.3)
        `,
      }}
    >
      {apps.map((app) => {
        if (app.divider) {
          return (
            <div
              key={app.id || 'divider'}
              className="w-[1px] h-7 bg-white/20 mx-1 mb-2.5 self-center rounded-full"
            />
          );
        }

        return (
          <DockIcon
            key={app.id}
            mouseX={mouseX}
            app={app}
            onAppClick={onAppClick}
            isOpen={openApps.includes(app.id)}
            baseSize={baseSize}
          />
        );
      })}
    </motion.div>
  );
};

export default MacOSDock;
