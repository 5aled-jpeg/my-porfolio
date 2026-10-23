import React, { useEffect, useRef } from "react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eioC = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eIn2 = (t) => t * t;
const eOut2 = (t) => 1 - (1 - t) * (1 - t);

// Helper to create high-res window texture
function createWindowTexture(title, width = 640, height = 480) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  // Window background
  ctx.fillStyle = "#1e1e24";
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [12, 12, 12, 12]);
  ctx.fill();

  // Title bar
  const grad = ctx.createLinearGradient(0, 0, 0, 40);
  grad.addColorStop(0, "rgba(255,255,255,0.12)");
  grad.addColorStop(1, "rgba(255,255,255,0.03)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, 40, [12, 12, 0, 0]);
  ctx.fill();

  // Traffic lights
  ctx.fillStyle = "#ff5f57";
  ctx.beginPath(); ctx.arc(18, 20, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#febc2e";
  ctx.beginPath(); ctx.arc(36, 20, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#28c840";
  ctx.beginPath(); ctx.arc(54, 20, 6, 0, Math.PI * 2); ctx.fill();

  // Window title
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "600 13px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title || "Window", width / 2, 24);

  // Content lines simulation
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(24, 60, width - 48, 80);
  ctx.fillRect(24, 160, width - 48, 120);

  return c;
}

export function renderGenieScanline(
  ctx,
  off,
  W,
  H,
  rawT,
  dir,
  dock,
  win
) {
  if (!off) return;
  ctx.clearRect(0, 0, W, H);
  const winW = win.width || 600;
  const winH = win.height || 420;

  for (let y = 0; y < winH; y += 2) {
    const r = y / winH;
    const rowXStart = dir === "minimize" ? (1 - r) * 0.65 : r * 0.65;
    const xP = clamp((rawT - rowXStart) / (1 - rowXStart), 0, 1);
    const xE = eioC(xP);
    const rowYStart = dir === "minimize" ? (1 - r) * 0.2 : r * 0.2;
    const yP = clamp((rawT - rowYStart) / (1 - rowYStart), 0, 1);
    const yE = eIn2(yP);

    let left, right, destY;
    if (dir === "minimize") {
      left = lerp(win.x, dock.x, xE);
      right = lerp(win.x + winW, dock.x, xE);
      destY = lerp(win.y + y, dock.y, yE);
    } else {
      left = lerp(dock.x, win.x, xE);
      right = lerp(dock.x, win.x + winW, xE);
      destY = lerp(dock.y, win.y + y, yE);
    }
    const rowW = right - left;
    if (rowW < 1) continue;

    const srcY = (y / winH) * off.height;
    ctx.drawImage(off, 0, srcY, off.width, 2, left, destY, rowW, 2);
  }

  const glowRaw = dir === "minimize" ? rawT : 1 - rawT;
  if (glowRaw > 0.75) {
    const a = eOut2((glowRaw - 0.75) / 0.25) * 0.35;
    const hex = Math.round(a * 255).toString(16).padStart(2, "0");
    const g = ctx.createRadialGradient(dock.x, dock.y, 0, dock.x, dock.y, 65);
    g.addColorStop(0, "#ffffff" + hex);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

// Global Genie Controller
class GenieController {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.raf = null;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      this.ctx = canvas.getContext("2d");
      if (this.ctx) {
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }
  }

  play({ dir = "open", dock, win, title = "App", duration = 440, onComplete }) {
    if (!this.canvas || !this.ctx) {
      if (onComplete) onComplete();
      return;
    }

    cancelAnimationFrame(this.raf);
    const texture = createWindowTexture(title, win.width, win.height);
    const W = window.innerWidth;
    const H = window.innerHeight;
    let startTime = null;

    const frame = (now) => {
      if (!startTime) startTime = now;
      const rawT = clamp((now - startTime) / duration, 0, 1);

      renderGenieScanline(this.ctx, texture, W, H, rawT, dir, dock, win);

      if (rawT < 1) {
        this.raf = requestAnimationFrame(frame);
      } else {
        this.ctx.clearRect(0, 0, W, H);
        if (onComplete) onComplete();
      }
    };

    this.raf = requestAnimationFrame(frame);
  }
}

export const genieController = new GenieController();

export default function GenieOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      genieController.setCanvas(canvasRef.current);
    };

    genieController.setCanvas(canvasRef.current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999998]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
