import React, { useState, useRef, useEffect } from "react";

export default function Terminal() {
  const [history, setHistory] = useState([
    { text: "Last login: Sat Oct 24 00:36:12 on console", type: "system" },
    { text: "Type 'help' to see available commands.", type: "info" }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const trimmed = input.trim();
      const newHistory = [...history, { text: `khaled@MacBook-Pro ~ % ${input}`, type: "command" }];

      const cmd = trimmed.toLowerCase();
      if (cmd === "clear") {
        setHistory([]);
        setInput("");
        return;
      } else if (cmd === "help") {
        newHistory.push({
          text: `Available commands:
  about       - Overview of Khaled's portfolio
  skills      - Technical skills and stack
  projects    - Highlighted works & achievements
  contact     - How to get in touch
  clear       - Clear the terminal screen
  whoami      - Current user identity
  date        - Current system timestamp`,
          type: "output",
        });
      } else if (cmd === "about") {
        newHistory.push({
          text: "Khaled · Full-Stack & Creative Developer from Algeria. Crafting ultra-luxe interfaces and performant web experiences.",
          type: "output",
        });
      } else if (cmd === "skills") {
        newHistory.push({
          text: "React, Next.js, TypeScript, Tailwind CSS, GSAP, Framer Motion, Node.js, WebGL & Shader Arts.",
          type: "output",
        });
      } else if (cmd === "whoami") {
        newHistory.push({ text: "khaled (admin)", type: "output" });
      } else if (cmd === "date") {
        newHistory.push({ text: new Date().toString(), type: "output" });
      } else if (cmd === "projects") {
        newHistory.push({
          text: `1. macOS Web Simulator (Current)
2. Luxury Supercar Automotive Experience
3. Cinema Streaming 3D Experience
4. High-Frequency Portfolio Engine`,
          type: "output",
        });
      } else if (cmd === "contact") {
        newHistory.push({ text: "Email: khaled@portfolio.dev · Location: Algeria", type: "output" });
      } else if (trimmed.length > 0) {
        newHistory.push({ text: `zsh: command not found: ${trimmed}. Type 'help' for commands.`, type: "error" });
      }

      setHistory(newHistory);
      setInput("");
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full h-full bg-[#18181b]/95 text-white p-3 font-mono text-[13px] overflow-y-auto select-text flex flex-col"
      style={{ fontFamily: "'SF Mono', Monaco, Menlo, 'Courier New', monospace" }}
    >
      <div className="flex-1 space-y-1">
        {history.map((h, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap leading-relaxed ${
              h.type === "command"
                ? "text-emerald-400 font-medium"
                : h.type === "error"
                ? "text-rose-400"
                : h.type === "system"
                ? "text-white/40"
                : "text-white/80"
            }`}
          >
            {h.text}
          </div>
        ))}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-emerald-400 font-semibold">khaled@MacBook-Pro ~ %</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-[13px] caret-white"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
