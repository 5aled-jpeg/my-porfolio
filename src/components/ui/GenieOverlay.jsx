import React, { useEffect, useRef } from "react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eioC = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eIn2 = (t) => t * t;
const eOut2 = (t) => 1 - (1 - t) * (1 - t);

// ─── Realistic App UI Texture Generators ──────────────────────────────────────

function drawMailApp(ctx, w, h) {
  // Sidebar (Mailboxes)
  const sbW = 140;
  ctx.fillStyle = "#222226";
  ctx.fillRect(0, 38, sbW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(sbW, 38, 1, h - 38);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "600 9px -apple-system, sans-serif";
  ctx.fillText("MAILBOXES", 16, 56);

  const mboxes = [
    { name: "Inbox", count: "12", active: true },
    { name: "VIP", count: "2" },
    { name: "Flagged", count: "4" },
    { name: "Sent", count: "" },
    { name: "Drafts", count: "1" },
    { name: "Archive", count: "" },
    { name: "Trash", count: "" }
  ];

  mboxes.forEach((m, idx) => {
    const y = 74 + idx * 24;
    if (m.active) {
      ctx.fillStyle = "#007aff";
      ctx.beginPath();
      ctx.roundRect(8, y - 14, sbW - 16, 20, [5, 5, 5, 5]);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.75)";
    }
    ctx.font = "500 11px -apple-system, sans-serif";
    ctx.fillText(m.name, 20, y);
    if (m.count) {
      ctx.fillStyle = m.active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)";
      ctx.font = "600 10px -apple-system, sans-serif";
      ctx.fillText(m.count, sbW - 28, y);
    }
  });

  // Message list (middle column)
  const listW = 190;
  const listX = sbW + 1;
  ctx.fillStyle = "#1a1a1d";
  ctx.fillRect(listX, 38, listW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(listX + listW, 38, 1, h - 38);

  // Search input
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.beginPath();
  ctx.roundRect(listX + 10, 48, listW - 20, 22, [6, 6, 6, 6]);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillText("🔍 Search", listX + 20, 63);

  const emails = [
    { from: "Apple Developer", subject: "Your app is ready for review", time: "10:24 AM", active: true },
    { from: "GitHub", subject: "[Khaled/portfolio] Commit pushed", time: "Yesterday" },
    { from: "Stripe", subject: "Monthly payout notification", time: "Oct 22" },
    { from: "Figma Team", subject: "Khaled shared macOS Design System", time: "Oct 20" },
    { from: "Vercel", subject: "Deployment successful: macos-web", time: "Oct 18" },
  ];

  emails.forEach((em, idx) => {
    const y = 85 + idx * 46;
    if (em.active) {
      ctx.fillStyle = "rgba(0, 122, 255, 0.22)";
      ctx.beginPath();
      ctx.roundRect(listX + 6, y - 6, listW - 12, 42, [6, 6, 6, 6]);
      ctx.fill();
    }
    // Unread dot
    if (idx < 2) {
      ctx.fillStyle = "#007aff";
      ctx.beginPath();
      ctx.arc(listX + 14, y + 6, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 11px -apple-system, sans-serif";
    ctx.fillText(em.from, listX + 24, y + 8);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "9px -apple-system, sans-serif";
    ctx.fillText(em.time, listX + listW - 48, y + 8);

    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = "10px -apple-system, sans-serif";
    ctx.fillText(em.subject.slice(0, 24) + "...", listX + 24, y + 24);
  });

  // Reading Pane (right side)
  const paneX = listX + listW + 1;
  const paneW = w - paneX;
  ctx.fillStyle = "#1e1e24";
  ctx.fillRect(paneX, 38, paneW, h - 38);

  // Email Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 15px -apple-system, sans-serif";
  ctx.fillText("Your app is ready for review", paneX + 20, 68);

  // Avatar circle
  ctx.fillStyle = "#007aff";
  ctx.beginPath();
  ctx.arc(paneX + 32, 102, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 12px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("A", paneX + 32, 106);
  ctx.textAlign = "left";

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 11px -apple-system, sans-serif";
  ctx.fillText("Apple Developer Relations", paneX + 54, 98);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillText("To: Khaled <khaled@portfolio.dev>", paneX + 54, 112);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(paneX + 20, 128, paneW - 40, 1);

  // Body text lines
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("Hello Khaled,", paneX + 20, 154);
  ctx.fillText("Your portfolio application has been processed with the authentic Apple", paneX + 20, 174);
  ctx.fillText("macOS Genie Effect and Liquid Glass dock interface.", paneX + 20, 192);
  ctx.fillText("All scanline warp shaders and window controls are performing at 60 FPS.", paneX + 20, 210);

  // Blue action button
  ctx.fillStyle = "#007aff";
  ctx.beginPath();
  ctx.roundRect(paneX + 20, 235, 150, 26, [6, 6, 6, 6]);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 11px -apple-system, sans-serif";
  ctx.fillText("Open Developer Portal", paneX + 34, 252);
}

function drawCalculatorApp(ctx, w, h) {
  ctx.fillStyle = "#1c1c1e";
  ctx.fillRect(0, 38, w, h - 38);

  // Display
  ctx.fillStyle = "#ffffff";
  ctx.font = "300 36px -apple-system, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("0", w - 24, 90);
  ctx.textAlign = "left";

  // Buttons
  const pad = 12;
  const bw = (w - pad * 5) / 4;
  const bh = (h - 110 - pad * 5) / 5;

  const btnRows = [
    [{ l: "AC", c: "#a5a5a5", tc: "#000" }, { l: "±", c: "#a5a5a5", tc: "#000" }, { l: "%", c: "#a5a5a5", tc: "#000" }, { l: "÷", c: "#ff9f0a", tc: "#fff" }],
    [{ l: "7", c: "#333", tc: "#fff" }, { l: "8", c: "#333", tc: "#fff" }, { l: "9", c: "#333", tc: "#fff" }, { l: "×", c: "#ff9f0a", tc: "#fff" }],
    [{ l: "4", c: "#333", tc: "#fff" }, { l: "5", c: "#333", tc: "#fff" }, { l: "6", c: "#333", tc: "#fff" }, { l: "−", c: "#ff9f0a", tc: "#fff" }],
    [{ l: "1", c: "#333", tc: "#fff" }, { l: "2", c: "#333", tc: "#fff" }, { l: "3", c: "#333", tc: "#fff" }, { l: "+", c: "#ff9f0a", tc: "#fff" }],
    [{ l: "0", c: "#333", tc: "#fff", span: 2 }, { l: ".", c: "#333", tc: "#fff" }, { l: "=", c: "#ff9f0a", tc: "#fff" }]
  ];

  btnRows.forEach((row, ri) => {
    let curX = pad;
    const curY = 110 + ri * (bh + pad);
    row.forEach((b) => {
      const curW = b.span === 2 ? bw * 2 + pad : bw;
      ctx.fillStyle = b.c;
      ctx.beginPath();
      ctx.roundRect(curX, curY, curW, bh, [bh / 2, bh / 2, bh / 2, bh / 2]);
      ctx.fill();

      ctx.fillStyle = b.tc;
      ctx.font = "500 15px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(b.l, curX + curW / 2, curY + bh / 2 + 5);
      curX += curW + pad;
    });
  });
  ctx.textAlign = "left";
}

function drawTerminalApp(ctx, w, h) {
  ctx.fillStyle = "#111114";
  ctx.fillRect(0, 38, w, h - 38);

  ctx.font = "11px 'SF Mono', Menlo, Monaco, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillText("Last login: Sat Oct 24 00:36:12 on ttys001", 18, 62);

  ctx.fillStyle = "#34d399";
  ctx.fillText("khaled@MacBook-Pro ~ % ", 18, 86);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("git status", 175, 86);

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText("On branch main", 18, 106);
  ctx.fillText("Your branch is up to date with 'origin/main'.", 18, 122);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillText("nothing to commit, working tree clean", 18, 138);

  ctx.fillStyle = "#34d399";
  ctx.fillText("khaled@MacBook-Pro ~ % ", 18, 168);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("npm run dev", 175, 168);

  ctx.fillStyle = "#38bdf8";
  ctx.fillText("  VITE v7.2.6  ready in 420 ms", 18, 190);
  ctx.fillText("  ➜  Local:   http://localhost:5174/", 18, 208);
  ctx.fillStyle = "#34d399";
  ctx.fillText("  ✓  Mac Genie Effect scanline engine active", 18, 226);

  ctx.fillStyle = "#34d399";
  ctx.fillText("khaled@MacBook-Pro ~ % ", 18, 256);
  // Blinking cursor
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(175, 246, 7, 13);
}

function drawFinderApp(ctx, w, h) {
  // Sidebar
  const sbW = 140;
  ctx.fillStyle = "#222227";
  ctx.fillRect(0, 38, sbW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(sbW, 38, 1, h - 38);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "600 9px -apple-system, sans-serif";
  ctx.fillText("FAVORITES", 16, 56);

  const favs = [
    { name: "AirDrop", icon: "📡" },
    { name: "Applications", icon: "🚀" },
    { name: "Desktop", icon: "🖥️", active: true },
    { name: "Documents", icon: "📄" },
    { name: "Downloads", icon: "📥" },
    { name: "Pictures", icon: "🖼️" }
  ];

  favs.forEach((f, idx) => {
    const y = 74 + idx * 24;
    if (f.active) {
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.beginPath();
      ctx.roundRect(8, y - 14, sbW - 16, 20, [5, 5, 5, 5]);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.fillText(`${f.icon}  ${f.name}`, 18, y);
  });

  // Main area
  const mainX = sbW + 1;
  const mainW = w - mainX;
  ctx.fillStyle = "#1e1e24";
  ctx.fillRect(mainX, 38, mainW, h - 38);

  // Toolbar
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(mainX, 38, mainW, 32);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(mainX, 70, mainW, 1);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "12px -apple-system, sans-serif";
  ctx.fillText("‹   ›   Desktop", mainX + 16, 58);

  // Folder grid
  const folders = ["Documents", "Portfolio Source", "Projects", "Pictures", "Assets", "Downloads"];
  folders.forEach((fn, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const fx = mainX + 24 + col * 90;
    const fy = 90 + row * 90;

    // Blue macOS folder icon
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.roundRect(fx + 6, fy, 48, 36, [4, 4, 4, 4]);
    ctx.fill();
    ctx.fillStyle = "#2980b9";
    ctx.beginPath();
    ctx.roundRect(fx + 6, fy + 4, 22, 10, [3, 3, 0, 0]);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "500 10px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(fn, fx + 30, fy + 54);
    ctx.textAlign = "left";
  });
}

function drawSafariApp(ctx, w, h) {
  ctx.fillStyle = "#1e1e22";
  ctx.fillRect(0, 38, w, h - 38);

  // Address bar
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(w / 2 - 160, 48, 320, 26, [8, 8, 8, 8]);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🔒 apple.com", w / 2, 65);
  ctx.textAlign = "left";

  // Hero Card
  ctx.fillStyle = "#0071e3";
  ctx.beginPath();
  ctx.roundRect(32, 90, w - 64, 85, [12, 12, 12, 12]);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 16px -apple-system, sans-serif";
  ctx.fillText("Welcome to Safari", 50, 126);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("Ultra-fast, private, and seamlessly integrated into macOS.", 50, 146);

  // Favorites
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "600 10px -apple-system, sans-serif";
  ctx.fillText("FAVORITES", 32, 200);

  const favs = [
    { l: "Apple", c: "#000" },
    { l: "Google", c: "#4285f4" },
    { l: "GitHub", c: "#6e40c9" },
    { l: "YouTube", c: "#ff0000" },
    { l: "Twitter", c: "#1da1f2" },
    { l: "Reddit", c: "#ff4500" }
  ];

  favs.forEach((f, idx) => {
    const fx = 32 + idx * 72;
    ctx.fillStyle = f.c;
    ctx.beginPath();
    ctx.roundRect(fx, 214, 46, 46, [10, 10, 10, 10]);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 12px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(f.l[0], fx + 23, 242);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "10px -apple-system, sans-serif";
    ctx.fillText(f.l, fx + 23, 274);
    ctx.textAlign = "left";
  });
}

function drawNotesApp(ctx, w, h) {
  // Sidebar
  const sbW = 120;
  ctx.fillStyle = "#222226";
  ctx.fillRect(0, 38, sbW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(sbW, 38, 1, h - 38);

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("📁 All iCloud", 14, 64);
  ctx.fillText("📝 Notes", 14, 88);
  ctx.fillText("💡 Ideas", 14, 112);

  // Note list
  const listW = 150;
  const listX = sbW + 1;
  ctx.fillStyle = "#1a1a1d";
  ctx.fillRect(listX, 38, listW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(listX + listW, 38, 1, h - 38);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(listX + 6, 44, listW - 12, 48, [6, 6, 6, 6]);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 11px -apple-system, sans-serif";
  ctx.fillText("Portfolio Roadmap", listX + 14, 62);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillText("12:15 AM  Genie Effect active", listX + 14, 78);

  // Editor
  const edX = listX + listW + 1;
  const edW = w - edX;
  ctx.fillStyle = "#1e1e24";
  ctx.fillRect(edX, 38, edW, h - 38);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 16px -apple-system, sans-serif";
  ctx.fillText("Portfolio Roadmap", edX + 24, 70);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillText("October 24, 2026 at 12:15 AM", edX + 24, 88);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("• Authentic Apple macOS scanline genie effect", edX + 24, 120);
  ctx.fillText("• Magnified Apple liquid glass dock with cosine curve", edX + 24, 140);
  ctx.fillText("• Zero-delay window launching and smooth transitions", edX + 24, 160);
  ctx.fillText("• Real interactive Calculator & Terminal integration", edX + 24, 180);
}

function drawMusicApp(ctx, w, h) {
  // Sidebar
  const sbW = 130;
  ctx.fillStyle = "#222226";
  ctx.fillRect(0, 38, sbW, h - 38);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "600 9px -apple-system, sans-serif";
  ctx.fillText("APPLE MUSIC", 14, 56);

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("🎧 Listen Now", 14, 78);
  ctx.fillText("📻 Radio", 14, 102);
  ctx.fillText("🎵 Recently Added", 14, 126);

  // Player area
  const pX = sbW + 1;
  const pW = w - pX;
  ctx.fillStyle = "#1e1e22";
  ctx.fillRect(pX, 38, pW, h - 38);

  // Album Artwork
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.roundRect(pX + 24, 60, 110, 110, [8, 8, 8, 8]);
  ctx.fill();
  ctx.fillStyle = "#fa2d48";
  ctx.beginPath();
  ctx.arc(pX + 79, 115, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 16px -apple-system, sans-serif";
  ctx.fillText("Wanna Be Yours", pX + 150, 94);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "12px -apple-system, sans-serif";
  ctx.fillText("Arctic Monkeys — AM (2013)", pX + 150, 114);

  // Scrubber
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.beginPath();
  ctx.roundRect(pX + 150, 134, pW - 180, 4, [2, 2, 2, 2]);
  ctx.fill();
  ctx.fillStyle = "#fa2d48";
  ctx.beginPath();
  ctx.roundRect(pX + 150, 134, (pW - 180) * 0.45, 4, [2, 2, 2, 2]);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillText("1:34", pX + 150, 152);
  ctx.textAlign = "right";
  ctx.fillText("3:04", pX + pW - 30, 152);
  ctx.textAlign = "left";

  // Controls
  ctx.fillStyle = "#fa2d48";
  ctx.beginPath();
  ctx.arc(pX + pW / 2, 205, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("▶", pX + pW / 2 + 1, 210);
  ctx.textAlign = "left";
}

function drawPhotosApp(ctx, w, h) {
  ctx.fillStyle = "#1c1c1f";
  ctx.fillRect(0, 38, w, h - 38);

  // Top selector
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(w / 2 - 120, 48, 240, 24, [6, 6, 6, 6]);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "10px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Years    Months    Days    All Photos", w / 2, 63);
  ctx.textAlign = "left";

  // Photo grid
  const cols = 4;
  const pad = 12;
  const pw = (w - pad * (cols + 1)) / cols;
  const ph = 70;

  const photoGradients = [
    ["#ff7e5f", "#feb47b"],
    ["#6a11cb", "#2575fc"],
    ["#37ecba", "#72afd3"],
    ["#f12711", "#f5af19"],
    ["#00c6ff", "#0072ff"],
    ["#f857a6", "#ff5858"],
    ["#43e97b", "#38f9d7"],
    ["#fa709a", "#fee140"],
  ];

  photoGradients.forEach((gradColors, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const px = pad + col * (pw + pad);
    const py = 86 + row * (ph + pad);

    const grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
    grad.addColorStop(0, gradColors[0]);
    grad.addColorStop(1, gradColors[1]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, [6, 6, 6, 6]);
    ctx.fill();
  });
}

function drawCalendarApp(ctx, w, h) {
  // Sidebar
  const sbW = 130;
  ctx.fillStyle = "#222226";
  ctx.fillRect(0, 38, sbW, h - 38);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 13px -apple-system, sans-serif";
  ctx.fillText("October 2026", 16, 64);

  // Month grid
  const gX = sbW + 1;
  const gW = w - gX;
  ctx.fillStyle = "#1e1e24";
  ctx.fillRect(gX, 38, gW, h - 38);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dw = gW / 7;
  days.forEach((d, i) => {
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "600 10px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d, gX + i * dw + dw / 2, 58);
  });
  ctx.textAlign = "left";

  // Grid lines & dates
  for (let r = 0; r < 5; r++) {
    const ry = 70 + r * 44;
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(gX, ry, gW, 1);

    for (let c = 0; c < 7; c++) {
      const dateNum = r * 7 + c - 2;
      if (dateNum > 0 && dateNum <= 31) {
        ctx.fillStyle = dateNum === 24 ? "#007aff" : "rgba(255,255,255,0.7)";
        ctx.font = dateNum === 24 ? "700 11px -apple-system, sans-serif" : "10px -apple-system, sans-serif";
        ctx.fillText(String(dateNum), gX + c * dw + 8, ry + 16);

        if (dateNum === 24) {
          ctx.fillStyle = "#007aff";
          ctx.beginPath();
          ctx.roundRect(gX + c * dw + 6, ry + 22, dw - 12, 14, [3, 3, 3, 3]);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "600 8px -apple-system, sans-serif";
          ctx.fillText("Release v2", gX + c * dw + 9, ry + 32);
        }
      }
    }
  }
}

function drawSettingsApp(ctx, w, h) {
  // Sidebar
  const sbW = 160;
  ctx.fillStyle = "#222226";
  ctx.fillRect(0, 38, sbW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(sbW, 38, 1, h - 38);

  // User Profile badge at top of sidebar
  ctx.fillStyle = "#007aff";
  ctx.beginPath();
  ctx.arc(36, 68, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 13px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("K", 36, 73);
  ctx.textAlign = "left";

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 12px -apple-system, sans-serif";
  ctx.fillText("Khaled", 60, 66);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "10px -apple-system, sans-serif";
  ctx.fillText("Apple Account", 60, 78);

  // Settings list
  const items = [
    { name: "Wi-Fi", icon: "📶", active: true },
    { name: "Bluetooth", icon: "ᛒ" },
    { name: "Network", icon: "🌐" },
    { name: "Notifications", icon: "🔔" },
    { name: "Sound", icon: "🔊" },
    { name: "General", icon: "⚙️" },
    { name: "Appearance", icon: "🌓" },
    { name: "Displays", icon: "🖥️" },
    { name: "Wallpaper", icon: "🖼️" },
  ];

  items.forEach((item, idx) => {
    const y = 110 + idx * 28;
    if (item.active) {
      ctx.fillStyle = "#007aff";
      ctx.beginPath();
      ctx.roundRect(10, y - 16, sbW - 20, 24, [6, 6, 6, 6]);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
    }
    ctx.font = "11px -apple-system, sans-serif";
    ctx.fillText(`${item.icon}  ${item.name}`, 20, y);
  });

  // Main settings panel
  const pX = sbW + 1;
  const pW = w - pX;
  ctx.fillStyle = "#1e1e24";
  ctx.fillRect(pX, 38, pW, h - 38);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 16px -apple-system, sans-serif";
  ctx.fillText("Wi-Fi", pX + 28, 70);

  // Toggle switch card
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.roundRect(pX + 28, 90, pW - 56, 44, [8, 8, 8, 8]);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "500 12px -apple-system, sans-serif";
  ctx.fillText("Wi-Fi", pX + 44, 116);

  // iOS/macOS toggle switch (green on)
  ctx.fillStyle = "#34c759";
  ctx.beginPath();
  ctx.roundRect(pX + pW - 100, 102, 38, 20, [10, 10, 10, 10]);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(pX + pW - 72, 112, 8, 0, Math.PI * 2);
  ctx.fill();

  // Known networks list
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "600 10px -apple-system, sans-serif";
  ctx.fillText("KNOWN NETWORKS", pX + 28, 160);

  const nets = [
    { name: "Khaled-Fiber-5G", connected: true },
    { name: "MacBook-Hotspot", connected: false },
    { name: "Office-Network-Secure", connected: false },
  ];

  nets.forEach((net, i) => {
    const ny = 175 + i * 40;
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.beginPath();
    ctx.roundRect(pX + 28, ny, pW - 56, 34, [6, 6, 6, 6]);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.fillText(`📶  ${net.name}`, pX + 44, ny + 21);

    if (net.connected) {
      ctx.fillStyle = "#34c759";
      ctx.font = "600 10px -apple-system, sans-serif";
      ctx.fillText("Connected ✓", pX + pW - 120, ny + 21);
    }
  });
}

function drawTrashApp(ctx, w, h) {
  // Sidebar
  const sbW = 140;
  ctx.fillStyle = "#222227";
  ctx.fillRect(0, 38, sbW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(sbW, 38, 1, h - 38);

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "600 9px -apple-system, sans-serif";
  ctx.fillText("LOCATIONS", 16, 56);

  ctx.fillStyle = "#ffffff";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("🗑️  Trash", 18, 78);

  // Main area
  const mainX = sbW + 1;
  const mainW = w - mainX;
  ctx.fillStyle = "#1e1e24";
  ctx.fillRect(mainX, 38, mainW, h - 38);

  // Top banner
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(mainX, 38, mainW, 36);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(mainX, 74, mainW, 1);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "500 11px -apple-system, sans-serif";
  ctx.fillText("Trash", mainX + 20, 60);

  // Empty Trash button
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.roundRect(mainX + mainW - 110, 44, 90, 24, [5, 5, 5, 5]);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "500 10px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Empty Trash", mainX + mainW - 65, 59);
  ctx.textAlign = "left";

  // Content state
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🗑️", mainX + mainW / 2, h / 2 - 10);
  ctx.font = "500 13px -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("Trash is Empty", mainX + mainW / 2, h / 2 + 25);
  ctx.textAlign = "left";
}

function drawMapsApp(ctx, w, h) {
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 38, w, h - 38);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.4);
  ctx.lineTo(w, h * 0.45);
  ctx.moveTo(w * 0.35, 38);
  ctx.lineTo(w * 0.45, h);
  ctx.stroke();

  ctx.fillStyle = "rgba(30, 30, 35, 0.9)";
  ctx.beginPath();
  ctx.roundRect(16, 52, 240, 36, [8, 8, 8, 8]);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "500 11px -apple-system, sans-serif";
  ctx.fillText("📍 Akid Lotfi Mediterranean Garden", 30, 74);

  ctx.fillStyle = "#ff3b30";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawPhoneApp(ctx, w, h) {
  ctx.fillStyle = "#1c1c1e";
  ctx.fillRect(0, 38, w, h - 38);
  const r = 24;
  const startX = w / 2 - 80;
  const startY = 90;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const cx = startX + col * 75;
      const cy = startY + row * 64;
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawContactsApp(ctx, w, h) {
  const sbW = 160;
  ctx.fillStyle = "#222226";
  ctx.fillRect(0, 38, sbW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "600 9px -apple-system, sans-serif";
  ctx.fillText("ALL CONTACTS", 16, 56);

  const pX = sbW + 1;
  const pW = w - pX;
  ctx.fillStyle = "#1e1e24";
  ctx.fillRect(pX, 38, pW, h - 38);
  ctx.fillStyle = "#007aff";
  ctx.beginPath();
  ctx.arc(pX + 50, 100, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 16px -apple-system, sans-serif";
  ctx.fillText("Khaled", pX + 86, 104);
}

function drawMessagesApp(ctx, w, h) {
  const sbW = Math.min(220, w * 0.35);
  ctx.fillStyle = "#1e1e22";
  ctx.fillRect(0, 38, sbW, h - 38);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(sbW, 38, 1, h - 38);

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.beginPath();
  ctx.roundRect(12, 48, sbW - 24, 24, [6, 6, 6, 6]);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillText("Search", 24, 64);

  const convs = [
    { name: "Orkun", text: "That sounds awesome!", time: "11:42 AM", active: true },
    { name: "Design Team", text: "Khaled: Updated the 3D model", time: "10:15 AM" },
    { name: "Sarah", text: "Are we meeting tomorrow?", time: "Yesterday" },
  ];

  convs.forEach((c, idx) => {
    const y = 86 + idx * 56;
    if (c.active) {
      ctx.fillStyle = "#007aff";
      ctx.beginPath();
      ctx.roundRect(8, y - 6, sbW - 16, 50, [8, 8, 8, 8]);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
    }
    ctx.beginPath();
    ctx.arc(28, y + 18, 14, 0, Math.PI * 2);
    ctx.fillStyle = c.active ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 11px -apple-system, sans-serif";
    ctx.fillText(c.name[0], 24, y + 22);

    ctx.font = "600 12px -apple-system, sans-serif";
    ctx.fillText(c.name, 48, y + 14);
    ctx.fillStyle = c.active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.fillText(c.text, 48, y + 30);
  });

  const pX = sbW + 1;
  const pW = w - pX;
  ctx.fillStyle = "#161618";
  ctx.fillRect(pX, 38, pW, h - 38);

  ctx.fillStyle = "#007aff";
  ctx.beginPath();
  ctx.roundRect(pX + pW - 180, 110, 160, 36, [16, 16, 4, 16]);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px -apple-system, sans-serif";
  ctx.fillText("Hey, how is the macOS build?", pX + pW - 170, 132);

  ctx.fillStyle = "#2c2c2e";
  ctx.beginPath();
  ctx.roundRect(pX + 20, 160, 190, 48, [16, 16, 16, 4]);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Looking incredible! The genie", pX + 32, 180);
  ctx.fillText("animations are so silky.", pX + 32, 196);
}

// ─── Master Window Texture Creator ────────────────────────────────────────────

export function createWindowTexture(appId, title, width = 640, height = 480) {
  const c = document.createElement("canvas");
  // 2x Retina super-sampled texture for pin-sharp macOS graphics
  const scaleFactor = 2;
  c.width = Math.round(width * scaleFactor);
  c.height = Math.round(height * scaleFactor);
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  ctx.scale(scaleFactor, scaleFactor);

  // Base window chassis
  ctx.fillStyle = "#1e1e24";
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, [12, 12, 12, 12]);
  ctx.fill();

  // Title bar
  const grad = ctx.createLinearGradient(0, 0, 0, 38);
  grad.addColorStop(0, "rgba(255,255,255,0.12)");
  grad.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, 38, [12, 12, 0, 0]);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 37, width, 1);

  // Traffic lights
  ctx.fillStyle = "#ff5f57";
  ctx.beginPath(); ctx.arc(18, 19, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#febc2e";
  ctx.beginPath(); ctx.arc(36, 19, 5.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#28c840";
  ctx.beginPath(); ctx.arc(54, 19, 5.5, 0, Math.PI * 2); ctx.fill();

  // Window title
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title || "Window", width / 2, 23);
  ctx.textAlign = "left";

  // Dispatch dedicated real app renderer based on appId / title
  const id = `${appId || ""} ${title || ""}`.toLowerCase();
  if (id.includes("mess")) {
    drawMessagesApp(ctx, width, height);
  } else if (id.includes("mail")) {
    drawMailApp(ctx, width, height);
  } else if (id.includes("calc")) {
    drawCalculatorApp(ctx, width, height);
  } else if (id.includes("term")) {
    drawTerminalApp(ctx, width, height);
  } else if (id.includes("safari")) {
    drawSafariApp(ctx, width, height);
  } else if (id.includes("note") || id.includes("blog")) {
    drawNotesApp(ctx, width, height);
  } else if (id.includes("music") || id.includes("spot")) {
    drawMusicApp(ctx, width, height);
  } else if (id.includes("photo") || id.includes("gall")) {
    drawPhotosApp(ctx, width, height);
  } else if (id.includes("cal")) {
    drawCalendarApp(ctx, width, height);
  } else if (id.includes("sett")) {
    drawSettingsApp(ctx, width, height);
  } else if (id.includes("trash")) {
    drawTrashApp(ctx, width, height);
  } else if (id.includes("map")) {
    drawMapsApp(ctx, width, height);
  } else if (id.includes("phone") || id.includes("face")) {
    drawPhoneApp(ctx, width, height);
  } else if (id.includes("contact")) {
    drawContactsApp(ctx, width, height);
  } else {
    drawFinderApp(ctx, width, height);
  }

  return c;
}

// ─── Scanline Warp Renderer ───────────────────────────────────────────────────

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

  const scaleY = off.height / winH;
  const sliceSrcH = Math.max(1, 2 * scaleY);

  // Pure reversible macOS genie scanline equation:
  // At rawT = 0, open is at dock (0), minimize is at full window (1).
  // At rawT = 1, open is at full window (1), minimize is at dock (0).
  const t = dir === "minimize" ? 1 - rawT : rawT;

  for (let y = 0; y < winH; y += 2) {
    const r = y / winH;
    // Row x & y progression
    const rowXStart = r * 0.65;
    const xP = clamp((t - rowXStart) / (1 - rowXStart), 0, 1);
    const xE = eioC(xP);

    const rowYStart = r * 0.2;
    const yP = clamp((t - rowYStart) / (1 - rowYStart), 0, 1);
    const yE = eIn2(yP);

    const left = lerp(dock.x, win.x, xE);
    const right = lerp(dock.x, win.x + winW, xE);
    const destY = lerp(dock.y, win.y + y, yE);

    const rowW = right - left;
    if (rowW < 1) continue;

    const srcY = y * scaleY;
    const safeSrcH = Math.min(sliceSrcH, Math.max(1, off.height - srcY));
    ctx.drawImage(off, 0, srcY, off.width, safeSrcH, left, destY, rowW, 2);
  }

  const glowRaw = dir === "minimize" ? rawT : 1 - rawT;
  if (glowRaw > 0.72) {
    const a = eOut2((glowRaw - 0.72) / 0.28) * 0.4;
    const hex = Math.round(a * 255).toString(16).padStart(2, "0");
    const g = ctx.createRadialGradient(dock.x, dock.y, 0, dock.x, dock.y, 65);
    g.addColorStop(0, "#ffffff" + hex);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

// ─── Global Genie Controller, Snapshot & Bounds Registries ──────────────────────

export const realAppSnapshots = {};
export const windowBoundsRegistry = {};

export function setAppSnapshot(appId, canvas) {
  if (appId && canvas) {
    realAppSnapshots[appId.toLowerCase()] = canvas;
  }
}

export function getAppSnapshot(appId) {
  return appId ? realAppSnapshots[appId.toLowerCase()] : null;
}

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

  play({ dir = "open", dock, win, appId, title = "App", duration = 430, texture, onComplete }) {
    if (!this.canvas || !this.ctx) {
      if (onComplete) onComplete();
      return;
    }

    cancelAnimationFrame(this.raf);
    // 1. Prefer live/captured DOM texture
    // 2. Fall back to pre-rendered real React DOM snapshot
    // 3. Fall back to crisp window texture creator
    const offTexture =
      texture ||
      getAppSnapshot(appId) ||
      createWindowTexture(appId, title, win.width, win.height);

    const W = window.innerWidth;
    const H = window.innerHeight;
    let startTime = null;

    const frame = (now) => {
      if (!startTime) startTime = now;
      const rawT = clamp((now - startTime) / duration, 0, 1);

      renderGenieScanline(this.ctx, offTexture, W, H, rawT, dir, dock, win);

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
