"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Sparkles,
  Layers,
  Cpu,
  Activity,
  Boxes,
  CheckCircle2,
} from "lucide-react";

type ProjectCategory = "all" | "systems" | "graphics";

interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  category: "systems" | "graphics";
  year: string;
  description: string;
  highlight: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  renderPreview: () => React.ReactNode;
}

const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "chroma-engine",
    title: "Liquid Chroma Engine",
    domain: "Design Systems • Generative Tokens",
    category: "systems",
    year: "2024",
    description:
      "Perceptual color space architecture dynamically generating accessible design token palettes with live WCAG APCA contrast verification and zero runtime overhead.",
    highlight: "Sub-1ms contrast audit • WCAG AAA",
    tags: ["TypeScript", "Tailwind CSS", "CSS Houdini", "Color Science"],
    demoUrl: "https://github.com/akacolf",
    githubUrl: "https://github.com/akacolf",
    renderPreview: () => (
      <div className="relative w-full h-36 rounded-xl bg-muted/40 border border-border/50 p-3.5 flex flex-col justify-between overflow-hidden group-hover:border-foreground/20 transition-colors">
        {/* Color Palette Spectrum Ramp */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Dynamic Spectrum
            </span>
            <span className="text-foreground/80 font-medium">APCA Lc 92.4</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 h-7 rounded-lg overflow-hidden p-0.5 bg-background/60 border border-border/40">
            <div className="rounded bg-sky-500 flex items-center justify-center text-[9px] font-mono text-white font-medium">
              500
            </div>
            <div className="rounded bg-indigo-500 flex items-center justify-center text-[9px] font-mono text-white font-medium">
              600
            </div>
            <div className="rounded bg-violet-500 flex items-center justify-center text-[9px] font-mono text-white font-medium">
              700
            </div>
            <div className="rounded bg-fuchsia-500 flex items-center justify-center text-[9px] font-mono text-white font-medium">
              800
            </div>
            <div className="rounded bg-rose-500 flex items-center justify-center text-[9px] font-mono text-white font-medium">
              900
            </div>
          </div>
        </div>

        {/* Live Contrast & Gamut Indicators */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>14.8:1 AAA PASS</span>
          </div>
          <span className="text-muted-foreground">sRGB / P3 Gamut</span>
        </div>
      </div>
    ),
  },
  {
    id: "nexus-agent",
    title: "Nexus Agent Runtime",
    domain: "Distributed AI • Infrastructure",
    category: "systems",
    year: "2024",
    description:
      "Autonomous agent execution workspace featuring streaming SSE telemetry, sandboxed tool dispatchers, and state machine session replay with audit logging.",
    highlight: "P99 < 12ms latency • Streaming SSE",
    tags: ["Next.js 16", "Turbopack", "AI SDK", "TypeScript"],
    demoUrl: "https://github.com/akacolf",
    githubUrl: "https://github.com/akacolf",
    renderPreview: () => (
      <div className="relative w-full h-36 rounded-xl bg-muted/40 border border-border/50 p-3 flex flex-col justify-between overflow-hidden group-hover:border-foreground/20 transition-colors font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/40 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <Cpu className="w-3.5 h-3.5 text-sky-500" />
            agent_runtime.ts
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            IDLE • READY
          </span>
        </div>

        {/* Live Code / Log Stream */}
        <div className="space-y-1 text-[11px] text-muted-foreground leading-tight py-1">
          <p className="truncate">
            <span className="text-sky-500 dark:text-sky-400">→</span> dispatch:{" "}
            <span className="text-foreground">validateSchema()</span>
          </p>
          <p className="truncate">
            <span className="text-emerald-500">✓</span> tool output stream:{" "}
            <span className="text-muted-foreground">248 tokens</span>
          </p>
        </div>

        {/* Telemetry Bar */}
        <div className="flex items-center justify-between pt-1.5 border-t border-border/30 text-[10px]">
          <span className="text-muted-foreground">Heartbeat: 42bpm</span>
          <span className="text-foreground font-semibold">12ms response</span>
        </div>
      </div>
    ),
  },
  {
    id: "prism-canvas",
    title: "Prism Spatial Canvas",
    domain: "Interactive Graphics • WebGL",
    category: "graphics",
    year: "2024",
    description:
      "Infinite 2D/3D visualization engine mapping multi-tier network topologies, high-throughput cluster routing, and real-time financial telemetry at 60 FPS.",
    highlight: "60 FPS Canvas • Web Workers",
    tags: ["WebGL", "Web Workers", "Canvas API", "TypeScript"],
    demoUrl: "https://github.com/akacolf",
    githubUrl: "https://github.com/akacolf",
    renderPreview: () => (
      <div className="relative w-full h-36 rounded-xl bg-muted/40 border border-border/50 p-3.5 flex flex-col justify-between overflow-hidden group-hover:border-foreground/20 transition-colors">
        {/* Node Graph Schematic Mockup */}
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <Activity className="w-3.5 h-3.5 text-violet-500" />
            Cluster Topology
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            60.0 FPS
          </span>
        </div>

        {/* Geometric Network Grid */}
        <div className="relative h-14 w-full rounded-lg bg-background/50 border border-border/30 flex items-center justify-around px-4 overflow-hidden">
          {/* Subtle grid background lines */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-border)_1px,_transparent_1px)] bg-[size:12px_12px] opacity-60" />

          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="w-4 h-4 rounded-full bg-sky-500/20 border border-sky-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            </div>
            <div className="h-0.5 flex-1 mx-2 bg-gradient-to-r from-sky-500 to-violet-500 opacity-60" />
            <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping opacity-75" />
            </div>
            <div className="h-0.5 flex-1 mx-2 bg-gradient-to-r from-violet-500 to-pink-500 opacity-60" />
            <div className="w-4 h-4 rounded-full bg-pink-500/20 border border-pink-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1.5 border-t border-border/30">
          <span>Nodes: 1,420 mapped</span>
          <span>Frame: 16.6ms</span>
        </div>
      </div>
    ),
  },
  {
    id: "atelier-ui",
    title: "Atelier UI Primitive Suite",
    domain: "Open Source • Design Primitives",
    category: "systems",
    year: "2024",
    description:
      "Accessible, unstyled component system built on Base UI primitives featuring concentric radii, sub-pixel optical balance, and fluid keyboard motion.",
    highlight: "100% Keyboard Nav • Base UI",
    tags: ["React 19", "Base UI", "Tailwind v4", "Radix"],
    demoUrl: "https://github.com/akacolf",
    githubUrl: "https://github.com/akacolf",
    renderPreview: () => (
      <div className="relative w-full h-36 rounded-xl bg-muted/40 border border-border/50 p-3.5 flex flex-col justify-between overflow-hidden group-hover:border-foreground/20 transition-colors">
        {/* Micro Controls Preview */}
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <Boxes className="w-3.5 h-3.5 text-amber-500" />
            Primitives Spec
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border/60 text-foreground font-mono">
            v1.4.0
          </span>
        </div>

        {/* Micro UI Layering Showcase */}
        <div className="grid grid-cols-2 gap-2 my-auto">
          <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border/40 text-[11px] font-mono">
            <span className="text-muted-foreground">Segment</span>
            <span className="font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded text-[10px]">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border/40 text-[11px] font-mono">
            <span className="text-muted-foreground">Radii</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[10px]">
              Concentric
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1.5 border-t border-border/30">
          <span>ARIA 1.2 compliant</span>
          <span className="text-foreground">0kb runtime CSS</span>
        </div>
      </div>
    ),
  },
];

