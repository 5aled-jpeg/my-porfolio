import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/Appstore.js";
import MacOSDock from "./ui/mac-os-dock";
import GenieOverlay, { genieController } from "./ui/GenieOverlay";
import { Safari } from "../app/Safari";
import Spotify from "../app/Spotify";
import Settings from "../app/Settings";
import MacGallery from "../app/Gallary";
import Blogs from "../app/Blogs/BlogsSection.jsx";
import Finder from "../app/Finder";
import Trash from "../app/Trash";
import Mail from "../app/Mail";
import CalendarApp from "../app/Calendar";
import Calculator from "../app/Calculator";
import Terminal from "../app/Terminal";

// Helper to create component on demand
const renderAppComponent = (appId) => {
  switch (appId) {
    case "Finder":
      return <Finder />;
    case "Calculator":
      return <Calculator />;
    case "Terminal":
      return <Terminal />;
    case "Safari":
      return <Safari />;
    case "Mail":
      return <Mail />;
    case "Notes":
      return <Blogs />;
    case "Photos":
      return <MacGallery />;
    case "Music":
      return <Spotify />;
    case "Calendar":
      return <CalendarApp />;
    case "Settings":
      return <Settings />;
    case "Trash":
      return <Trash />;
    default:
      return null;
  }
};

