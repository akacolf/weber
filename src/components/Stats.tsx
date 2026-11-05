"use client";

import React from "react";

interface StatItem {
  id: string;
  value: string;
  unit?: string;
  label: string;
  description: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: "users",
    value: "3,000+",
    label: "Active users scaled",
    description: "Built & scaled across all the applications I've built.",
  },
  {
    id: "experience",
    value: "3+",
    unit: "yrs",
    label: "Experience",
    description: "Hands-on experience shipping full-stack products, APIs, and fluid UI systems.",
  },
  {
    id: "projects",
    value: "20+",
    label: "Projects completed",
    description: "Production web applications, AI tools, and products built end-to-end.",
  },
  {
    id: "clients",
    value: "10+",
    label: "Worldwide clients",
    description: "Partnering with founders and teams globally to build scalable software.",
  },
];

export default function Stats() {
  return (
    <section
      id="stats"
      aria-labelledby="stats-title"
      className="w-full border-t border-border/40 pt-16 sm:pt-20 pb-16 sm:pb-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-3">
            <h2
              id="stats-title"
              className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif tracking-tight text-foreground"
            >
              Stats
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              Here are some numbers related to me.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS_DATA.map((item, index) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 dark:bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.35)] hover:-translate-y-0.5"
            >
              {/* Top Meta Line */}
              <div className="mb-6">
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
              </div>

              {/* Big Stat Value */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-normal font-serif text-foreground tracking-tight group-hover:text-foreground transition-colors">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="font-mono text-sm text-muted-foreground">
                      {item.unit}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-medium text-foreground pt-1">
                  {item.label}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