export default function Projects() {
  const [filter, setFilter] = useState<ProjectCategory>("all");

  const filteredProjects = FEATURED_PROJECTS.filter((proj) => {
    if (filter === "all") return true;
    return proj.category === filter;
  });

  return (
    <section
      id="projects"
      aria-labelledby="featured-projects-title"
      className="w-full border-t border-border/40 pt-16 sm:pt-24 pb-20 sm:pb-28"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-muted/60 border border-border/60 text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="tracking-wide uppercase text-[11px]">Selected Works</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-[11px]">2024 — Present</span>
            </div>

            <h2
              id="featured-projects-title"
              className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif tracking-tight text-foreground"
            >
              Featured Projects
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              Handcrafted digital products, distributed platforms, and design systems
              engineered with precision, high performance, and accessibility.
            </p>
          </div>

          {/* Filter Pills & Archive Link */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            <div
              role="group"
              aria-label="Filter projects by category"
              className="inline-flex items-center rounded-lg p-1 bg-muted/50 border border-border/60 text-xs font-mono"
            >
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  filter === "all"
                    ? "bg-background text-foreground shadow-xs font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All ({FEATURED_PROJECTS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("systems")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  filter === "systems"
                    ? "bg-background text-foreground shadow-xs font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Systems &amp; AI
              </button>
              <button
                type="button"
                onClick={() => setFilter("graphics")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  filter === "graphics"
                    ? "bg-background text-foreground shadow-xs font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Graphics
              </button>
            </div>

            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-lg font-mono text-xs gap-1.5 border-border/70 hover:bg-muted"
              )}
            >
              <span>View all products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.35)] hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                {/* Card Meta Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                    <span className="font-mono text-muted-foreground/40 text-xs">/</span>
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px] font-mono border-border/60 bg-background/50 text-muted-foreground"
                    >
                      {project.domain}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Source code for ${project.title}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-xs" }),
                        "rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Live demo for ${project.title}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-xs" }),
                        "rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Mockup Preview */}
                <div>{project.renderPreview()}</div>

                {/* Title & Description */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xl sm:text-2xl font-serif font-normal text-foreground group-hover:text-foreground transition-colors">
                      {project.title}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground shrink-0">
                      {project.year}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Key Spec Callout */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/40 border border-border/40 text-[11px] font-mono text-foreground/90">
                  <Sparkles className="w-3 h-3 text-sky-500 shrink-0" />
                  <span>{project.highlight}</span>
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-5 mt-5 border-t border-border/40">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-md font-mono text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground border-transparent hover:text-foreground transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Section Bottom Banner */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl border border-border/60 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-lg text-foreground font-normal">
              Looking for full case studies or technical architecture?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Explore the dedicated products catalogue, open-source repositories, and developer documentation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/products"
              className={cn(buttonVariants({ size: "sm" }), "rounded-full px-4 text-xs font-mono")}
            >
              Explore Archive
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full px-4 text-xs font-mono border-border/80"
              )}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Projects as FeaturedProjects };
