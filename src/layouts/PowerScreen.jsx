import React, { useState, useEffect, useRef } from "react";
import WeightSweepPreloader from "../components/ui/weight-sweep-preloader";
import LockScreen from "./LockScreen";
import { playMacStartupChime } from "../utils/sound";
import { toCanvas } from "html-to-image";
import { setAppSnapshot } from "../components/ui/GenieOverlay";
import Finder from "../app/Finder";
import { Safari } from "../app/Safari";
import Mail from "../app/Mail";
import Maps from "../app/Maps";
import Phone from "../app/Phone";
import Contacts from "../app/Contacts";
import Blogs from "../app/Blogs/BlogsSection.jsx";
import MacGallery from "../app/Gallary";
import Spotify from "../app/Spotify";
import CalendarApp from "../app/Calendar";
import Terminal from "../app/Terminal";
import Settings from "../app/Settings";
import Trash from "../app/Trash";

const CRITICAL_IMAGES = [
  "/Wallpaper/FGrad_Feb21_Mac.png",
  "/icons/khaled-avatar.png",
  "/Wallpaper/GoldenGate_6k.png",
  "/Wallpaper/Golden_Dark_6k.png",
  "/icons/apple.png",
  "https://cdn.21st.dev/assets/mirror/99/9963f31f43cd77b0c28981ba7bac04db749a5749019f554d1afb75225a3e9151.png",
  "https://cdn.21st.dev/assets/mirror/d5/d558230225bb0dd1897db6c7cf0d03b29506eef8078fe25313c48cd8f72d05ad.png",
  "https://cdn.21st.dev/assets/mirror/7b/7bb8671183d2a2bbb8a3858b1971cc5699ba0103673b011590d22f0fa309bb87.png",
  "https://s3-new.macosicons.com/macosicons/parse/low_res_Maps_macOS_Golden_Gate_jOxvDFgSHw-b6ceac8cd4.png",
  "https://s3-new.macosicons.com/macosicons/parse/low_res_Phone_macOS_Golden_Gate_NWKA493TFf-bffc4d8efc.png",
  "https://s3-new.macosicons.com/macosicons/parse/low_res_Contacts_macOS_Golden_Gate_oKWnz3UDu6-20ba74faaf.png",
  "https://cdn.21st.dev/assets/mirror/cb/cbfa4e5db383bbb86683edc2f7d309e9fd7000d07833f6449837be51b77558fa.png",
  "https://cdn.21st.dev/assets/mirror/45/45c61147b702b2765802969df55878aa5f69e27abe656174339dc661d0f9a31d.png",
  "https://cdn.21st.dev/assets/mirror/03/035600d3c05ccbfc974888a3319fa721dac7321dd18734a5d0405af1fd259c41.png",
  "https://cdn.21st.dev/assets/mirror/e1/e1e93987488d4a904f4b7273213d36319c73d81ca9680b440c144f69af5a7f9a.png",
  "https://cdn.21st.dev/assets/mirror/11/11d8587bae8852b8232d1f37e318c4b0fbbd2b0f2b61c71a79dbae327b4fa0c1.webp",
  "https://s3-new.macosicons.com/macosicons/parse/low_res_Settings_macOS_Golden_Gate_iR77bVvZBc-502ef0dc70.png",
  "https://s3-new.macosicons.com/macosicons/parse/Bin_Empty_Tahoe_x2cZW1cg7Y_lowResPng-cc516d2e3c.png"
];