export default function Dock() {
  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);

  const [hasTrashedItems, setHasTrashedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("os_trash");
      return saved ? JSON.parse(saved).length > 0 : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleTrashUpdated = (e) => {
      setHasTrashedItems(e.detail.hasFiles);
    };
    const handleFileTrashed = () => {
      setHasTrashedItems(true);
    };

    window.addEventListener("os_trash_updated", handleTrashUpdated);
    window.addEventListener("os_file_trash", handleFileTrashed);
    return () => {
      window.removeEventListener("os_trash_updated", handleTrashUpdated);
      window.removeEventListener("os_file_trash", handleFileTrashed);
    };
  }, []);

  const dockApps = [
    { 
      id: 'finder', 
      name: 'Finder', 
      windowAppId: 'Finder',
      icon: 'https://cdn.21st.dev/assets/mirror/99/9963f31f43cd77b0c28981ba7bac04db749a5749019f554d1afb75225a3e9151.png' 
    },
    { 
      id: 'calculator', 
      name: 'Calculator', 
      windowAppId: 'Calculator',
      icon: 'https://cdn.21st.dev/assets/mirror/96/9639bd0ec3bae0b56bd8812f61c39d72123c6de272922e5bc7f3a24264112953.png' 
    },
    { 
      id: 'terminal', 
      name: 'Terminal', 
      windowAppId: 'Terminal',
      icon: 'https://cdn.21st.dev/assets/mirror/11/11d8587bae8852b8232d1f37e318c4b0fbbd2b0f2b61c71a79dbae327b4fa0c1.webp' 
    },
    { 
      id: 'mail', 
      name: 'Mail', 
      windowAppId: 'Mail',
      icon: 'https://cdn.21st.dev/assets/mirror/7b/7bb8671183d2a2bbb8a3858b1971cc5699ba0103673b011590d22f0fa309bb87.png' 
    },
    { 
      id: 'notes', 
      name: 'Notes', 
      windowAppId: 'Notes',
      icon: 'https://cdn.21st.dev/assets/mirror/cb/cbfa4e5db383bbb86683edc2f7d309e9fd7000d07833f6449837be51b77558fa.png' 
    },
    { 
      id: 'safari', 
      name: 'Safari', 
      windowAppId: 'Safari',
      icon: 'https://cdn.21st.dev/assets/mirror/d5/d558230225bb0dd1897db6c7cf0d03b29506eef8078fe25313c48cd8f72d05ad.png' 
    },
    { 
      id: 'photos', 
      name: 'Photos', 
      windowAppId: 'Photos',
      icon: 'https://cdn.21st.dev/assets/mirror/45/45c61147b702b2765802969df55878aa5f69e27abe656174339dc661d0f9a31d.png' 
    },
    { 
      id: 'music', 
      name: 'Music', 
      windowAppId: 'Music',
      icon: 'https://cdn.21st.dev/assets/mirror/03/035600d3c05ccbfc974888a3319fa721dac7321dd18734a5d0405af1fd259c41.png' 
    },
    { 
      id: 'calendar', 
      name: 'Calendar', 
      windowAppId: 'Calendar',
      icon: 'https://cdn.21st.dev/assets/mirror/e1/e1e93987488d4a904f4b7273213d36319c73d81ca9680b440c144f69af5a7f9a.png' 
    },
    {
      id: 'settings',
      name: 'Settings',
      windowAppId: 'Settings',
      icon: 'https://s3-new.macosicons.com/macosicons/parse/low_res_Settings_macOS_Golden_Gate_iR77bVvZBc-502ef0dc70.png',
    },
    {
      id: 'trash',
      name: 'Trash',
      windowAppId: 'Trash',
      icon: hasTrashedItems
        ? 'https://s3.macosicons.com/macosicons/icons/yrypldfXBR/lowResPngFile_c3be764d323d03b2ce9921be92216fca_yrypldfXBR.png'
        : 'https://s3-new.macosicons.com/macosicons/parse/Bin_Empty_Tahoe_x2cZW1cg7Y_lowResPng-cc516d2e3c.png',
    },
  ];

  // List of active open app ids
  const openApps = windows.map((w) => {
    if (w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer") return "finder";
    return w.appId.toLowerCase();
  });

  const handleAppClick = (appId) => {
    const app = dockApps.find((a) => a.id === appId);
    if (!app) return;

    const winAppId = app.windowAppId || app.name;
    const existingWindow = windows.find((w) => 
      w.appId === winAppId || 
      (winAppId === "Finder" && (w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer"))
    );

    // Get clicked icon coordinates for Genie effect
    const dockIconEl = document.querySelector(`[data-app-id="${app.id}"], [title="${app.name}"]`);
    const rect = dockIconEl ? dockIconEl.getBoundingClientRect() : null;
    const dockPos = rect ? {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    } : {
      x: window.innerWidth / 2,
      y: window.innerHeight - 35,
    };

    // Calculate window destination
    const isCalc = winAppId === "Calculator";
    const winW = isCalc ? 320 : Math.min(840, window.innerWidth * 0.65);
    const winH = isCalc ? 440 : Math.min(580, window.innerHeight * 0.72);
    let winRect = {
      x: Math.max(20, (window.innerWidth - winW) / 2),
      y: Math.max(40, (window.innerHeight - winH) / 2 - 20),
      width: winW,
      height: winH,
    };

    const existingEl = document.querySelector(`.app-window-${winAppId.toLowerCase()}`);
    if (existingEl) {
      const b = existingEl.getBoundingClientRect();
      if (b.width > 50 && b.height > 50) {
        winRect = { x: b.left, y: b.top, width: b.width, height: b.height };
      }
    }

    if (existingWindow) {
      if (existingWindow.minimized) {
        // Trigger Genie Open from dock into window
        genieController.play({
          dir: "open",
          appId: app.id,
          dock: dockPos,
          win: winRect,
          title: app.name,
          duration: 420,
          onComplete: () => {
            restoreApp(existingWindow.id);
          },
        });
      } else {
        focusApp(existingWindow.id);
      }
    } else {
      const comp = renderAppComponent(winAppId);
      if (comp) {
        // Trigger Genie Open from dock into window
        genieController.play({
          dir: "open",
          appId: app.id,
          dock: dockPos,
          win: winRect,
          title: app.name,
          duration: 420,
          onComplete: () => {
            openApp(winAppId, comp);
          },
        });
      }
    }
  };

  return (
    <>
      <GenieOverlay />
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[99999] pointer-events-auto">
        <MacOSDock
          apps={dockApps}
          onAppClick={handleAppClick}
          openApps={openApps}
        />
      </div>
    </>
  );
}
