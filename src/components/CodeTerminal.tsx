"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Terminal as TerminalIcon,
  GitBranch,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  ChevronRight,
} from "lucide-react";

interface CodeTerminalProps {
  className?: string;
}

export default function CodeTerminal({ className }: CodeTerminalProps) {
  const [activeTab, setActiveTab] = useState<"code" | "terminal">("code");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeSnippet = `interface theGuyWhoNeverStopsCoding {
  name: string;
  role: string;
  focus: string[];
  status: "cooking" | "coffee time";
}

export const developer: theGuyWhoNeverStopsCoding = {
  name: "Colf",
  role: "Full-Stack & AI Engineer",
  focus: ["High-Performance Web", "Design Systems", "Architecture"],
  status: "cooking",
};`;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden text-left",
        "border border-white/10 bg-neutral-950/95 backdrop-blur-2xl shadow-2xl shadow-black/60",
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

          {/* Editor Tabs */}
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
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>developer.ts</span>
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
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>bash ~ live</span>
            </button>
          </div>
        </div>

        {/* Right Action: Clean Copy Control */}
        <div className="flex items-center">
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

      {/* Sub-bar: Clean Editor Breadcrumb Path (no badges/git duplicates) */}
      <div className="flex items-center px-4 py-1.5 bg-neutral-950/70 border-b border-white/5 text-[11px] font-mono text-neutral-400 select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500">portfolio</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-neutral-500">src</span>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-neutral-200 font-medium">developer.ts</span>
        </div>
      </div>

      {/* Main Terminal / Editor Content Area */}
      <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[350px]">
        {activeTab === "code" ? (
          <div className="flex gap-4 sm:gap-6">
            {/* Line Numbers Gutter */}
            <div className="flex flex-col text-right text-neutral-600 select-none font-mono text-xs sm:text-sm space-y-1 pr-3 border-r border-white/5 min-w-[28px]">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "leading-relaxed",
                    i === 12 ? "text-white font-semibold" : ""
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </div>

            {/* Code Body */}
            <div className="flex-1 space-y-1 font-mono text-neutral-200">
              {/* Line 01 */}
              <p className="text-neutral-500 italic">
                {"// Self-documenting developer specification"}
              </p>

              {/* Line 02 */}
              <p>
                <span className="text-purple-400">interface</span>{" "}
                <span className="text-amber-300">theGuyWhoNeverStopsCoding</span>{" "}
                <span className="text-neutral-400">{"{"}</span>
              </p>

              {/* Line 03 */}
              <p className="pl-4">
                <span className="text-sky-300">name</span>
                <span className="text-neutral-400">:</span>{" "}
                <span className="text-emerald-300">string</span>
                <span className="text-neutral-400">;</span>
              </p>

              {/* Line 04 */}
              <p className="pl-4">
                <span className="text-sky-300">role</span>
                <span className="text-neutral-400">:</span>{" "}
                <span className="text-emerald-300">string</span>
                <span className="text-neutral-400">;</span>
              </p>

              {/* Line 05 */}
              <p className="pl-4">
                <span className="text-sky-300">focus</span>
                <span className="text-neutral-400">:</span>{" "}
                <span className="text-emerald-300">string[]</span>
                <span className="text-neutral-400">;</span>
              </p>

              {/* Line 06 */}
              <p className="pl-4">
                <span className="text-sky-300">status</span>
                <span className="text-neutral-400">:</span>{" "}
                <span className="text-emerald-300">
                  &quot;cooking&quot; | &quot;coffee time&quot;
                </span>
                <span className="text-neutral-400">;</span>
              </p>

              {/* Line 07 */}
              <p>
                <span className="text-neutral-400">{"}"}</span>
              </p>

              {/* Line 08 */}
              <p className="text-neutral-600 select-none">&nbsp;</p>

              {/* Line 09 */}
              <p>
                <span className="text-purple-400">export const</span>{" "}
                <span className="text-sky-300">developer</span>
                <span className="text-neutral-400">:</span>{" "}
                <span className="text-amber-300">theGuyWhoNeverStopsCoding</span>{" "}
                <span className="text-neutral-400">=</span>{" "}
                <span className="text-neutral-400">{"{"}</span>
              </p>

              {/* Line 10 */}
              <p className="pl-4">
                <span className="text-neutral-300">name:</span>{" "}
                <span className="text-emerald-300">&quot;Colf&quot;</span>
                <span className="text-neutral-400">,</span>
              </p>

              {/* Line 11 */}
              <p className="pl-4">
                <span className="text-neutral-300">role:</span>{" "}
                <span className="text-emerald-300">
                  &quot;Full-Stack &amp; AI Engineer&quot;
                </span>
                <span className="text-neutral-400">,</span>
              </p>

              {/* Line 12 */}
              <p className="pl-4">
                <span className="text-neutral-300">focus:</span>{" "}
                <span className="text-neutral-400">[</span>
                <span className="text-emerald-300">&quot;High-Performance Web&quot;</span>
                <span className="text-neutral-400">, </span>
                <span className="text-emerald-300">&quot;Design Systems&quot;</span>
                <span className="text-neutral-400">, </span>
                <span className="text-emerald-300">&quot;Architecture&quot;</span>
                <span className="text-neutral-400">],</span>
              </p>

              {/* Line 13: Active writing line with subtle highlight & white cursor */}
              <p className="pl-4 flex items-center bg-white/[0.04] -mx-4 px-4 py-0.5 rounded">
                <span className="text-neutral-300">status:</span>{" "}
                <span className="text-emerald-300 ml-2">&quot;cooking&quot;</span>
                {/* Clean White Live Cursor */}
                <span
                  className="inline-block w-2 h-4 sm:h-4.5 bg-white ml-1 rounded-[1px] animate-pulse"
                  aria-hidden="true"
                />
              </p>

              {/* Line 14 */}
              <p>
                <span className="text-neutral-400">{"};"}</span>
              </p>
            </div>
          </div>
        ) : (
          /* Terminal / Bash Output Mode */
          <div className="space-y-3 font-mono text-neutral-300 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-neutral-500">
              <span className="text-emerald-400">➜</span>
              <span className="text-sky-400">portfolio</span>
              <span className="text-neutral-400">git:(main)</span>
              <span>npm run dev</span>
            </div>

            <div className="pl-4 border-l border-white/5 space-y-1.5 text-neutral-400">
              <p className="text-neutral-300">
                <span className="text-sky-400">▲ Next.js 16.4.5</span> (Turbopack)
              </p>
              <p className="text-emerald-400">✓ Ready in 450ms at http://localhost:3000</p>
              <p className="text-neutral-400">
                ✓ Libre Baskerville typography &amp; Geist Mono initialized
              </p>
              <p className="text-neutral-400">
                ✓ Liquid glass shaders &amp; design tokens loaded
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-emerald-400">➜</span>
              <span className="text-sky-400">portfolio</span>
              <span className="text-neutral-400">git:(main)</span>
              <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Editor Status Bar Footer (Real VS Code style) */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-900/80 border-t border-white/5 text-[11px] font-mono text-neutral-400 select-none">
        {/* Left Status Items */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 hover:text-neutral-200 transition-colors">
            <GitBranch className="w-3 h-3 text-sky-400" />
            <span>main</span>
          </span>
          <span className="text-neutral-700">|</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>0 errors, 0 warnings</span>
          </span>
        </div>

        {/* Right Editor Diagnostics */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Ln 13, Col 24</span>
          <span className="hidden sm:inline text-neutral-700">|</span>
          <span className="hidden sm:inline">Spaces: 2</span>
          <span className="hidden sm:inline text-neutral-700">|</span>
          <span>UTF-8</span>
          <span className="text-neutral-700">|</span>
          <span className="text-sky-400 font-medium">TypeScript</span>
        </div>
      </div>
    </div>
  );
}