const BOOT_APPS = [
  { id: "finder", name: "Finder", comp: <Finder />, width: 840, height: 580, hasTitleBar: false },
  { id: "safari", name: "Safari", comp: <Safari />, width: 860, height: 580, hasTitleBar: false },
  { id: "mail", name: "Mail", comp: <Mail />, width: 840, height: 580, hasTitleBar: false },
  { id: "maps", name: "Maps", comp: <Maps />, width: 840, height: 580, hasTitleBar: false },
  { id: "phone", name: "Phone", comp: <Phone />, width: 720, height: 520, hasTitleBar: false },
  { id: "contacts", name: "Contacts", comp: <Contacts />, width: 720, height: 520, hasTitleBar: false },
  { id: "notes", name: "Notes", comp: <Blogs />, width: 840, height: 580, hasTitleBar: false },
  { id: "photos", name: "Photos", comp: <MacGallery />, width: 840, height: 580, hasTitleBar: false },
  { id: "music", name: "Music", comp: <Spotify />, width: 840, height: 580, hasTitleBar: false },
  { id: "calendar", name: "Calendar", comp: <CalendarApp />, width: 840, height: 580, hasTitleBar: false },
  { id: "terminal", name: "Terminal", comp: <Terminal />, width: 700, height: 460, hasTitleBar: true },
  { id: "settings", name: "Settings", comp: <Settings />, width: 780, height: 520, hasTitleBar: true },
  { id: "trash", name: "Trash", comp: <Trash />, width: 840, height: 580, hasTitleBar: false },
];

export default function PowerScreen({ goNext, autoBoot = true }) {
  const [bootStarted, setBootStarted] = useState(autoBoot);
  const [preloadDone, setPreloadDone] = useState(false);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const goNextRef = useRef(goNext);
  const appRefs = useRef({});

  useEffect(() => {
    goNextRef.current = goNext;
  }, [goNext]);

  useEffect(() => {
    if (!bootStarted) {
      setBootStarted(true);
    }
  }, [bootStarted]);

  useEffect(() => {
    if (!bootStarted) return;
    let cancelled = false;

    const runEssentialPreload = async () => {
      // 1. Parallel preload for images & wallpapers
      const imagePromises = CRITICAL_IMAGES.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      });

      // 2. Background snapshot pre-warming in background microtasks
      const snapshotWorker = async () => {
        await new Promise((r) => requestAnimationFrame(r));
        for (const app of BOOT_APPS) {
          if (cancelled) break;
          const node = appRefs.current[app.id];
          if (node) {
            try {
              const canvas = await toCanvas(node, { pixelRatio: 1, cacheBust: false });
              if (!cancelled && canvas) {
                setAppSnapshot(app.id, canvas);
              }
            } catch (err) {}
          }
          await new Promise((r) => setTimeout(r, 10));
        }
      };

      await Promise.allSettled([
        Promise.allSettled(imagePromises),
        snapshotWorker(),
      ]);

      if (!cancelled) {
        setPreloadDone(true);
      }
    };

    runEssentialPreload();

    return () => {
      cancelled = true;
    };
  }, [bootStarted]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent relative select-none">
      {/* Hidden pre-warming stage (active ONLY during boot screen, completely unmounted after) */}
      {!preloadDone && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: -10000,
            top: 0,
            pointerEvents: "none",
            zIndex: -99999,
          }}
        >
          {BOOT_APPS.map((item) => (
            <div
              key={item.id}
              ref={(el) => {
                appRefs.current[item.id] = el;
              }}
              style={{
                width: item.width,
                height: item.height,
                marginBottom: 30,
              }}
              className="flex flex-col overflow-hidden rounded-xl bg-[#1e1e1e] text-white border border-white/10 shadow-2xl"
            >
              {item.hasTitleBar && (
                <div className="h-9 px-4 flex items-center bg-[#252528] border-b border-white/10 shrink-0 relative">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-white/70">
                    {item.name}
                  </div>
                </div>
              )}
              <div className="flex-1 overflow-hidden flex flex-col">
                {item.comp}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WeightSweepPreloader with sliding LockScreen panel */}
      <WeightSweepPreloader
        preset="ink"
        palette={{ paper: "#08080c", ink: "#f4f0e6" }}
        label="Apple Silicon / macOS"
        caption="Pre-warming Core"
        durationMs={2200}
        slideDirection="down"
        onPanel={() => {
          setIsPanelActive(true);
          playMacStartupChime();
        }}
        panelContent={
          <LockScreen
            goNext={() => {
              if (goNextRef.current) {
                goNextRef.current();
              }
            }}
            isLocked={true}
            isActive={isPanelActive}
          />
        }
      />
    </div>
  );
}
