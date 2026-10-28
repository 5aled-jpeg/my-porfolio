import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import "./InteractiveFashionGallery.css";

// Register GSAP plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, InertiaPlugin, Flip);
}

// 24 Authentic macOS Wallpapers with High-DPI Thumbnails
export const OUR_PHOTOS = [
  {
    id: "golden-gate-6k",
    src: "/Wallpaper/GoldenGate_6k.png",
    thumb: "/Wallpaper/thumbs/GoldenGate_6k.jpg",
    title: "Golden Gate Sunset",
    description: "San Francisco, California. 6K Ultra-HD capture across the Pacific strait at twilight.",
    number: "01",
  },
  {
    id: "golden-dark-6k",
    src: "/Wallpaper/Golden_Dark_6k.png",
    thumb: "/Wallpaper/thumbs/Golden_Dark_6k.jpg",
    title: "Golden Gate Twilight",
    description: "Dusk over Marin Headlands with glowing city lights shimmering across the bay.",
    number: "02",
  },
  {
    id: "big-sur-day",
    src: "/Wallpaper/11-0-Big-Sur-Day-6k.jpg",
    thumb: "/Wallpaper/thumbs/11-0-Big-Sur-Day-6k.jpg",
    title: "Big Sur Coastline",
    description: "California Highway 1 meeting the Pacific ocean waves in pristine, sunlit clarity.",
    number: "03",
  },
  {
    id: "big-sur-night",
    src: "/Wallpaper/big-sur-mountains-night-dark-macos-big-sur-stock-california-6016x6016-1493.jpg",
    thumb: "/Wallpaper/thumbs/big-sur-mountains-night-dark-macos-big-sur-stock-california-6016x6016-1493.jpg",
    title: "Big Sur Midnight",
    description: "Starry skies reflecting against the dramatic, rugged cliffs of the Central Coast.",
    number: "04",
  },
  {
    id: "lone-cypress",
    src: "/Wallpaper/macos-big-sur-stock-night-lone-tree-sedimentary-rocks-6016x6016-3776.jpg",
    thumb: "/Wallpaper/thumbs/macos-big-sur-stock-night-lone-tree-sedimentary-rocks-6016x6016-3776.jpg",
    title: "Lone Cypress Night",
    description: "Ancient Monterey Cypress standing resolute against ocean winds under midnight stars.",
    number: "05",
  },
  {
    id: "catalina-dark",
    src: "/Wallpaper/macOS-Catalina-Dark-Mode.jpg",
    thumb: "/Wallpaper/thumbs/macOS-Catalina-Dark-Mode.jpg",
    title: "Santa Catalina Island",
    description: "Deep blue Pacific waters under full moonlight along the rugged Catalina channel.",
    number: "06",
  },
  {
    id: "sonoma-light",
    src: "/Wallpaper/macOS-Sonoma-light.jpg",
    thumb: "/Wallpaper/thumbs/macOS-Sonoma-light.jpg",
    title: "Sonoma Valley Dawn",
    description: "Rolling vineyard hills enveloped in soft, golden morning California valley fog.",
    number: "07",
  },
  {
    id: "sonoma-dark",
    src: "/Wallpaper/macOS-Sonomaa-dark.jpg",
    thumb: "/Wallpaper/thumbs/macOS-Sonomaa-dark.jpg",
    title: "Sonoma Night",
    description: "Sculpted terrain under the starry North Bay California night sky.",
    number: "08",
  },
  {
    id: "ventura-light",
    src: "/Wallpaper/13-Ventura-Light.jpg",
    thumb: "/Wallpaper/thumbs/13-Ventura-Light.jpg",
    title: "Ventura Bloom",
    description: "Abstract desert flora sculpted in high-dynamic California coastal sunshine.",
    number: "09",
  },
  {
    id: "tahoe-light",
    src: "/Wallpaper/26-Tahoe-Light-6K-thumb.jpeg",
    thumb: "/Wallpaper/thumbs/26-Tahoe-Light-6K-thumb.jpg",
    title: "Lake Tahoe Azure",
    description: "Sierra Nevada alpine waters crystal clear across ancient granite boulders.",
    number: "10",
  },
  {
    id: "tahoe-dawn",
    src: "/Wallpaper/26-Tahoe-Beach-Dawn-thumb.jpeg",
    thumb: "/Wallpaper/thumbs/26-Tahoe-Beach-Dawn-thumb.jpg",
    title: "Tahoe Beach Dawn",
    description: "First rays touching the granite boulders along the serene alpine lake edge.",
    number: "11",
  },
  {
    id: "macbook-air",
    src: "/Wallpaper/15-inch-MacBook-Air-wallpaper-1.webp",
    thumb: "/Wallpaper/thumbs/15-inch-MacBook-Air-wallpaper-1.webp",
    title: "MacBook Air Waves",
    description: "Liquid geometry and flowing iridescent glass ribbons rendered in pure harmony.",
    number: "12",
  },
  {
    id: "ferrari-f1",
    src: "/Wallpaper/formula-1-formula-cars-ferrari-ferrari-f1-ferrari-formula-1-hd-wallpaper-79f662068bca0f4ad0cb02dae8b765b3.jpg",
    thumb: "/Wallpaper/thumbs/formula-1-formula-cars-ferrari-ferrari-f1-ferrari-formula-1-hd-wallpaper-79f662068bca0f4ad0cb02dae8b765b3.jpg",
    title: "Scuderia Ferrari F1",
    description: "Maranello racing pedigree sculpted in aerodynamic carbon fiber and racing passion.",
    number: "13",
  },
  {
    id: "alpine-solitude",
    src: "/Wallpaper/chris-brignola-n7n-nkadHRM-unsplash.jpg",
    thumb: "/Wallpaper/thumbs/chris-brignola-n7n-nkadHRM-unsplash.jpg",
    title: "Alpine Solitude",
    description: "Dramatic mountain ridge lines silhouetted against a glowing twilight sunset.",
    number: "14",
  },
  {
    id: "apple-mesh",
    src: "/Wallpaper/FGrad_Feb21_Mac.png",
    thumb: "/Wallpaper/thumbs/FGrad_Feb21_Mac.jpg",
    title: "Apple Gradient Mesh",
    description: "Chromatic spectrum blending across deep space tones and atmospheric light.",
    number: "15",
  },
  {
    id: "neon-prism",
    src: "/Wallpaper/five.png",
    thumb: "/Wallpaper/thumbs/five.jpg",
    title: "Neon Luminescence",
    description: "Abstract optical prisms refracting vivid neon spectrums across midnight dark.",
    number: "16",
  },
  {
    id: "minimal-horizon",
    src: "/Wallpaper/three.jpg",
    thumb: "/Wallpaper/thumbs/three.jpg",
    title: "Minimalist Horizon",
    description: "Serene coastal horizon stretching toward infinite skies and quiet reflection.",
    number: "17",
  },
  {
    id: "golden-gate-fog",
    src: "/Wallpaper/golden-gate-bridge-san-francicso-lg.jpg",
    thumb: "/Wallpaper/thumbs/golden-gate-bridge-san-francicso-lg.jpg",
    title: "Golden Gate Span",
    description: "Iconic suspension towers rising majestically above the morning Pacific fog.",
    number: "18",
  },
  {
    id: "deep-space",
    src: "/Wallpaper/1175801.jpg",
    thumb: "/Wallpaper/thumbs/1175801.jpg",
    title: "Deep Space Nebula",
    description: "Interstellar dust clouds and cosmic starbursts floating in deep cosmos.",
    number: "19",
  },
  {
    id: "liquid-silk",
    src: "/Wallpaper/451898.jpg",
    thumb: "/Wallpaper/thumbs/451898.jpg",
    title: "Abstract Silk",
    description: "Fluid metallic ribbons catching ambient studio lighting with liquid grace.",
    number: "20",
  },
  {
    id: "architecture-poise",
    src: "/Wallpaper/GtB-Ex7WYAA9yAD.jpeg",
    thumb: "/Wallpaper/thumbs/GtB-Ex7WYAA9yAD.jpg",
    title: "Architectural Poise",
    description: "Clean geometric facades and modern architectural lines under clear daylight.",
    number: "21",
  },
  {
    id: "urban-symphony",
    src: "/Wallpaper/HJv1q-1bAAAxn-W.jpg",
    thumb: "/Wallpaper/thumbs/HJv1q-1bAAAxn-W.jpg",
    title: "Urban Symphony",
    description: "City lights and evening transit through the bustling metropolis.",
    number: "22",
  },
  {
    id: "vintage-rail",
    src: "/Wallpaper/HKfYptPbkAArZ5W.jpg",
    thumb: "/Wallpaper/thumbs/HKfYptPbkAArZ5W.jpg",
    title: "Vintage Locomotive",
    description: "Evening rails catching golden hour light along the dramatic coastal route.",
    number: "23",
  },
  {
    id: "ethereal-glow",
    src: "/Wallpaper/HKT-kq1W8AA8dat.jpg",
    thumb: "/Wallpaper/thumbs/HKT-kq1W8AA8dat.jpg",
    title: "Ethereal Glow",
    description: "Ambient lighting casting warm gradients through architectural glass panels.",
    number: "24",
  },
];

