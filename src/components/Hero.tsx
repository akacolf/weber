"use client";

import React, { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Terminal,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  GitBranch,
  ShieldCheck,
} from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"terminal" | "architecture">("terminal");

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left z-10">
            <div className="inline-flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs font-mono bg-background/60 backdrop-blur-md border-border/80"
              >
                <Sparkles className="w-3 h-3 text-sky-400 mr-1" />
                Next.js 16 • Shadcn UI • TypeScript 5
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
              Crafting fluid{" "}
              <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                digital products
              </span>{" "}
              &amp; resilient web systems.
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Full-stack software engineer &amp; creative technologist. Designing
              accessible design systems, precision interfaces, and high-performance
              cloud applications.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#projects"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}
              >
                View Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="#experience"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-6 bg-background/50 backdrop-blur-md border-border/80 hover:bg-accent/40"
                )}
              >
                <Terminal className="mr-2 h-4 w-4 text-sky-400" />
                Engineering Stack
              </Link>
            </div>

            {/* Micro stats / stack pills */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/40 max-w-lg">
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">5+ yrs</p>
                <p className="text-xs text-muted-foreground">Product Engineering</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">&lt; 15ms</p>
                <p className="text-xs text-muted-foreground">P99 Server Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Type-Safe &amp; Accessible</p>
              </div>
            </div>
          </div>

          {/* Right Visual Showcase Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient backdrop glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/15 via-violet-500/15 to-pink-500/15 rounded-3xl blur-3xl -z-10" />

            <div className="w-full max-w-md">
              <Card className="rounded-2xl border-border/80 dark:border-white/10 bg-card/85 dark:bg-neutral-950/80 backdrop-blur-xl shadow-2xl overflow-hidden p-0">
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 dark:border-white/10 bg-muted/40 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                      workbench.tsx
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                    <GitBranch className="w-3 h-3 text-sky-400" />
                    <span>main</span>
                  </div>
                </div>

                {/* Sub-tabs */}
                <div className="flex border-b border-border/50 dark:border-white/10 px-4 py-2 bg-muted/20 dark:bg-neutral-900/40 gap-2">
                  <button
                    onClick={() => setActiveTab("terminal")}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-mono transition-colors",
                      activeTab === "terminal"
                        ? "bg-secondary text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    $ Telemetry
                  </button>
                  <button
                    onClick={() => setActiveTab("architecture")}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-mono transition-colors",
                      activeTab === "architecture"
                        ? "bg-secondary text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Systems Spec
                  </button>
                </div>

                {/* Content Panel */}
                <div className="p-5 font-mono text-xs leading-relaxed space-y-4">
                  {activeTab === "terminal" ? (
                    <>
                      <div className="flex items-center justify-between text-muted-foreground text-[11px] pb-2 border-b border-border/40 dark:border-white/5">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          All checks passing
                        </span>
                        <span className="text-[10px]">Turbopack v16.4</span>
                      </div>

                      <div className="space-y-1.5 text-foreground/80 dark:text-neutral-300">
                        <p className="text-muted-foreground">
                          <span className="text-sky-400">~</span> npx playwright test
                        </p>
                        <p className="text-emerald-400">✓ 1 passed in 410ms (chromium, webkit)</p>
                        <p className="text-muted-foreground">
                          <span className="text-sky-400">~</span> npm run build
                        </p>
                        <p className="text-emerald-400">✓ Compiled successfully (0 errors, 0 warnings)</p>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/30 dark:bg-white/[0.03] border border-border/50 dark:border-white/5 space-y-2 mt-4">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-muted-foreground">Core Web Vitals</span>
                          <span className="text-emerald-400 font-bold">100 / 100</span>
                        </div>
                        <div className="w-full bg-muted dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full w-full rounded-full" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/30 dark:bg-white/[0.03]">
                        <Cpu className="w-4 h-4 text-sky-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground text-[11px]">Next.js 16 App Router</p>
                          <p className="text-muted-foreground text-[10px]">Server Actions &amp; Partial Prerendering</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/30 dark:bg-white/[0.03]">
                        <Layers className="w-4 h-4 text-violet-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground text-[11px]">Shadcn Component System</p>
                          <p className="text-muted-foreground text-[10px]">Accessible Radix &amp; Base-UI primitives</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/30 dark:bg-white/[0.03]">
                        <ShieldCheck className="w-4 h-4 text-pink-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground text-[11px]">Playwright &amp; WCAG AA</p>
                          <p className="text-muted-foreground text-[10px]">Continuous verification on every commit</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer status strip */}
                <div className="px-4 py-2.5 border-t border-border/50 dark:border-white/10 bg-muted/40 dark:bg-white/[0.02] flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online &amp; Verified
                  </span>
                  <span className="text-[10px]">Production Build</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
