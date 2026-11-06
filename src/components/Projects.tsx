"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface ProjectLink {
  label: string;
  url: string;
}

interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  badges?: string[];
  year?: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  links?: ProjectLink[];
  renderPreview: () => React.ReactNode;
}

const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "quantum-club",
    title: "Quantum Club",
    domain: "Blockchain • AI",
    badges: ["Blockchain • Web3 • AI", "Webapp"],
    year: "2024",
    description:
      "Web3 super app that combined DeFi, social, and AI on TON. Scaled to 3000 users and counting and received a grant from STON.fi.",
    tags: ["TypeScript", "JavaScript", "Next.js", "Tailwind CSS"],
    githubUrl: "https://github.com/akacolf/quantum-club-webapp",
    renderPreview: () => (
      <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-border/60 bg-black flex items-center justify-center group-hover:border-foreground/20 transition-all duration-300">
        <Image
          src="/projects/quantumclub.png"
          alt="Quantum Club banner"
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
    ),
  },
  {
    id: "jarvis-wallet",
    title: "Jarvis Wallet",
    domain: "Voice Agent • AI",
    badges: ["Voice Agent • AI", "Blockchain • Web3", "Webapp"],
    year: "2026",
    description:
      "Jarvis Wallet enables agentic execution capabilities by voice. You can swap and stake your crypto via voice commands and interact with your agent about anything related to your assets. You can chat with or share your requests with Jarvis within the chat interface.\n\nBuilt during the STON.fi hackathon cohort 1.",
    tags: ["TypeScript", "Next.js", "Google Generative AI", "Google TTS", "n8n"],
    githubUrl: "https://github.com/akacolf/jarvis-wallet",
    renderPreview: () => (
      <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-border/60 bg-black flex items-center justify-center group-hover:border-foreground/20 transition-all duration-300">
        <Image
          src="/projects/jarviswallet.png"
          alt="Jarvis Wallet banner"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    ),
  },
  {
    id: "codeus",
    title: "Codeus",
    domain: "Developer Tools",
    badges: ["Dev Tools • AI", "CLI • App • API"],
    year: "2026",
    description:
      "The Codeus CLI was built as a dev tool to empower onchain development workflows alongside agentic software development. Major blockchains are connected via MCP servers and the agent verifies smart contracts.\n\nBuilt during the STON.fi hackathon cohort 2.",
    tags: ["TypeScript", "Rust"],
    links: [
      { label: "Codeus CLI", url: "https://github.com/akacolf/codeus-cli" },
      { label: "Codeus App", url: "https://github.com/akacolf/codeus-app" },
      { label: "Codeus API", url: "https://github.com/akacolf/codeus-api" },
    ],
    renderPreview: () => (
      <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-border/60 bg-black flex items-center justify-center group-hover:border-foreground/20 transition-all duration-300">
        <Image
          src="/projects/codeuscli.png"
          alt="Codeus CLI banner"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
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
              Some of what I&apos;ve built. From a wide range of categories, including web apps, AI, mobile, and desktop.
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
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                    <span className="font-mono text-muted-foreground/40 text-xs">/</span>
                    {(project.badges && project.badges.length > 0
                      ? project.badges
                      : [project.domain]
                    ).map((badge) => (
                      <Badge
                        key={badge}
                        variant="outline"
                        className="rounded-full text-[10px] font-mono border-border/60 bg-background/50 text-muted-foreground"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions - direct link or dropdown menu */}
                  <div className="flex items-center gap-1.5">
                    {project.links && project.links.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Repositories for ${project.title}`}
                              className="rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-48 p-1.5">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 px-2 py-1">
                              Repositories
                            </DropdownMenuLabel>
                            {project.links.map((link) => (
                              <DropdownMenuItem
                                key={link.url}
                                onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
                                className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer rounded-md transition-colors"
                              >
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-between w-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>{link.label}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                                </a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : project.githubUrl ? (
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
                    ) : null}
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

                  <div className="space-y-2">
                    {project.description.split("\n\n").map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
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
      </div>
    </section>
  );
}

export { Projects as FeaturedProjects };