export default function InteractiveFashionGallery({ onSelectImage }) {
  const containerRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const gridContainerRef = useRef(null);
  const splitScreenRef = useRef(null);
  const zoomTargetRef = useRef(null);
  const closeButtonRef = useRef(null);
  const controlsRef = useRef(null);

  const [currentZoom, setCurrentZoom] = useState(0.6);
  const [zoomPercentage, setZoomPercentage] = useState(60);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [toastText, setToastText] = useState("");

  const draggableRef = useRef(null);
  const gridInitializedRef = useRef(false);
  const dragDistanceRef = useRef(0);

  const zoomStateRef = useRef({
    isActive: false,
    selectedItem: null,
    scalingOverlay: null,
    flipAnimation: null,
  });

  // 4 rows x 6 cols = 24 items
  const configRef = useRef({
    itemSize: 320,
    baseGap: 24,
    rows: 4,
    cols: 6,
    currentZoom: 0.6,
    currentGap: 28,
  });

  // Toast feedback helper
  const showToast = useCallback((msg) => {
    setToastText(msg);
    setTimeout(() => setToastText(""), 2600);
  }, []);

  // Set as desktop wallpaper
  const handleSetWallpaper = useCallback((photo) => {
    if (!photo) return;
    localStorage.setItem("desktop_wallpaper", photo.src);
    window.dispatchEvent(new Event("wallpaperChanged"));
    showToast(`Desktop wallpaper set to ${photo.title}`);
  }, [showToast]);

  // Set as lockscreen wallpaper
  const handleSetLockscreen = useCallback((photo) => {
    if (!photo) return;
    localStorage.setItem("lockscreen_wallpaper", photo.src);
    window.dispatchEvent(new Event("lockscreenDepthChanged"));
    showToast(`Lock screen set to ${photo.title}`);
  }, [showToast]);

  // Download full resolution photo
  const handleDownload = useCallback((photo) => {
    if (!photo) return;
    const a = document.createElement("a");
    a.href = photo.src;
    a.download = photo.src.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const newFile = {
      id: Date.now().toString(),
      name: photo.title,
      url: photo.src,
      type: "image",
      date: new Date().toISOString(),
      source: "Photos",
    };
    try {
      const existing = JSON.parse(localStorage.getItem("os_downloads") || "[]");
      localStorage.setItem("os_downloads", JSON.stringify([newFile, ...existing]));
      window.dispatchEvent(new CustomEvent("os_file_download", { detail: newFile }));
    } catch {}
    showToast(`Downloaded ${photo.title}`);
  }, [showToast]);

  const calculateGridDimensions = useCallback((gap = configRef.current.currentGap) => {
    const totalWidth = configRef.current.cols * (configRef.current.itemSize + gap) - gap;
    const totalHeight = configRef.current.rows * (configRef.current.itemSize + gap) - gap;
    return {
      width: totalWidth,
      height: totalHeight,
      scaledWidth: totalWidth * configRef.current.currentZoom,
      scaledHeight: totalHeight * configRef.current.currentZoom,
      gap,
    };
  }, []);

  // Generous pan bounds so the canvas can ALWAYS be dragged in every direction
  const calculateBounds = useCallback(() => {
    const container = containerRef.current;
    const cw = container?.clientWidth || 800;
    const ch = container?.clientHeight || 520;
    const dims = calculateGridDimensions();
    const marginX = Math.max(cw * 0.45, 300);
    const marginY = Math.max(ch * 0.45, 250);

    return {
      minX: Math.min(-marginX, cw - dims.scaledWidth - marginX),
      maxX: Math.max(cw * 0.4, marginX),
      minY: Math.min(-marginY, ch - dims.scaledHeight - marginY),
      maxY: Math.max(ch * 0.4, marginY),
    };
  }, [calculateGridDimensions]);

  // Create lightweight scaling overlay for 60fps Flip fit animation
  const createScalingOverlay = (sourceImg) => {
    const overlay = document.createElement("div");
    overlay.className = "ifg-scaling-overlay";
    const img = document.createElement("img");
    img.src = sourceImg.src; // Uses the 30KB thumbnail for instant 60fps animation
    img.alt = sourceImg.alt;
    overlay.appendChild(img);
    containerRef.current?.appendChild(overlay);

    const sourceRect = sourceImg.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    gsap.set(overlay, {
      left: sourceRect.left - containerRect.left,
      top: sourceRect.top - containerRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
      opacity: 1,
    });
    return overlay;
  };

  // Enter Zoom Mode with signature GSAP Flip fit expansion
  const enterZoomMode = useCallback((itemData) => {
    const zoomState = zoomStateRef.current;
    if (zoomState.isActive) return;

    zoomState.isActive = true;
    zoomState.selectedItem = itemData;
    setSelectedPhoto(itemData.photo);
    setIsZoomActive(true);

    if (draggableRef.current) draggableRef.current.disable();
    containerRef.current?.classList.add("zoom-mode");

    const splitContainer = splitScreenRef.current;
    const zoomTarget = zoomTargetRef.current;

    splitContainer.classList.add("active");
    gsap.to(splitContainer, {
      opacity: 1,
      duration: 0.65,
      ease: "power2.out",
    });

    // Create scaling overlay from grid tile
    const overlay = createScalingOverlay(itemData.img);
    zoomState.scalingOverlay = overlay;
    gsap.set(itemData.img, { opacity: 0 });

    // Smooth Flip.fit into the target frame on the left
    zoomState.flipAnimation = Flip.fit(overlay, zoomTarget, {
      duration: 0.85,
      ease: "power3.inOut",
      absolute: true,
      onComplete: () => {
        // Animate editorial info panel and action buttons on the right
        gsap.fromTo(
          ".ifg-slide-number",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.05 }
        );
        gsap.fromTo(
          ".ifg-slide-title",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.1 }
        );
        gsap.fromTo(
          ".ifg-slide-description",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.15 }
        );
        gsap.fromTo(
          ".ifg-action-bar",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.2 }
        );
        if (closeButtonRef.current) {
          gsap.fromTo(
            closeButtonRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.5)", delay: 0.1 }
          );
        }
      },
    });

    if (onSelectImage) onSelectImage(itemData.photo.src, itemData.index);
  }, [onSelectImage]);

  // Exit Zoom Mode with smooth Flip fit return to grid tile
  const exitZoomMode = useCallback(() => {
    const zoomState = zoomStateRef.current;
    if (!zoomState.isActive || !zoomState.scalingOverlay || !zoomState.selectedItem) {
      setIsZoomActive(false);
      setSelectedPhoto(null);
      return;
    }

    const splitContainer = splitScreenRef.current;
    const selectedItem = zoomState.selectedItem;

    if (zoomState.flipAnimation) {
      zoomState.flipAnimation.kill();
    }

    // Animate out info panel and split container
    gsap.to([".ifg-slide-number", ".ifg-slide-title", ".ifg-slide-description", ".ifg-action-bar", closeButtonRef.current], {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });

    if (splitContainer) {
      splitContainer.classList.remove("active");
      gsap.to(splitContainer, { opacity: 0, duration: 0.5, ease: "power2.out" });
    }

    // Flip.fit overlay back into the grid tile
    Flip.fit(zoomState.scalingOverlay, selectedItem.img, {
      duration: 0.75,
      ease: "power3.inOut",
      absolute: true,
      onComplete: () => {
        gsap.set(selectedItem.img, { opacity: 1 });
        if (zoomState.scalingOverlay && zoomState.scalingOverlay.parentNode) {
          zoomState.scalingOverlay.parentNode.removeChild(zoomState.scalingOverlay);
          zoomState.scalingOverlay = null;
        }
        containerRef.current?.classList.remove("zoom-mode");
        if (draggableRef.current) draggableRef.current.enable();
        zoomState.isActive = false;
        zoomState.selectedItem = null;
        setIsZoomActive(false);
        setSelectedPhoto(null);
      },
    });
  }, []);

  // Set Zoom
  const setZoom = useCallback((zoomLevel) => {
    if (zoomStateRef.current.isActive) {
      exitZoomMode();
      return;
    }
    configRef.current.currentZoom = zoomLevel;
    setCurrentZoom(zoomLevel);
    setZoomPercentage(Math.round(zoomLevel * 100));

    const wrapper = canvasWrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const dims = calculateGridDimensions();

    const centerX = (cw - dims.width * zoomLevel) / 2;
    const centerY = (ch - dims.height * zoomLevel) / 2;

    gsap.to(wrapper, {
      duration: 0.45,
      scale: zoomLevel,
      x: centerX,
      y: centerY,
      ease: "power2.out",
      onComplete: () => {
        if (draggableRef.current) {
          draggableRef.current.applyBounds(calculateBounds());
        }
      },
    });
  }, [calculateGridDimensions, calculateBounds, exitZoomMode]);

  // Auto-fit to screen
  const autoFitZoom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cw = container.clientWidth - 80;
    const ch = container.clientHeight - 80;
    const dims = calculateGridDimensions();
    const scaleX = cw / dims.width;
    const scaleY = ch / dims.height;
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.25), 1.0);
    setZoom(Number(fitScale.toFixed(2)));
  }, [calculateGridDimensions, setZoom]);

  // Initialize Canvas Grid & GSAP Draggable (Runs ONCE on mount)
  useEffect(() => {
    if (gridInitializedRef.current) return;
    gridInitializedRef.current = true;

    const container = containerRef.current;
    const wrapper = canvasWrapperRef.current;
    const grid = gridContainerRef.current;
    if (!container || !wrapper || !grid) return;

    const cw = container.clientWidth || 800;
    const ch = container.clientHeight || 520;
    const itemSize = configRef.current.itemSize;
    const gap = configRef.current.currentGap;
    const cols = configRef.current.cols;

    grid.innerHTML = "";

    // Generate 24 grid tiles using 30KB High-DPI thumbnails
    OUR_PHOTOS.forEach((photo, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const x = col * (itemSize + gap);
      const y = row * (itemSize + gap);

      const item = document.createElement("div");
      item.className = "ifg-grid-item";
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;

      const img = document.createElement("img");
      img.src = photo.thumb;
      img.alt = photo.title;
      img.loading = "lazy";
      img.decoding = "async";
      item.appendChild(img);

      const itemData = { element: item, img, photo, index: idx };

      // Distinguish click from canvas pan
      item.addEventListener("click", (e) => {
        if (dragDistanceRef.current > 6) return;
        enterZoomMode(itemData);
      });

      grid.appendChild(item);
    });

    const totalWidth = cols * (itemSize + gap) - gap;
    const totalHeight = configRef.current.rows * (itemSize + gap) - gap;
    grid.style.width = `${totalWidth}px`;
    grid.style.height = `${totalHeight}px`;

    // Center wrapper initially
    const initialZoom = configRef.current.currentZoom;
    const centerX = (cw - totalWidth * initialZoom) / 2;
    const centerY = (ch - totalHeight * initialZoom) / 2;

    gsap.set(wrapper, {
      x: centerX,
      y: centerY,
      scale: initialZoom,
    });

    // Native GSAP Draggable with free inertia panning
    draggableRef.current = Draggable.create(wrapper, {
      type: "x,y",
      bounds: calculateBounds(),
      inertia: true,
      edgeResistance: 0.7,
      dragResistance: 0.05,
      cursor: "grab",
      activeCursor: "grabbing",
      dragClickables: false,
      onPress: function () {
        dragDistanceRef.current = 0;
      },
      onDragStart: function () {
        containerRef.current?.classList.add("dragging");
      },
      onDrag: function () {
        dragDistanceRef.current += Math.abs(this.deltaX) + Math.abs(this.deltaY);
      },
      onDragEnd: function () {
        containerRef.current?.classList.remove("dragging");
        setTimeout(() => {
          dragDistanceRef.current = 0;
        }, 60);
      },
    })[0];

    // Debounced Resize Observer
    let resizeTimer = null;
    let lastCw = container.clientWidth;
    let lastCh = container.clientHeight;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newCw = entry.contentRect.width;
        const newCh = entry.contentRect.height;
        if (Math.abs(newCw - lastCw) > 15 || Math.abs(newCh - lastCh) > 15) {
          lastCw = newCw;
          lastCh = newCh;
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            if (draggableRef.current) {
              draggableRef.current.applyBounds(calculateBounds());
            }
          }, 150);
        }
      }
    });
    ro.observe(container);

    // Keyboard Shortcuts (Esc to close, 1/2/3 to zoom, F to fit)
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "Escape") {
        exitZoomMode();
        return;
      }
      switch (e.key) {
        case "1":
          setZoom(0.35);
          break;
        case "2":
          setZoom(0.6);
          break;
        case "3":
          setZoom(1.0);
          break;
        case "f":
        case "F":
          autoFitZoom();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Tab visibility re-sync
    const handleVis = () => {
      if (!document.hidden && draggableRef.current) {
        draggableRef.current.applyBounds(calculateBounds());
      }
    };
    document.addEventListener("visibilitychange", handleVis);

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVis);
      if (draggableRef.current) draggableRef.current.kill();
    };
  }, [calculateBounds, enterZoomMode, exitZoomMode, setZoom, autoFitZoom]);

  return (
    <div className={`ifg-root ${isZoomActive ? "zoom-mode" : ""}`} ref={containerRef}>
      {/* Main Viewport */}
      <div className="ifg-viewport">
        <div className="ifg-canvas-wrapper" ref={canvasWrapperRef}>
          <div className="ifg-grid-container" ref={gridContainerRef} />
        </div>
      </div>

      {/* Split Screen Layout (Zoom Mode) */}
      <div className={`ifg-split-screen ${isZoomActive ? "active" : ""}`} ref={splitScreenRef} onClick={exitZoomMode}>
        {/* Left Side: Target Frame for GSAP Flip fit */}
        <div className="ifg-split-left">
          <div className="ifg-zoom-target" ref={zoomTargetRef} onClick={(e) => e.stopPropagation()} />
        </div>

        {/* Right Side: Editorial Info & OS Actions */}
        <div className="ifg-split-right" onClick={(e) => e.stopPropagation()}>
          <div className="ifg-info-panel">
            {selectedPhoto && (
              <>
                <div className="ifg-slide-number">
                  <span>PHOTO {selectedPhoto.number} / 24</span>
                </div>
                <h1 className="ifg-slide-title">{selectedPhoto.title}</h1>
                <p className="ifg-slide-description">{selectedPhoto.description}</p>

                {/* macOS Action Bar */}
                <div className="ifg-action-bar">
                  <button
                    className="ifg-action-btn primary"
                    onClick={() => handleSetWallpaper(selectedPhoto)}
                    title="Set as macOS Desktop Wallpaper"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    <span>Set Desktop</span>
                  </button>
                  <button
                    className="ifg-action-btn"
                    onClick={() => handleSetLockscreen(selectedPhoto)}
                    title="Set as Lock Screen Wallpaper"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Set Lock Screen</span>
                  </button>
                  <button
                    className="ifg-action-btn"
                    onClick={() => handleDownload(selectedPhoto)}
                    title="Download original 6K image file"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          className="ifg-close-button"
          ref={closeButtonRef}
          onClick={exitZoomMode}
          title="Return to gallery (Esc)"
        >
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M7.89873 16L6.35949 14.48L11.8278 9.08H0V6.92H11.8278L6.35949 1.52L7.89873 0L16 8L7.89873 16Z" fill="white" />
          </svg>
        </button>
      </div>

      {/* Floating Bottom Controls Bar (Zooms) */}
      <div className={`ifg-controls-container ${isZoomActive ? "split-mode" : ""}`} ref={controlsRef}>
        <div className="ifg-percentage-indicator">
          {zoomPercentage}%
        </div>
        <div className="ifg-switch">
          <button
            className={`ifg-switch-button ${currentZoom <= 0.4 ? "current" : ""}`}
            onClick={() => setZoom(0.35)}
          >
            ZOOM OUT
          </button>
          <button
            className={`ifg-switch-button ${currentZoom > 0.4 && currentZoom < 0.85 ? "current" : ""}`}
            onClick={() => setZoom(0.6)}
          >
            NORMAL
          </button>
          <button
            className={`ifg-switch-button ${currentZoom >= 0.85 ? "current" : ""}`}
            onClick={() => setZoom(1.0)}
          >
            ZOOM IN
          </button>
          <button className="ifg-switch-button" onClick={autoFitZoom}>
            FIT
          </button>
        </div>
      </div>

      {/* Toast Feedback Pill */}
      {toastText && (
        <div className="ifg-toast-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28c840" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastText}</span>
        </div>
      )}

      {/* Cinematic Vignette Overlay */}
      <div className="ifg-vignette" />
    </div>
  );
}
