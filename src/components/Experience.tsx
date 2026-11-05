"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Briefcase, Boxes, Cpu, ArrowUpRight } from "lucide-react";

const ROLES = [
  {
    role: "Lead Frontend Architect",
    company: "Vesper Systems",
    period: "2024 — Present",
    description:
      "Spearheading high-performance WebGL interfaces, real-time telemetry dashboards, and component libraries. Cut render latencies by 45% using instanced Three.js geometry and modern React 19.",
    skills: ["React 19", "Three.js", "Web Audio", "Turbopack", "Playwright"],
  },
  {
    role: "Senior Creative Technologist",
    company: "Fluid Studio",
    period: "2022 — 2024",
    description:
      "Designed immersive brand worlds, liquid glass interactions, and procedural shaders for world-class product launches. Led engineering handoffs and accessibility compliance.",
    skills: ["R3F", "GLSL Shaders", "Tailwind CSS", "Design Tokens"],
  },
  {
    role: "Full-Stack Engineer",
    company: "Synthetix Labs",
    period: "2020 — 2022",
    description:
      "Engineered full-stack TypeScript microservices, GraphQL APIs, and performant web apps serving 200k+ monthly active users.",
    skills: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker"],
  },
];

const SKILL_CATEGORIES = [
  {
    title: "Graphics & 3D Web",
    items: [
      "Three.js",
      "React Three Fiber (R3F)",
      "GLSL Custom Shaders",
      "Liquid-glass-js",
      "Shadergradient",
      "Post-Processing & Bloom",
    ],
  },
  {
    title: "Frontend Engineering",
    items: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Shadcn / Base UI",
      "Micro-Interactions & Gestures",
    ],
  },
  {
    title: "Quality & Systems",
    items: [
      "Playwright E2E Testing",
      "WCAG 2.2 AA Accessibility",
      "CI/CD Workflows",
      "Performance Profiling (60 FPS)",
      "Antigravity Custom Skills",
      "Design Systems & Governance",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-400 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>BACKGROUND &amp; CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Experience &amp; Technical Skillset
          </h2>
        </div>

        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="mb-8 bg-background/60 backdrop-blur-md border border-white/10 p-1">
            <TabsTrigger value="experience" className="gap-2 cursor-pointer">
              <Briefcase className="w-4 h-4" />
              Roles &amp; Trajectory
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2 cursor-pointer">
              <Cpu className="w-4 h-4" />
              Technical Stack
            </TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="experience" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {ROLES.map((role, idx) => (
                <Card
                  key={idx}
                  className="bg-neutral-900/40 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {role.role}
                      </h3>
                      <p className="text-sm text-sky-400 font-medium">
                        {role.company}
                      </p>
                    </div>
                    <Badge variant="outline" className="w-fit font-mono text-xs text-muted-foreground">
                      {role.period}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {role.skills.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="text-[11px] bg-white/5 border border-white/10 font-mono"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div id="skills" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <Card
                  key={idx}
                  className="bg-neutral-900/40 backdrop-blur-lg border-white/10 p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
                      {cat.title}
                      <Boxes className="w-4 h-4 text-violet-400" />
                    </h3>

                    <ul className="space-y-2.5">
                      {cat.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5">
                    <p className="text-[11px] font-mono text-muted-foreground">
                      Verified with Playwright &amp; WebGL Benchmarks
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
