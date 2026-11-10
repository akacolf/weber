"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelinePoint,
  TimelineHeader,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  TimelineContent,
} from "@/components/ui/timeline";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Bot,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowUpDown,
  Trophy,
  ArrowRight,
} from "lucide-react";

export interface TimelineProduct {
  id: string;
  title: string;
  year: number;
  date: string;
  dateLabel: string;
  milestone: string;
  category: "ai-agents" | "blockchain-web3" | "dev-tools";
  categoryLabel: string;
  badges: string[];
  description: string[];
  keyHighlights: string[];
  techStack: string[];
  imageSrc: string;
  imageAlt: string;
  githubUrl?: string;
  links?: { label: string; url: string }[];
  status: "active" | "completed" | "upcoming";
  award?: string;
}

export const PRODUCTS_TIMELINE: TimelineProduct[] = [
  {
    id: "codeus",
    title: "Codeus",
    year: 2026,
    date: "2026-06",
    dateLabel: "2026 • June 2026",
    milestone: "STON.fi Hackathon Cohort 2",
    category: "dev-tools",
    categoryLabel: "Developer Tools",
    badges: ["Dev Tools • AI", "CLI • App • API", "Hackathon Cohort 2"],
    description: [
      "The Codeus CLI was built as a developer tool to empower onchain development workflows alongside agentic software development.",
      "Major blockchains are connected via Model Context Protocol (MCP) servers and the agent verifies smart contracts autonomously, creating an integrated loop for modern blockchain engineering.",
    ],
    keyHighlights: [
      "Multi-chain MCP server integrations",
      "Automated smart contract verification",
      "Cross-platform CLI, Web App & API suite",
    ],
    techStack: ["TypeScript", "Rust", "MCP Protocol", "Next.js", "Node.js"],
    imageSrc: "/projects/codeuscli.png",
    imageAlt: "Codeus CLI terminal and dashboard banner",
    links: [
      { label: "Codeus CLI", url: "https://github.com/akacolf/codeus-cli" },
      { label: "Codeus App", url: "https://github.com/akacolf/codeus-app" },
      { label: "Codeus API", url: "https://github.com/akacolf/codeus-api" },
    ],
    status: "active",
    award: "STON.fi Hackathon Cohort 2",
  },
  {
    id: "jarvis-wallet",
    title: "Jarvis Wallet",
    year: 2026,
    date: "2026-04",
    dateLabel: "2026 • April 2026",
    milestone: "STON.fi Hackathon Cohort 1",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    badges: ["Voice Agent • AI", "Blockchain • Web3", "Webapp"],
    description: [
      "Jarvis Wallet enables agentic execution capabilities by voice. Users can swap and stake crypto via real-time voice commands and interact with their personalized agent about anything related to their digital assets.",
      "Featuring a dual chat & voice interface powered by Google Generative AI and low-latency text-to-speech synthesis.",
    ],
    keyHighlights: [
      "Conversational voice DeFi execution",
      "Real-time asset telemetry & swap intelligence",
      "Google GenAI + Google TTS + n8n automation pipelines",
    ],
    techStack: [
      "TypeScript",
      "Next.js",
      "Google Generative AI",
      "Google TTS",
      "n8n",
      "STON.fi SDK",
    ],
    imageSrc: "/projects/jarviswallet.png",
    imageAlt: "Jarvis Wallet voice interface and chat preview",
    githubUrl: "https://github.com/akacolf/jarvis-wallet",
    status: "active",
    award: "STON.fi Hackathon Cohort 1",
  },
  {
    id: "quantum-club",
    title: "Quantum Club",
    year: 2024,
    date: "2024-03",
    dateLabel: "2024 • Q2 2024 (March 2024)",
    milestone: "STON.fi Ecosystem Grantee",
    category: "blockchain-web3",
    categoryLabel: "Blockchain & Web3",
    badges: ["Blockchain • Web3 • AI", "Webapp", "3,000+ Users"],
    description: [
      "A Web3 super app that merged decentralized finance, social community mechanics, and AI on the TON blockchain.",
      "Scaled rapidly to 3,000+ active users and was awarded an official ecosystem grant from STON.fi for DeFi innovation on TON.",
    ],
    keyHighlights: [
      "Scaled to 3,000+ users and counting",
      "Awarded official grant from STON.fi",
      "High-performance TON Mini App & DEX aggregator",
    ],
    techStack: ["TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "TON Blockchain"],
    imageSrc: "/projects/quantumclub.png",
    imageAlt: "Quantum Club web application banner",
    githubUrl: "https://github.com/akacolf/quantum-club-webapp",
    status: "completed",
    award: "Official STON.fi Grant Awardee",
  },
];

type CategoryFilter = "all" | "ai-agents" | "blockchain-web3" | "dev-tools";
type SortOrder = "desc" | "asc";

export default function ProductsTimeline() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS_TIMELINE];
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    list.sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortOrder === "desc" ? -cmp : cmp;
    });
    return list;
  }, [activeCategory, sortOrder]);

  const categories: { key: CategoryFilter; label: string; count: number }[] = [
    { key: "all", label: "All Products", count: PRODUCTS_TIMELINE.length },
    {
      key: "ai-agents",
      label: "AI & Agents",
      count: PRODUCTS_TIMELINE.filter((p) => p.category === "ai-agents").length,
    },
    {
      key: "blockchain-web3",
      label: "Web3 & DeFi",
      count: PRODUCTS_TIMELINE.filter((p) => p.category === "blockchain-web3").length,
    },
    {
      key: "dev-tools",
      label: "Dev Tools",
      count: PRODUCTS_TIMELINE.filter((p) => p.category === "dev-tools").length,
    },
  ];

  const getProductIcon = (category: string) => {
    switch (category) {
      case "dev-tools":
        return <Terminal className="size-4 sm:size-5 text-foreground" />;
      case "ai-agents":
        return <Bot className="size-4 sm:size-5 text-foreground" />;
      case "blockchain-web3":
        return <Layers className="size-4 sm:size-5 text-foreground" />;
      default:
        return <Sparkles className="size-4 sm:size-5 text-foreground" />;
    }
  };

  return (
    <div className="w-full">
      {/* Editorial Header */}
      <section className="pt-12 sm:pt-16 pb-10 sm:pb-12 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-serif tracking-tight text-foreground mb-4">
            So far the{" "}
            <span className="text-lime-600 dark:text-lime-400 font-medium dark:drop-shadow-[0_0_20px_rgba(163,230,53,0.3)]">
              journey
            </span>
            .
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A chronological timeline of software products, agentic tools, and decentralized applications
            designed and shipped since 2024.
          </p>
        </div>
      </section>

      {/* Filter & Sort Controls */}
      <section className="sticky top-16 z-30 bg-background/85 backdrop-blur-md border-b border-border/40 py-3 sm:py-4 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div
            role="tablist"
            aria-label="Filter products by category"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer border",
                    isSelected
                      ? "bg-foreground text-background font-medium border-foreground shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-transparent"
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full",
                      isSelected
                        ? "bg-background/20 text-background"
                        : "bg-border text-muted-foreground"
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Order Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="text-xs font-mono text-muted-foreground">Order:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="font-mono text-xs gap-1.5 rounded-lg h-8 cursor-pointer border-border/70 hover:bg-muted"
              aria-label={`Sort timeline: Currently ${sortOrder === "desc" ? "Newest First" : "Oldest First"}`}
            >
              <ArrowUpDown className="size-3.5" />
              <span className="inline-flex items-center gap-1">
                {sortOrder === "desc" ? (
                  <>
                    <span>Newest (2026</span>
                    <ArrowRight className="size-3 shrink-0" />
                    <span>2024)</span>
                  </>
                ) : (
                  <>
                    <span>Oldest (2024</span>
                    <ArrowRight className="size-3 shrink-0" />
                    <span>2026)</span>
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Timeline Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl p-8">
              <p className="text-muted-foreground text-sm font-mono mb-4">
                No products found in this category.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCategory("all")}
                className="font-mono text-xs cursor-pointer"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <Timeline className="pl-1 sm:pl-2">
              {filteredProducts.map((product) => (
                <TimelineItem
                  key={product.id}
                  id={`product-${product.id}`}
                  status={product.status}
                >
                  <TimelineConnector />
                  <TimelinePoint>{getProductIcon(product.category)}</TimelinePoint>

                  <TimelineContent>
                    {/* Header: Date & Badges */}
                    <TimelineHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <TimelineTime>{product.dateLabel}</TimelineTime>
                        <span className="text-muted-foreground/40 text-xs font-mono">•</span>
                        {product.award && (
                          <Badge
                            variant="secondary"
                            className="font-mono text-[10px] bg-secondary text-secondary-foreground gap-1 border-transparent"
                          >
                            <Trophy className="size-3 text-muted-foreground" />
                            <span>{product.award}</span>
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
                        <TimelineTitle>{product.title}</TimelineTitle>

                        {/* Top Action Link */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          {product.links && product.links.length > 0 ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label={`Repositories for ${product.title}`}
                                    className="font-mono text-xs gap-1.5 rounded-lg h-7 border-border/80 hover:bg-muted cursor-pointer"
                                  >
                                    <span>Repositories</span>
                                    <ArrowUpRight className="size-3" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="end" className="w-52 p-1.5">
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 px-2 py-1">
                                    Project Repositories
                                  </DropdownMenuLabel>
                                  {product.links.map((link) => (
                                    <DropdownMenuItem
                                      key={link.url}
                                      onClick={() =>
                                        window.open(link.url, "_blank", "noopener,noreferrer")
                                      }
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
                                        <ArrowUpRight className="size-3.5 opacity-60" />
                                      </a>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : product.githubUrl ? (
                            <Link
                              href={product.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`View ${product.title} repository on GitHub`}
                              className={cn(
                                buttonVariants({ variant: "outline", size: "sm" }),
                                "font-mono text-xs gap-1.5 rounded-lg h-7 border-border/80 hover:bg-muted"
                              )}
                            >
                              <span>View Code</span>
                              <ArrowUpRight className="size-3" />
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </TimelineHeader>

                    {/* Product Card Container */}
                    <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs p-5 sm:p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-md mt-2">
                      {/* Banner Image Preview */}
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/60 bg-black mb-5 group/image">
                        <Image
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          fill
                          className={cn(
                            "transition-opacity duration-300",
                            product.id === "quantum-club"
                              ? "object-contain p-8 sm:p-12"
                              : "object-contain"
                          )}
                          sizes="(max-width: 768px) 100vw, 768px"
                        />
                      </div>

                      {/* Product Narrative */}
                      <TimelineDescription className="space-y-2 mb-4">
                        {product.description.map((para, i) => (
                          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                            {para}
                          </p>
                        ))}
                      </TimelineDescription>

                      {/* Key Highlights Bullet Points */}
                      <div className="space-y-1.5 mb-5 pt-3 border-t border-border/40">
                        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground/80 mb-2">
                          Key Achievements &amp; Architecture:
                        </div>
                        <ul className="space-y-1 text-xs text-foreground/90 font-mono">
                          {product.keyHighlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-center gap-2">
                              <span className="size-1.5 rounded-full bg-foreground/60 shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-border/40">
                        {product.techStack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="rounded-md font-mono text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground border-transparent hover:text-foreground transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </div>
      </section>
    </div>
  );
}
