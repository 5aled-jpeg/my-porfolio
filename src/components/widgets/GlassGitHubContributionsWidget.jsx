"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  formatISO,
  getDay,
  getMonth,
  getYear,
  nextDay,
  parseISO,
  subWeeks,
} from "date-fns";
import { GlassSurface } from "../ui/glass-surface";
import { useAppStore } from "../../store/Appstore";

const GITHUB_USERNAME = "5aled-jpeg";
const GITHUB_PROFILE_URL = "https://github.com/5aled-jpeg";
const GITHUB_API_URL = "https://github-contributions-api.jogruber.de/v4";
const CACHE_KEY = `os_github_contributions_${GITHUB_USERNAME}`;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const DEFAULT_MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Pure Black & White / Monochromatic grayscale theme matching the reference
const LEVEL_COLORS = {
  0: "fill-[#181a1f] dark:fill-[#181a1f]",
  1: "fill-[#3a3d45]",
  2: "fill-[#656b77]",
  3: "fill-[#a8b0bd]",
  4: "fill-[#ffffff]",
};

const fillHoles = (activities) => {
  if (!activities || activities.length === 0) return [];

  const sortedActivities = [...activities].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const calendar = new Map(sortedActivities.map((a) => [a.date, a]));
  const firstActivity = sortedActivities[0];
  const lastActivity = sortedActivities[sortedActivities.length - 1];

  if (!firstActivity || !lastActivity) return [];

  return eachDayOfInterval({
    start: parseISO(firstActivity.date),
    end: parseISO(lastActivity.date),
  }).map((day) => {
    const date = formatISO(day, { representation: "date" });
    if (calendar.has(date)) {
      return calendar.get(date);
    }
    return { date, count: 0, level: 0 };
  });
};

const groupByWeeks = (activities, weekStart = 0) => {
  if (!activities || activities.length === 0) return [];

  const normalizedActivities = fillHoles(activities);
  const firstActivity = normalizedActivities[0];
  if (!firstActivity) return [];

  const firstDate = parseISO(firstActivity.date);
  const firstCalendarDate =
    getDay(firstDate) === weekStart
      ? firstDate
      : subWeeks(nextDay(firstDate, weekStart), 1);

  const paddingDays = differenceInCalendarDays(firstDate, firstCalendarDate);
  const paddedActivities = [
    ...new Array(Math.max(0, paddingDays)).fill(undefined),
    ...normalizedActivities,
  ];

  const numberOfWeeks = Math.ceil(paddedActivities.length / 7);
  return new Array(numberOfWeeks).fill(undefined).map((_, weekIndex) =>
    paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7)
  );
};

const getMonthLabels = (weeks, monthNames = DEFAULT_MONTH_LABELS) => {
  return weeks
    .reduce((labels, week, weekIndex) => {
      const firstActivity = week.find((activity) => activity !== undefined);
      if (!firstActivity) return labels;

      const month = monthNames[getMonth(parseISO(firstActivity.date))];
      if (!month) return labels;

      const prevLabel = labels[labels.length - 1];
      if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
        return labels.concat({ weekIndex, label: month });
      }
      return labels;
    }, [])
    .filter(({ weekIndex }, index, labels) => {
      const minWeeks = 3;
      if (index === 0) {
        return labels[1] && labels[1].weekIndex - weekIndex >= minWeeks;
      }
      if (index === labels.length - 1) {
        return weeks.slice(weekIndex).length >= minWeeks;
      }
      return true;
    });
};

