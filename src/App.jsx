import { useState, useEffect, useRef, useCallback } from "react";
import PowerScreen from "./layouts/PowerScreen";
import LockScreen from "./layouts/LockScreen";
import Desktop from "./layouts/DesktopWindow";
import { useAppStore } from "./store/Appstore";
import { playMacStartupChime } from "./utils/sound";

const INACTIVITY_TIMEOUT = 60 * 1000; // 1 minute in milliseconds

export default function App() {
  const [stage, setStage] = useState("power");
  const inactivityTimerRef = useRef(null);
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  // Initialize Default User Profile, Algeria Region, Machine Timezone, and bypass setup
  useEffect(() => {
    localStorage.setItem("setup_completed", "true");
    localStorage.setItem("setup_country", "Algeria");
    localStorage.setItem("setup_region", "Algeria");
    localStorage.setItem("setup_lang", "English (US)");

    const machineTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Algiers";
    localStorage.setItem("setup_timezone", machineTimezone);

    localStorage.setItem("lock_username", "khaled :)");

    if (localStorage.getItem("lock_password") === null) {
      localStorage.setItem("lock_password", "");
    }

    localStorage.setItem("lock_profile_photo", "/icons/khaled-avatar.png");
    localStorage.setItem("lock_profile_bg", "transparent");

    if (!localStorage.getItem("desktop_wallpaper_preset_v5")) {
      localStorage.setItem("desktop_wallpaper", "/Wallpaper/FGrad_Feb21_Mac.png");
      localStorage.setItem("lockscreen_wallpaper", "/Wallpaper/FGrad_Feb21_Mac.png");
      localStorage.setItem("desktop_wallpaper_preset_v5", "true");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  
  // Reset inactivity timer on any user activity
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Only start timer when on desktop
    if (stage === "desktop") {
      inactivityTimerRef.current = setTimeout(() => {
        setStage("lock");
      }, INACTIVITY_TIMEOUT);
    }
  }, [stage]);
  
  // Activity listeners for 1-minute auto-lock
  useEffect(() => {
    if (stage !== "desktop") {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }
    
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'wheel'
    ];
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    resetInactivityTimer();
    
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [stage, resetInactivityTimer]);
 
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  useEffect(() => {
    const handleLockShortcut = (e) => {
      if (stage === "desktop" && e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setStage("lock");
      }
    };
    window.addEventListener("keydown", handleLockShortcut);
    return () => {
      window.removeEventListener("keydown", handleLockShortcut);
    };
  }, [stage]);

  const handleUnlockToDesktop = useCallback(() => {
    setStage("desktop");
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Desktop workspace always rendered underneath */}
      <div className="absolute inset-0 z-0">
        <Desktop setStage={setStage} isLocked={stage !== "desktop"} />
      </div>
      
      {/* Lock screen when locked directly from desktop / sleep */}
      {stage === "lock" && (
        <div className="absolute inset-0 z-40">
          <LockScreen goNext={handleUnlockToDesktop} isLocked={true} isActive={true} />
        </div>
      )}

      {/* Boot loader overlay with WeightSweepPreloader and sliding Login Screen */}
      {(stage === "power" || stage === "restart") && (
        <div className="absolute inset-0 z-50 pointer-events-auto">
          <PowerScreen
            autoBoot={true}
            goNext={handleUnlockToDesktop}
          />
        </div>
      )}
    </div>
  );
}
