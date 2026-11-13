// src/components/PythonRunnerBlock.tsx
"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import {
  Play,
  RotateCcw,
  Download,
  Maximize2,
  Terminal,
  Code2,
  Check,
  Copy,
  Loader2,
  X,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tool, type ToolStatus } from "@/components/ui/tool";
import { pythonRunner, type PythonResult, type PythonRuntimeStatus } from "@/lib/pythonRunner";
import { cn } from "@/lib/utils";

// Shared execution state store per blockId so Chain-of-Thought and Response stays in sync
interface ExecutionEntry {
  code: string;
  isRunning: boolean;
  result: PythonResult | null;
  runtimeStatus: PythonRuntimeStatus;
  hasAutoRun: boolean;
}

const executionStore = new Map<string, ExecutionEntry>();
const listeners = new Map<string, Set<() => void>>();

function getOrCreateEntry(id: string, initialCode: string): ExecutionEntry {
  let entry = executionStore.get(id);
  if (!entry) {
    entry = {
      code: initialCode,
      isRunning: false,
      result: null,
      runtimeStatus: { state: "idle" },
      hasAutoRun: false,
    };
    executionStore.set(id, entry);
  }
  return entry;
}

function subscribeEntry(id: string, callback: () => void) {
  let set = listeners.get(id);
  if (!set) {
    set = new Set();
    listeners.set(id, set);
  }
  set.add(callback);
  return () => {
    set?.delete(callback);
    if (set?.size === 0) {
      listeners.delete(id);
    }
  };
}

function notifyEntry(id: string) {
  const set = listeners.get(id);
  if (set) {
    set.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  }
}

export function isBlockExecuting(id: string): boolean {
  return executionStore.get(id)?.isRunning ?? false;
}

export async function executePythonBlock(
  blockId: string,
  code: string
): Promise<PythonResult> {
  const entry = getOrCreateEntry(blockId, code);
  entry.code = code;
  entry.isRunning = true;
  entry.hasAutoRun = true;
  notifyEntry(blockId);

  try {
    const res = await pythonRunner.runCode(code);
    entry.result = res;
    entry.isRunning = false;
    notifyEntry(blockId);
    return res;
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : String(err) || "Execution failed";
    const failRes: PythonResult = {
      stdout: "",
      stderr: errorMsg,
      figures: [],
      executionTimeMs: 0,
      error: errorMsg,
    };
    entry.result = failRes;
    entry.isRunning = false;
    notifyEntry(blockId);
    return failRes;
  }
}

