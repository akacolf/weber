"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Terminal as TerminalIcon,
  GitBranch,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface Token {
  text: string;
  className?: string;
  pause?: number;
}

const TOKENS: Token[] = [
  // Line 01
  { text: "// Self-documenting developer specification\n", className: "text-neutral-500 italic", pause: 240 },

  // Line 02
  { text: "interface", className: "text-purple-400" },
  { text: " " },
  { text: "theGuyWhoNeverStopsCoding", className: "text-amber-300" },
  { text: " {\n", className: "text-neutral-400", pause: 140 },

  // Line 03
  { text: "  ", className: "text-neutral-400" },
  { text: "name", className: "text-sky-300" },
  { text: ": ", className: "text-neutral-400" },
  { text: "string", className: "text-emerald-300" },
  { text: ";\n", className: "text-neutral-400", pause: 100 },

  // Line 04
  { text: "  ", className: "text-neutral-400" },
  { text: "role", className: "text-sky-300" },
  { text: ": ", className: "text-neutral-400" },
  { text: "string", className: "text-emerald-300" },
  { text: ";\n", className: "text-neutral-400", pause: 100 },

  // Line 05
  { text: "  ", className: "text-neutral-400" },
  { text: "focus", className: "text-sky-300" },
  { text: ": ", className: "text-neutral-400" },
  { text: "string[]", className: "text-emerald-300" },
  { text: ";\n", className: "text-neutral-400", pause: 100 },

  // Line 06
  { text: "  ", className: "text-neutral-400" },
  { text: "status", className: "text-sky-300" },
  { text: ": ", className: "text-neutral-400" },
  { text: '"cooking"', className: "text-emerald-300" },
  { text: " | ", className: "text-neutral-400" },
  { text: '"coffee time"', className: "text-emerald-300" },
  { text: ";\n", className: "text-neutral-400", pause: 180 },

  // Line 07
  { text: "}\n", className: "text-neutral-400", pause: 180 },

  // Line 08
  { text: "\n", pause: 120 },

  // Line 09
  { text: "export const", className: "text-purple-400" },
  { text: " " },
  { text: "developer", className: "text-sky-300" },
  { text: ": ", className: "text-neutral-400" },
  { text: "theGuyWhoNeverStopsCoding", className: "text-amber-300" },
  { text: " = {\n", className: "text-neutral-400", pause: 180 },

  // Line 10
  { text: "  ", className: "text-neutral-400" },
  { text: "name", className: "text-neutral-300" },
  { text: ": ", className: "text-neutral-400" },
  { text: '"Colf"', className: "text-emerald-300" },
  { text: ",\n", className: "text-neutral-400", pause: 120 },

  // Line 11
  { text: "  ", className: "text-neutral-400" },
  { text: "role", className: "text-neutral-300" },
  { text: ": ", className: "text-neutral-400" },
  { text: '"Full-Stack & AI Engineer"', className: "text-emerald-300" },
  { text: ",\n", className: "text-neutral-400", pause: 150 },

  // Line 12
  { text: "  ", className: "text-neutral-400" },
  { text: "focus", className: "text-neutral-300" },
  { text: ": [", className: "text-neutral-400" },
  { text: '"High-Performance Web"', className: "text-emerald-300" },
  { text: ", ", className: "text-neutral-400" },
  { text: '"LLMs"', className: "text-emerald-300" },
  { text: ", ", className: "text-neutral-400" },
  { text: '"ML"', className: "text-emerald-300" },
  { text: ", ", className: "text-neutral-400" },
  { text: '"Agentic Systems"', className: "text-emerald-300" },
  { text: "],\n", className: "text-neutral-400", pause: 160 },

  // Line 13
  { text: "  ", className: "text-neutral-400" },
  { text: "status", className: "text-neutral-300" },
  { text: ": ", className: "text-neutral-400" },
  { text: '"cooking"', className: "text-emerald-300", pause: 350 },
  { text: ",\n", className: "text-neutral-400", pause: 120 },

  // Line 14
  { text: "};", className: "text-neutral-400", pause: 7000 },
];