export default function GlassGitHubContributionsWidget({
  username = GITHUB_USERNAME,
  profileUrl = GITHUB_PROFILE_URL,
}) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const [activities, setActivities] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.data && Array.isArray(parsed.data)) {
          return parsed.data;
        }
      }
    } catch {}
    return [];
  });
  const [totalCount, setTotalCount] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (typeof parsed.total === "number") return parsed.total;
      }
    } catch {}
    return 65;
  });
  const [isLoading, setIsLoading] = useState(!activities.length);
  const [tooltip, setTooltip] = useState(null);
  const graphContainerRef = useRef(null);

  // Fetch GitHub contributions
  useEffect(() => {
    let isMounted = true;

    async function loadContributions() {
      // Check cache validity
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const age = Date.now() - (parsed.timestamp || 0);
          if (age < CACHE_TTL_MS && parsed.data?.length) {
            setActivities(parsed.data);
            if (parsed.total) setTotalCount(parsed.total);
            setIsLoading(false);
            return;
          }
        }
      } catch {}

      try {
        setIsLoading(true);
        const res = await fetch(`${GITHUB_API_URL}/${username}?y=last`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const contribs = data.contributions || [];
        const total =
          typeof data.total === "number"
            ? data.total
            : data.total?.lastYear ||
              contribs.reduce((sum, a) => sum + (a.count || 0), 0);

        if (isMounted) {
          setActivities(contribs);
          setTotalCount(total);
          setIsLoading(false);
        }

        // Cache result
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              data: contribs,
              total,
              timestamp: Date.now(),
            })
          );
        } catch {}
      } catch (err) {
        console.warn("Could not fetch live GitHub contributions:", err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadContributions();
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Dimensions
  const blockSize = 10;
  const blockMargin = 2.8;
  const blockRadius = 2.5;
  const labelHeight = 20;
  const weekStart = 0;

  const weeks = useMemo(
    () => groupByWeeks(activities, weekStart),
    [activities, weekStart]
  );

  const monthLabels = useMemo(
    () => getMonthLabels(weeks, DEFAULT_MONTH_LABELS),
    [weeks]
  );

  const graphWidth = Math.max(
    520,
    weeks.length * (blockSize + blockMargin) - blockMargin
  );
  const graphHeight = labelHeight + (blockSize + blockMargin) * 7 - blockMargin;

  return (
    <div
      className={`relative w-[590px] max-w-[95vw] min-h-[225px] p-5 text-white select-none shrink-0 pointer-events-auto overflow-hidden transition-all duration-300 rounded-3xl border shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.15)] flex flex-col justify-between ${
        isDarkMode
          ? "bg-[#0c0d10]/85 border-white/10"
          : "bg-[#0c0d10]/75 border-white/15"
      }`}
    >
      <GlassSurface
        tint={0}
        radius={24}
        blur={12}
        chroma={0.2}
        className="absolute inset-0 -z-10"
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white/10 shrink-0">
            <img
              src="https://avatars.githubusercontent.com/u/127567703?v=4"
              alt={username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                className="w-4 h-4 fill-white"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-white tracking-tight flex items-center gap-1.5">
              {username}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
            </span>
            <span className="text-[10.5px] text-white/50 font-medium">
              GitHub Contributions
            </span>
          </div>
        </div>

        {/* Total stats & profile link */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-[11px] font-medium text-white/90">
            <span className="text-white font-semibold">
              {totalCount.toLocaleString()}
            </span>{" "}
            in last year
          </div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all text-xs"
            title="Open GitHub Profile"
          >
            ↗
          </a>
        </div>
      </div>

      {/* Main Contribution Calendar (Unscrollable, 100% responsive width) */}
      <div
        ref={graphContainerRef}
        className="relative z-10 my-2.5 w-full flex items-center justify-center select-none"
        onMouseLeave={() => setTooltip(null)}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-[96px] gap-2 text-white/50 text-xs">
            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span>Loading contributions...</span>
          </div>
        ) : (
          <svg
            className="w-full h-auto block overflow-visible select-none"
            height={graphHeight}
            viewBox={`0 0 ${graphWidth} ${graphHeight}`}
            width={graphWidth}
          >
            {/* Month labels */}
            <g className="fill-white/60 text-[9.5px] font-sans font-medium select-none">
              {monthLabels.map(({ label, weekIndex }) => (
                <text
                  key={weekIndex}
                  x={(blockSize + blockMargin) * weekIndex}
                  y={10}
                  dominantBaseline="hanging"
                >
                  {label}
                </text>
              ))}
            </g>

            {/* Weeks and Days Blocks in Monochromatic Theme */}
            {weeks.map((week, weekIndex) =>
              week.map((activity, dayIndex) => {
                if (!activity) return null;
                const level = Math.min(4, Math.max(0, activity.level || 0));
                const colorClass = LEVEL_COLORS[level] || LEVEL_COLORS[0];
                const x = (blockSize + blockMargin) * weekIndex;
                const y = labelHeight + (blockSize + blockMargin) * dayIndex;

                return (
                  <rect
                    key={`${weekIndex}-${dayIndex}`}
                    className={`${colorClass} transition-all duration-100 cursor-pointer hover:stroke-white hover:stroke-[1.5px] hover:scale-125 origin-center`}
                    data-date={activity.date}
                    data-count={activity.count}
                    data-level={level}
                    height={blockSize}
                    width={blockSize}
                    rx={blockRadius}
                    ry={blockRadius}
                    x={x}
                    y={y}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parent = graphContainerRef.current?.getBoundingClientRect();
                      if (parent) {
                        setTooltip({
                          x: rect.left - parent.left + rect.width / 2,
                          y: rect.top - parent.top - 8,
                          activity,
                        });
                      }
                    }}
                  />
                );
              })
            )}
          </svg>
        )}

        {/* Floating Tooltip */}
        {tooltip && tooltip.activity && (
          <div
            className="absolute pointer-events-none z-50 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-[#141518]/95 border border-white/20 text-[11px] text-white shadow-2xl whitespace-nowrap backdrop-blur-md"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
          >
            <span className="font-semibold text-white">
              {tooltip.activity.count}{" "}
              {tooltip.activity.count === 1 ? "contribution" : "contributions"}
            </span>{" "}
            on{" "}
            <span className="text-white/60">
              {format(parseISO(tooltip.activity.date), "MMM d, yyyy")}
            </span>
          </div>
        )}
      </div>

      {/* Footer & Legend (Matching Image 2 Reference) */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/8 font-medium">
        <div>
          <span>{totalCount.toLocaleString()} contributions in {new Date().getFullYear()} on </span>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-white/90 underline hover:text-white transition-colors"
          >
            GitHub
          </a>
          <span>.</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-white/50">
          <span className="text-[10px] mr-0.5">Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <svg key={lvl} width={9} height={9} className="overflow-hidden">
              <rect
                width={9}
                height={9}
                rx={2}
                className={LEVEL_COLORS[lvl]}
              />
            </svg>
          ))}
          <span className="text-[10px] ml-0.5">More</span>
        </div>
      </div>
    </div>
  );
}
