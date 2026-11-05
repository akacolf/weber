"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Briefcase, Boxes, Cpu } from "lucide-react";

const ROLES = [
  {
    role: "Lead Frontend Architect",
    company: "Vesper Systems",
    period: "2024 — Present",
    description:
      "Spearheading high-performance Next.js 16 architectures, real-time telemetry dashboards, and accessible Shadcn design systems. Cut P99 render latencies by 45% using Partial Prerendering and optimized bundle trees.",
    skills: ["React 19", "Next.js 16", "TypeScript", "Turbopack", "Playwright"],
  },
  {
    role: "Senior UI & Systems Engineer",
    company: "Fluid Studio",
    period: "2022 — 2024",
    description:
      "Architected enterprise design systems, glassmorphism UI components, and micro-interactions for flagship product launches. Standardized design tokens and WCAG 2.2 AA accessibility compliance.",
    skills: ["Design Systems", "Tailwind CSS", "Shadcn UI", "Design Tokens"],
  },
  {
    role: "Full-Stack Engineer",
    company: "Synthetix Labs",
    period: "2020 — 2022",
    description:
      "Engineered full-stack TypeScript microservices, REST & GraphQL APIs, and performant web apps serving 200k+ monthly active users.",
    skills: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker"],
  },
];

const SKILL_CATEGORIES = [
  {
    title: "Design Systems & UI",
    items: [
      "Shadcn UI / Radix",
      "Tailwind CSS v4",
      "Design Tokens & Theming",
      "CSS Glassmorphism",
      "Micro-Interactions",
      "Fluid Layout Systems",
    ],
  },
  {
    title: "Frontend Engineering",
    items: [
      "Next.js 16 (App Router)",
      "React 19 & Server Actions",
      "TypeScript 5 Strict",
      "Partial Prerendering (PPR)",
      "State Management",
      "Performance Optimization",
    ],
  },
  {
    title: "Quality & Systems",
    items: [
      "Playwright E2E Testing",
      "WCAG 2.2 AA Accessibility",
      "CI/CD Workflows",
      "Core Web Vitals (100/100)",
      "Antigravity Custom Skills",
      "API Architecture",
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
              {ROLES.map((job, idx) => (
                <Card
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-neutral-900/30 backdrop-blur-md border-white/10 hover:border-white/20 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">
                        {job.role}
                      </h3>
                      <p className="text-sm font-medium text-sky-400">
                        {job.company}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit font-mono text-xs text-muted-foreground border-white/10"
                    >
                      {job.period}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="text-xs bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground"
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
          <TabsContent value="skills" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <Card
                  key={idx}
                  className="p-6 rounded-2xl bg-neutral-900/30 backdrop-blur-md border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Boxes className="w-4 h-4 text-violet-400" />
                      <h3 className="font-bold text-base text-foreground">
                        {cat.title}
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {cat.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5">
                    <span className="font-mono text-[11px] text-muted-foreground/60">
                      Production Ready
                    </span>
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