export function isPythonVisualCode(code: string): boolean {
  return /matplotlib|plt\.|plot\(|scatter\(|imshow\(|hist\(|figure\(|seaborn|sns\./i.test(code);
}

export interface PythonRunnerBlockProps {
  blockId?: string;
  code: string;
  isStreaming?: boolean;
  mode?: "shape" | "thought" | "combined";
}

export function PythonRunnerBlock({
  blockId,
  code: initialCode,
  isStreaming = false,
  mode = "combined",
}: PythonRunnerBlockProps) {
  const effectiveId = blockId || `standalone-${initialCode.slice(0, 32).replace(/\s+/g, "_")}`;

  // Subscribe to entry changes
  const snapshot = useSyncExternalStore(
    (onStoreChange) => subscribeEntry(effectiveId, onStoreChange),
    () => getOrCreateEntry(effectiveId, initialCode),
    () => getOrCreateEntry(effectiveId, initialCode)
  );

  const [hasCopied, setHasCopied] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"visual" | "code" | "console">("visual");
  const autoRunTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initialCode if code streamed in or changed before manual edits
  useEffect(() => {
    const entry = getOrCreateEntry(effectiveId, initialCode);
    if (!entry.hasAutoRun && entry.code !== initialCode) {
      entry.code = initialCode;
      notifyEntry(effectiveId);
    }
  }, [effectiveId, initialCode]);

  // Subscribe to pythonRunner runtime status
  useEffect(() => {
    const unsub = pythonRunner.subscribeStatus((status) => {
      const entry = getOrCreateEntry(effectiveId, initialCode);
      entry.runtimeStatus = status;
      notifyEntry(effectiveId);
    });
    return unsub;
  }, [effectiveId, initialCode]);

  // Execute Python code
  const handleRun = async (codeToRun?: string) => {
    const entry = getOrCreateEntry(effectiveId, initialCode);
    if (entry.isRunning) return;

    const targetCode = codeToRun !== undefined ? codeToRun : entry.code;
    entry.isRunning = true;
    notifyEntry(effectiveId);

    try {
      const res = await pythonRunner.runCode(targetCode);
      entry.result = res;
      entry.isRunning = false;
      notifyEntry(effectiveId);

      if (res.figures.length > 0) {
        setActiveTab("visual");
      } else if (res.stdout || res.stderr) {
        setActiveTab("console");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err) || "Execution failed";
      entry.result = {
        stdout: "",
        stderr: errorMsg,
        figures: [],
        executionTimeMs: 0,
        error: errorMsg,
      };
      entry.isRunning = false;
      notifyEntry(effectiveId);
      setActiveTab("console");
    }
  };

  // Auto-run when code is visual and streaming has completed
  const isPlot = isPythonVisualCode(snapshot.code);
  useEffect(() => {
    if (isStreaming) return;
    const entry = getOrCreateEntry(effectiveId, initialCode);
    if (entry.hasAutoRun) return;

    if (isPlot) {
      entry.hasAutoRun = true;
      notifyEntry(effectiveId);

      autoRunTimeoutRef.current = setTimeout(() => {
        handleRun(entry.code);
      }, 100);
    }

    return () => {
      if (autoRunTimeoutRef.current) clearTimeout(autoRunTimeoutRef.current);
    };
  }, [isStreaming, isPlot, effectiveId, initialCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snapshot.code).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  const handleDownloadImage = (imgSrc: string, index: number = 0) => {
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = `weber-shape-${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const hasVisual = Boolean(snapshot.result && snapshot.result.figures.length > 0);
  const hasConsole = Boolean(
    snapshot.result && (snapshot.result.stdout.trim() !== "" || snapshot.result.stderr.trim() !== "")
  );

  // =========================================================================
  // MODE: THOUGHT (Executed within the Chain of Thought)
  // Uses shadcn Tool subprocess component to display agent tool execution
  // =========================================================================
  if (mode === "thought") {
    const toolStatus: ToolStatus = snapshot.isRunning
      ? "running"
      : snapshot.result?.error
      ? "error"
      : "completed";

    return (
      <Tool
        name="python_interpreter"
        status={toolStatus}
        icon="terminal"
        className="my-2.5"
        defaultOpen={Boolean(snapshot.result?.error)}
      >
        <div className="space-y-2">
          {/* Header Subbar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pb-1.5 border-b border-border/40 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground/80">
                Input Code
              </span>
              {snapshot.result?.executionTimeMs !== undefined && snapshot.result.executionTimeMs > 0 && (
                <span className="text-[10px] text-muted-foreground/70">
                  • {snapshot.result.executionTimeMs}ms
                </span>
              )}
              {hasVisual && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  shape rendered
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRun()}
                disabled={snapshot.isRunning || isStreaming}
                className="h-5 px-1.5 text-[10.5px] gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
                title="Re-run code"
              >
                {snapshot.isRunning ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3 w-3" />
                    <span>Re-run</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleCopyCode}
                className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Copy code"
                aria-label="Copy code"
              >
                {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="relative rounded-md overflow-hidden border border-border/40 bg-neutral-950">
            <textarea
              value={snapshot.code}
              onChange={(e) => {
                const entry = getOrCreateEntry(effectiveId, initialCode);
                entry.code = e.target.value;
                notifyEntry(effectiveId);
              }}
              spellCheck={false}
              rows={Math.min(12, Math.max(4, snapshot.code.split("\n").length))}
              className="w-full p-2.5 font-mono text-[11.5px] leading-relaxed bg-transparent text-neutral-200 focus:outline-none resize-y border-0 selection:bg-neutral-800"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {snapshot.code}
            </textarea>
          </div>

          {/* Console Output if stdout or stderr exists */}
          {hasConsole && snapshot.result && (
            <div className="space-y-1 pt-1 font-mono text-[11px]">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground block">
                Output
              </span>
              {snapshot.result.stdout && (
                <pre className="p-2 rounded-md bg-muted/30 border border-border/40 text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {snapshot.result.stdout}
                </pre>
              )}
              {snapshot.result.stderr && (
                <pre className="p-2 rounded-md bg-destructive/10 border border-destructive/20 text-[11px] font-mono text-destructive overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {snapshot.result.stderr}
                </pre>
              )}
            </div>
          )}
        </div>
      </Tool>
    );
  }

  // =========================================================================
  // MODE: COMBINED (Default standalone tabbed runner)
  // Clean, no green dot, no Pyodide WASM badge, no shining star in spinner
  // =========================================================================
  return (
    <div className="my-3.5 rounded-xl border border-border/70 overflow-hidden shadow-md bg-card/60 backdrop-blur-xs transition-all">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border/50 gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase select-none">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/80" />
            <span>PYTHON</span>
          </div>

          {snapshot.result?.executionTimeMs !== undefined && snapshot.result.executionTimeMs > 0 && (
            <span className="text-[10.5px] font-mono text-muted-foreground/70">
              {snapshot.result.executionTimeMs}ms
            </span>
          )}
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex items-center gap-1.5 ms-auto">
          {/* Tabs */}
          <div className="flex items-center rounded-lg bg-background/80 p-0.5 border border-border/60 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer",
                activeTab === "visual"
                  ? "bg-foreground text-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BarChart3 className="h-3 w-3" />
              <span>Visual</span>
              {hasVisual && <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer",
                activeTab === "code"
                  ? "bg-foreground text-background shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="h-3 w-3" />
              <span>Code</span>
            </button>

            {(hasConsole || activeTab === "console") && (
              <button
                type="button"
                onClick={() => setActiveTab("console")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer",
                  activeTab === "console"
                    ? "bg-foreground text-background shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Terminal className="h-3 w-3" />
                <span>Console</span>
                {snapshot.result?.error && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </button>
            )}
          </div>

          {/* Run / Re-run Button with CLEAN SPINNER (NO STAR) */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => handleRun()}
            disabled={snapshot.isRunning || isStreaming}
            className="h-7 px-2.5 text-xs font-medium gap-1.5 cursor-pointer shadow-xs"
            title="Run Python code"
          >
            {snapshot.isRunning ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : snapshot.result ? (
              <>
                <RotateCcw className="h-3 w-3" />
                <span>Re-run</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Run</span>
              </>
            )}
          </Button>

          {/* Copy Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleCopyCode}
            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Copy code"
            aria-label="Copy code"
          >
            {hasCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Body Content */}
      <div className="relative">
        {activeTab === "visual" && (
          <div className="p-3 sm:p-4 bg-neutral-950/40 dark:bg-neutral-950/60 min-h-[160px] flex flex-col items-center justify-center">
            {snapshot.isRunning ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                {/* CLEAN SPINNER: NO STAR / SPARKLES ICON */}
                <div className="relative flex items-center justify-center">
                  <div className="h-9 w-9 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">
                    {snapshot.runtimeStatus.message || "Generating visualization..."}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Executing calculations
                  </p>
                </div>
              </div>
            ) : hasVisual && snapshot.result ? (
              <div className="w-full space-y-4">
                {snapshot.result.figures.map((fig, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-lg overflow-hidden border border-border/80 shadow-md bg-white p-2 sm:p-3 flex flex-col items-center justify-center transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fig}
                      alt={`Generated Visualization ${idx + 1}`}
                      className="max-h-[500px] w-auto max-w-full object-contain cursor-zoom-in rounded select-none"
                      onClick={() => {
                        setSelectedImage(fig);
                        setIsZoomOpen(true);
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 backdrop-blur-xs p-1 rounded-md shadow-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => {
                          setSelectedImage(fig);
                          setIsZoomOpen(true);
                        }}
                        className="h-6 w-6 text-white hover:bg-white/20 cursor-pointer"
                        title="Expand"
                      >
                        <Maximize2 className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDownloadImage(fig, idx)}
                        className="h-6 w-6 text-white hover:bg-white/20 cursor-pointer"
                        title="Download image"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : snapshot.result && !hasVisual ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-2">
                <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                <p className="text-xs font-medium text-foreground">
                  No visual graph was generated by this code
                </p>
                <p className="text-[11px] text-muted-foreground max-w-sm">
                  {snapshot.result.stdout
                    ? "The code ran and printed output to the console."
                    : "Tip: Use matplotlib.pyplot (plt.plot, plt.show) to generate plots and graphs."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-2.5">
                <BarChart3 className="h-7 w-7 text-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground">Interactive Visualization</p>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => handleRun()}
                  disabled={snapshot.isRunning || isStreaming}
                  className="mt-1 h-7 text-xs gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Execute & Visualize</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "code" && (
          <div className="relative">
            <textarea
              value={snapshot.code}
              onChange={(e) => {
                const entry = getOrCreateEntry(effectiveId, initialCode);
                entry.code = e.target.value;
                notifyEntry(effectiveId);
              }}
              spellCheck={false}
              className="w-full min-h-[160px] p-3.5 font-mono text-[12.5px] leading-relaxed bg-neutral-950/80 dark:bg-neutral-950/95 text-neutral-100 focus:outline-none resize-y border-0 selection:bg-neutral-800"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {snapshot.code}
            </textarea>
          </div>
        )}

        {activeTab === "console" && (
          <div className="p-3.5 bg-neutral-950/90 text-neutral-100 font-mono text-xs max-h-[350px] overflow-auto leading-relaxed">
            {snapshot.result ? (
              <div className="space-y-3">
                {snapshot.result.stdout && (
                  <div>
                    <span className="text-[10.5px] font-semibold text-emerald-400 block mb-1">
                      STDOUT:
                    </span>
                    <pre className="whitespace-pre-wrap text-neutral-200">
                      {snapshot.result.stdout}
                    </pre>
                  </div>
                )}
                {snapshot.result.stderr && (
                  <div>
                    <span className="text-[10.5px] font-semibold text-red-400 block mb-1">
                      {snapshot.result.error ? "ERROR / TRACEBACK:" : "STDERR / WARNINGS:"}
                    </span>
                    <pre className="whitespace-pre-wrap text-red-300/90 bg-red-950/30 p-2 rounded border border-red-900/50">
                      {snapshot.result.stderr}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-neutral-500 italic">No execution output yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-xl shadow-2xl flex flex-col items-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-neutral-200">
              <span className="text-xs font-mono font-medium text-neutral-700">
                Visualization Preview
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadImage(selectedImage)}
                  className="h-7 text-xs gap-1 cursor-pointer text-neutral-800"
                >
                  <Download className="h-3 w-3" />
                  <span>Save Image</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsZoomOpen(false)}
                  className="h-7 w-7 text-neutral-600 hover:text-black cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Expanded visualization"
              className="max-h-[78vh] w-auto object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
