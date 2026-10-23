import { useState, useEffect, useRef, useCallback } from "react";
import PowerScreen from "./layouts/PowerScreen";
import LockScreen from "./layouts/LockScreen";
import Desktop from "./layouts/DesktopWindow";
import { useAppStore } from "./store/Appstore";

const INACTIVITY_TIMEOUT = 60 * 1000; // 1 minute in milliseconds

export default function App() {
  const [stage, setStage] = useState(null);
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

    if (!localStorage.getItem("lock_username") || ["Likhith SP", "Developer"].includes(localStorage.getItem("lock_username"))) {
      localStorage.setItem("lock_username", "Khaled");
    }

    if (localStorage.getItem("lock_password") === null) {
      localStorage.setItem("lock_password", "");
    }

    if (!localStorage.getItem("lock_profile_photo") || localStorage.getItem("lock_profile_photo").includes("bf57026ee75af2f414000cec322f7404.gif")) {
      localStorage.setItem("lock_profile_photo", "/icons/apple.png");
      localStorage.setItem("lock_profile_bg", "#1e1e24");
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
 
  // Boot and Stage Sequence
  useEffect(() => {
    const hasBootedInSession = sessionStorage.getItem("os_booted") === "true";
    const savedState = localStorage.getItem("os_state");

    if (!hasBootedInSession) {
      // Show Apple logo boot loading screen on initial visit/tab open
      setStage("power");
    } else if (savedState === "desktop") {
      setStage("desktop");
    } else {
      setStage("lock");
    }
  }, []);

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

  useEffect(() => {
    if (!stage) return;
    localStorage.setItem("os_state", stage);
    localStorage.setItem("os_state_time", String(Date.now()));
  }, [stage]);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem("os_booted", "true");
    setStage("lock");
  }, []);

  if (!stage) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Boot screen with Apple logo & progress bar */}
      {stage === "power" && (
        <PowerScreen
          autoBoot={true}
          goNext={handleBootComplete}
        />
      )}

      {/* Reboot from Apple menu */}
      {stage === "restart" && (
        <PowerScreen
          autoBoot={true}
          goNext={handleBootComplete}
        />
      )}
      
      {/* Desktop renders behind lock screen so it's ready and visible during slide-up */}
      {(stage === "lock" || stage === "desktop") && (
        <div className="absolute inset-0">
          <Desktop setStage={setStage} isLocked={stage === "lock"} />
        </div>
      )}
      
      {/* Lock screen slides up smoothly to reveal desktop without requiring a password */}
      {(stage === "lock" || stage === "desktop") && (
        <div 
          className="absolute inset-0 z-50"
          style={{
            visibility: stage === "lock" ? "visible" : "hidden",
            pointerEvents: stage === "lock" ? "auto" : "none"
          }}
        >
          <LockScreen goNext={() => setStage("desktop")} isLocked={stage === "lock"} />
        </div>
      )}
    </div>
  );
}
