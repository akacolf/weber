"use client";

import React from "react";
import Link from "next/link";
import LiquidGlassCard from "@/components/ui/LiquidGlassCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Code2, Sparkles } from "lucide-react";

const PROJECTS = [
  {
    title: "Liquid Chroma Engine",
    description:
      "A real-time WebGL liquid shader library with chromatic dispersion, dynamic viscosity, and reactive cursor lighting.",
    tags: ["React Three Fiber", "GLSL", "WebGL", "TypeScript"],
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    color: "rgba(56, 189, 248, 0.2)",
    featured: true,
  },
  {
    title: "Glassmorphism UI System",
    description:
      "Cross-browser optical refraction component suite with simulated depth, normal specular highlights, and zero layout shift.",
    tags: ["Next.js", "Liquid Glass", "Tailwind CSS", "Design Systems"],
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    color: "rgba(168, 85, 247, 0.2)",
    featured: true,
  },
  {
    title: "Spatial Data Visualizer",
    description:
      "High-density 3D data dashboard visualizing real-time financial metrics, network latencies, and node clusters.",
    tags: ["Three.js", "Web Workers", "Shadcn UI", "Playwright"],
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    color: "rgba(236, 72, 153, 0.2)",
    featured: false,
  },
  {
    title: "Autonomous Agent Workbench",
    description:
      "Interface for coordinating multi-agent coding workflows, skill orchestration, and live telemetry execution.",
    tags: ["AI Agents", "Next.js 16", "Turbopack", "E2E Testing"],
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    color: "rgba(34, 197, 94, 0.2)",
    featured: false,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SELECTED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Featured Creations &amp; Experiments
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            Interactive software, generative graphics, and resilient full-stack
            systems built with modern craft.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((proj, idx) => (
            <LiquidGlassCard
              key={idx}
              glowColor={proj.color}
              className="flex flex-col justify-between h-full group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      0{idx + 1}
                    </span>
                    {proj.featured && (
                      <Badge
                        variant="secondary"
                        className="bg-sky-500/10 text-sky-400 border-sky-500/20 text-[10px]"
                      >
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Source Code"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-sm" }),
                        "rounded-full hover:bg-white/10"
                      )}
                    >
                      <Code2 className="w-4 h-4" />
                    </Link>
                    <Link
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Live Demo"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-sm" }),
                        "rounded-full hover:bg-white/10"
                      )}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-sky-300 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {proj.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {proj.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[11px] font-mono bg-background/30 border-white/10"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
