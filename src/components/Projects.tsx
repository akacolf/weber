"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  year?: string;
  description: string;
  tags: string[];
  githubUrl: string;
  renderPreview: () => React.ReactNode;
}

const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "quantum-club",
    title: "Quantum Club",
    domain: "Blockchain • AI",
    year: "2024",
    description:
      "Web3 super app that combined DeFi, social, and AI. Scaled to 3000 users and counting and received a grant from STON.fi.",
    tags: ["TypeScript", "JavaScript", "Next.js", "Tailwind CSS"],
    githubUrl: "https://github.com/akacolf/quantum-club-app",
    renderPreview: () => (
      <div className="relative w-full h-36 rounded-xl bg-muted/40 border border-border/50 p-3.5 flex flex-col justify-between overflow-hidden group-hover:border-foreground/20 transition-colors">
        {/* Web3 App Header Status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            STON.fi Ecosystem Grant
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            3,000+ Users
          </span>
        </div>

        {/* Metric / Feature Showcase Pill Grid */}
        <div className="grid grid-cols-3 gap-2 my-auto">
          <div className="p-2 rounded-lg bg-background/80 border border-border/40 text-center">
            <div className="text-[10px] font-mono text-muted-foreground">DeFi Layer</div>
            <div className="text-xs font-mono font-semibold text-foreground mt-0.5">Automated</div>
          </div>
          <div className="p-2 rounded-lg bg-background/80 border border-border/40 text-center">
            <div className="text-[10px] font-mono text-muted-foreground">AI Engine</div>
            <div className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">Integrated</div>
          </div>
          <div className="p-2 rounded-lg bg-background/80 border border-border/40 text-center">
            <div className="text-[10px] font-mono text-muted-foreground">Social Graph</div>
            <div className="text-xs font-mono font-semibold text-foreground mt-0.5">Web3 P2P</div>
          </div>
        </div>

        {/* Status footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1.5 border-t border-border/30">
          <span className="text-foreground/80">Network: TON / STON.fi</span>
          <span className="text-emerald-600 dark:text-emerald-400">Live Production</span>
        </div>
      </div>
    ),
  },
];

export default function Projects() {
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
            <h2
              id="featured-projects-title"
              className="text-3xl sm:text-4xl md:text-5xl font-normal font-serif tracking-tight text-foreground"
            >
              Featured Projects
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              From a wide range of categories, including web apps, AI, mobile and desktop.
            </p>
          </div>

          {/* Action Link */}
          <div className="flex items-center gap-3 self-start md:self-end">
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
          {FEATURED_PROJECTS.map((project, index) => (
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

                  {/* Actions - single external button */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Repository for ${project.title}`}
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
                    {project.year && (
                      <span className="font-mono text-xs text-muted-foreground shrink-0">
                        {project.year}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
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
