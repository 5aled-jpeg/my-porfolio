"use client";

import React, { useId } from "react";
import "./side-folder.css";

/*
 * Side Folder – a glassy folder turned on its side, in a single self-contained file.
 * Three documents peek out to the right from behind a frosted front pocket with a tab on its edge.
 * Hover the folder: the pocket swings forward and every document slides out on its own.
 * The artwork scales with its container and keeps a 3 : 2 frame.
 */

/* Front pocket on a 380 × 520 grid: a narrow top part and a wider tab towards the bottom */
const FRONT =
  "M40 0H290Q330 0 330 40V318Q330 338 344 348L364 362Q380 372 380 396V480Q380 520 340 520H40Q0 520 0 480V40Q0 0 40 0Z";
const LINES = [78, 180, 140, 175, 126, 168, 110];

/* A mask (unlike clip-path: url()) also cuts the frosted blur to the pocket shape, and scales with the box */
const MASK_SVG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 380 520' preserveAspectRatio='none'><path d='${FRONT}'/></svg>`
)}`;

export function SideFolder({
  className = "",
  label = "Blue folder on its side, with three documents peeking out behind a frosted front pocket",
}) {
  const reactId = useId();
  const id = "ui-sf-" + reactId.replace(/[^a-zA-Z0-9_-]/g, "");

  const maskStyle = {
    maskImage: `url("${MASK_SVG}")`,
    WebkitMaskImage: `url("${MASK_SVG}")`,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };

  return (
    <div
      className={["ui-sf", className].filter(Boolean).join(" ")}
      role="img"
      aria-label={label}
    >
      <div className="ui-sf-icon" aria-hidden="true">
        {/* Back of the folder */}
        <svg className="ui-sf-layer ui-sf-back" viewBox="0 0 440 520">
          <defs>
            <filter id={`${id}-hl`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feOffset in="blur" dy="3" result="offset" />
              <feComposite in="blur" in2="offset" operator="arithmetic" k2="1" k3="-1" result="diff" />
              <feFlood floodColor="#fff" floodOpacity="0.65" />
              <feComposite in2="diff" operator="in" result="light" />
              <feComposite in="light" in2="SourceAlpha" operator="in" />
            </filter>
          </defs>
          <rect x="0" y="18" width="440" height="486" rx="36" fill="#5bb7ea" />
          <rect x="0" y="18" width="440" height="486" rx="36" fill="#000" filter={`url(#${id}-hl)`} />
        </svg>

        {/* Documents – each one slides out on its own */}
        <svg className="ui-sf-layer" viewBox="0 0 440 520">
          <defs>
            <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#eaf2f8" />
            </linearGradient>
            <symbol id={`${id}-doc`} overflow="visible">
              <rect
                x="0.6"
                y="0.6"
                width="278.8"
                height="348.8"
                rx="19.4"
                fill={`url(#${id}-paper)`}
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1.2"
              />
              {LINES.map((w, i) => (
                <rect
                  key={i}
                  x="30"
                  y={87 + i * 28}
                  width={w}
                  height="9"
                  rx="4.5"
                  fill="rgba(0,0,0,0.12)"
                />
              ))}
            </symbol>
          </defs>
          <g transform="scale(1.15)">
            <use className="ui-sf-doc ui-sf-doc--top" href={`#${id}-doc`} />
            <use className="ui-sf-doc ui-sf-doc--bottom" href={`#${id}-doc`} />
            <use className="ui-sf-doc ui-sf-doc--middle" href={`#${id}-doc`} />
          </g>
        </svg>

        {/* Frosted front pocket */}
        <div className="ui-sf-front" style={maskStyle}>
          <svg viewBox="0 0 380 520">
            <path d={FRONT} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SideFolder;
