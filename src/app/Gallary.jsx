import React from "react";
import { useAppStore } from "../store/Appstore";
import InteractiveFashionGallery from "../components/gallery/InteractiveFashionGallery";

// macOS Window Traffic Lights (Close / Minimize / Maximize)
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows?.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-3">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => windowId && close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => windowId && minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
        onClick={() => windowId && toggleMaximize(windowId)}
        title={maximized ? "Restore" : "Maximize"}
      >
        <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          {maximized ? (
            <>
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default function MacGallery({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  return (
    <div
      className="relative flex flex-col h-full w-full overflow-hidden select-none bg-black"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      }}
    >
      {/* Top Window Toolbar */}
      <header
        className={`window-drag-handle h-[48px] border-b px-4 flex items-center justify-between shrink-0 select-none cursor-grab active:cursor-grabbing transition-colors duration-150 z-20 ${
          isDarkMode
            ? "bg-[#18181a] border-white/10 text-white"
            : "bg-[#f4f4f7] border-black/10 text-gray-800"
        }`}
      >
        {/* Left: Traffic Lights & Title */}
        <div className="flex items-center gap-3">
          <TrafficLights windowId={windowId} />
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold tracking-tight">Photos</span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isDarkMode
                  ? "bg-white/10 text-white/70 border border-white/10"
                  : "bg-black/5 text-gray-600 border border-black/5"
              }`}
            >
              24 Wallpapers
            </span>
          </div>
        </div>

        {/* Center / Right: Instructions / Controls Hint */}
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-medium hidden sm:inline ${isDarkMode ? "text-white/40" : "text-gray-400"}`}>
            Drag to pan &bull; Click to inspect &bull; Zoom 1 / 2 / 3 &bull; Esc to close
          </span>
        </div>
      </header>

      {/* Replaced entire area below toolbar with Interactive Fashion Gallery */}
      <main className="flex-1 relative overflow-hidden w-full h-[calc(100%-48px)]">
        <InteractiveFashionGallery />
      </main>
    </div>
  );
}