interface CodeTerminalProps {
  className?: string;
}

export default function CodeTerminal({ className }: CodeTerminalProps) {
  const [activeTab, setActiveTab] = useState<"code" | "terminal">("code");
  const [copied, setCopied] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [networkAddress, setNetworkAddress] = useState("http://192.168.1.184:3000");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a randomized local network IP on client mount
  useEffect(() => {
    const animFrame = requestAnimationFrame(() => {
      const useClassA = Math.random() > 0.5;
      if (useClassA) {
        const b = Math.floor(Math.random() * 254) + 1;
        const c = Math.floor(Math.random() * 254) + 1;
        const d = Math.floor(Math.random() * 254) + 1;
        setNetworkAddress(`http://10.${b}.${c}.${d}:3000`);
      } else {
        const b = Math.floor(Math.random() * 254) + 1;
        const c = Math.floor(Math.random() * 254) + 1;
        setNetworkAddress(`http://192.168.${b}.${c}:3000`);
      }
    });

    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Flatten tokens into individual characters with styling and pause metadata
  const flatChars = useMemo(() => {
    const chars: { char: string; className?: string; pause?: number }[] = [];
    TOKENS.forEach((token) => {
      const len = token.text.length;
      for (let i = 0; i < len; i++) {
        chars.push({
          char: token.text[i],
          className: token.className,
          pause: i === len - 1 ? token.pause : undefined,
        });
      }
    });
    return chars;
  }, []);

  const totalChars = flatChars.length;

  // Character-by-character live typing engine with custom pauses
  useEffect(() => {
    if (activeTab !== "code") return;

    if (charIndex >= totalChars) {
      // Pause at completion, then restart smoothly
      timerRef.current = setTimeout(() => {
        setCharIndex(0);
      }, 7000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    const currentChar = flatChars[charIndex];
    const pauseTime = currentChar?.pause || 0;
    // Human-like slight rhythm variance
    const baseSpeed = Math.floor(Math.random() * 12) + 24;
    const delay = pauseTime > 0 ? pauseTime : baseSpeed;

    timerRef.current = setTimeout(() => {
      setCharIndex((prev) => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [charIndex, totalChars, flatChars, activeTab]);

  const handleReplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCharIndex(0);
  };

  const handleCopy = () => {
    const fullCode = TOKENS.map((t) => t.text).join("");
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reconstruct lines from the currently visible characters
  const { renderedLines, currentLineNum, currentColNum } = useMemo(() => {
    type Chunk = { text: string; className?: string };
    const lines: Chunk[][] = [[]];

    for (let i = 0; i < charIndex; i++) {
      const item = flatChars[i];
      if (item.char === "\n") {
        lines.push([]);
      } else {
        const currentLine = lines[lines.length - 1];
        const lastChunk = currentLine[currentLine.length - 1];
        if (lastChunk && lastChunk.className === item.className) {
          lastChunk.text += item.char;
        } else {
          currentLine.push({ text: item.char, className: item.className });
        }
      }
    }

    const currentLineNum = lines.length;
    const currentLineChunks = lines[lines.length - 1] || [];
    const currentColNum = currentLineChunks.reduce((acc, c) => acc + c.text.length, 0) + 1;

    return { renderedLines: lines, currentLineNum, currentColNum };
  }, [charIndex, flatChars]);

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden text-left",
        "border border-white/10 bg-neutral-950/95 backdrop-blur-2xl shadow-2xl shadow-black/70",
        "transition-all duration-300",
        className
      )}
    >
      {/* Top Subtle Specular Highlight Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Window Title & Tabs Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/80 border-b border-white/5 select-none">
        {/* Left: macOS Window Traffic Lights + Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-1">
            <span
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] inline-block shadow-sm"
              aria-label="Close"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] inline-block shadow-sm"
              aria-label="Minimize"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] inline-block shadow-sm"
              aria-label="Expand"
            />
          </div>

          {/* Editor Tabs with gray icon */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all",
                activeTab === "code"
                  ? "bg-neutral-800/90 text-neutral-100 font-medium shadow-sm border border-white/10"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
              )}
            >
              {/* Gray file icon */}
              <FileCode className="w-3.5 h-3.5 text-neutral-400" />
              <span>colf.ts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("terminal")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all",
                activeTab === "terminal"
                  ? "bg-neutral-800/90 text-neutral-100 font-medium shadow-sm border border-white/10"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
              )}
            >
              <TerminalIcon className="w-3.5 h-3.5 text-neutral-400" />
              <span>bash</span>
            </button>
          </div>
        </div>

        {/* Right Actions: Replay & Copy */}
        <div className="flex items-center gap-1">
          {activeTab === "code" && (
            <button
              type="button"
              onClick={handleReplay}
              title="Replay typing"
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Sub-bar: Clean Editor Breadcrumb Path */}
      <div className="flex items-center px-4 py-1.5 bg-neutral-950/70 border-b border-white/5 text-[11px] font-mono text-neutral-400 select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500">portfolio</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-neutral-500">src</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-neutral-200 font-medium">colf.ts</span>
        </div>
      </div>

      {/* Main Terminal / Editor Content Area */}
      <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[380px]">
        {activeTab === "code" ? (
          <div className="flex gap-4 sm:gap-6">
            {/* Line Numbers Gutter */}
            <div className="flex flex-col text-right select-none font-mono text-xs sm:text-sm space-y-1 pr-3 border-r border-white/5 min-w-[28px]">
              {Array.from({ length: 14 }).map((_, i) => {
                const lineNum = i + 1;
                const isActive = lineNum === currentLineNum;
                return (
                  <span
                    key={i}
                    className={cn(
                      "leading-relaxed transition-colors",
                      isActive ? "text-white font-semibold" : "text-neutral-600"
                    )}
                  >
                    {String(lineNum).padStart(2, "0")}
                  </span>
                );
              })}
            </div>

            {/* Live Typing Code Body */}
            <div className="flex-1 space-y-1 font-mono text-neutral-200">
              {renderedLines.map((chunks, lineIdx) => {
                const lineNum = lineIdx + 1;
                const isCurrentTypingLine = lineNum === currentLineNum;
                const isLineEmpty = chunks.length === 0 || (chunks.length === 1 && chunks[0].text === "");

                return (
                  <div
                    key={lineIdx}
                    className={cn(
                      "flex items-center transition-colors min-h-[1.5rem]",
                      isCurrentTypingLine && "bg-white/[0.04] -mx-4 px-4 py-0.5 rounded"
                    )}
                  >
                    {isLineEmpty ? (
                      <span className="select-none text-transparent">&nbsp;</span>
                    ) : (
                      <p className="whitespace-pre">
                        {chunks.map((chunk, cIdx) => (
                          <span key={cIdx} className={chunk.className}>
                            {chunk.text}
                          </span>
                        ))}
                      </p>
                    )}

                    {/* Cursor renders at the active typing line */}
                    {isCurrentTypingLine && (
                      <span
                        className="inline-block w-2 h-4 sm:h-4.5 bg-white ml-0.5 rounded-[1px] animate-pulse align-middle"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Real Turbopack Bash Output Mode */
          <div className="space-y-1 font-mono text-neutral-300 text-xs sm:text-sm">
            {/* Header */}
            <div className="text-purple-400 font-medium pb-1">
              ▲ Next.js 16.4.5 <span className="text-neutral-400 font-normal">(Turbopack)</span>
            </div>

            {/* Endpoints */}
            <div className="text-neutral-400 space-y-0.5 pb-1 text-xs sm:text-sm">
              <p>
                - Local:{"        "}
                <span className="text-neutral-200 underline decoration-neutral-700">http://localhost:3000</span>
              </p>
              <p>
                - Network:{"      "}
                <span className="text-neutral-200">{networkAddress}</span>
              </p>
            </div>

            {/* Ready details */}
            <div className="space-y-0.5 pb-2 text-neutral-200">
              <p>
                <span className="text-emerald-400 font-semibold">✓</span> Ready in 1120ms
              </p>
              <p>
                <span className="text-emerald-400 font-semibold">✓</span> Running next.config.ts took 269ms
              </p>
              <p className="text-neutral-400">- Cache Components enabled</p>
              <p className="text-neutral-400">- Partial Prefetching enabled</p>
            </div>

            {/* Compilation log stream */}
            <div className="pt-2 space-y-0.5 text-neutral-400 border-t border-white/5">
              <p className="text-neutral-300">
                <span className="text-neutral-400">○</span> Compiling / ...
              </p>
              <p className="text-neutral-300">
                GET / <span className="text-emerald-400 font-semibold">200</span> in 1374ms{" "}
                <span className="text-neutral-500">(next.js: 652ms, application-code: 722ms)</span>
              </p>
              <p className="text-neutral-200">
                <span className="text-emerald-400 font-semibold">✓</span> Compiled in 1552ms
              </p>
              <p className="text-neutral-200">
                <span className="text-emerald-400 font-semibold">✓</span> Compiled in 956ms
              </p>
              <p className="text-neutral-300">
                GET / <span className="text-emerald-400 font-semibold">200</span> in 95ms{" "}
                <span className="text-neutral-500">(next.js: 12ms, application-code: 83ms)</span>
              </p>
              <p className="text-neutral-300">
                GET / <span className="text-emerald-400 font-semibold">200</span> in 107ms{" "}
                <span className="text-neutral-500">(next.js: 3ms, application-code: 104ms)</span>
              </p>
              <p className="text-neutral-200">
                <span className="text-emerald-400 font-semibold">✓</span> Compiled in 1274ms
              </p>
              <p className="text-neutral-200">
                <span className="text-emerald-400 font-semibold">✓</span> Compiled in 220ms
              </p>
              <p className="text-neutral-300">
                GET / <span className="text-emerald-400 font-semibold">200</span> in 114ms{" "}
                <span className="text-neutral-500">(next.js: 3ms, application-code: 112ms)</span>
              </p>
              <p className="text-neutral-300">
                GET / <span className="text-emerald-400 font-semibold">200</span> in 152ms{" "}
                <span className="text-neutral-500">(next.js: 12ms, application-code: 140ms)</span>
              </p>
              <p className="text-neutral-200">
                <span className="text-emerald-400 font-semibold">✓</span> Compiled in 140ms
              </p>
              <p className="text-neutral-300 flex items-center">
                GET / <span className="text-emerald-400 font-semibold mr-1">200</span> in 81ms{" "}
                <span className="text-neutral-500 ml-1">(next.js: 7ms, application-code: 74ms)</span>
                <span className="inline-block w-2 h-4 bg-white ml-1.5 animate-pulse" />
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Editor Status Bar Footer (Real VS Code style with gray icons) */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-900/80 border-t border-white/5 text-[11px] font-mono text-neutral-400 select-none">
        {/* Left Status Items with gray GitBranch */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200 transition-colors">
            <GitBranch className="w-3 h-3 text-neutral-400" />
            <span>main</span>
          </span>
          <span className="text-neutral-700">|</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>0 errors, 0 warnings</span>
          </span>
        </div>

        {/* Right Editor Diagnostics with gray TypeScript */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">
            Ln {currentLineNum}, Col {currentColNum}
          </span>
          <span className="hidden sm:inline text-neutral-700">|</span>
          <span className="hidden sm:inline">Spaces: 2</span>
          <span className="hidden sm:inline text-neutral-700">|</span>
          <span>UTF-8</span>
          <span className="text-neutral-700">|</span>
          {/* Gray TypeScript text */}
          <span className="text-neutral-400">TypeScript</span>
        </div>
      </div>
    </div>
  );
}
