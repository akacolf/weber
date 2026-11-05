"use client";

import React from "react";
import Link from "next/link";
import LiquidLogo from "@/components/ui/LiquidLogo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/50 border-b border-border/40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <LiquidLogo size={38} />
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight group-hover:text-primary transition-colors">
              Portfolio
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              v2.0 • WebGL
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="#projects"
            className="hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <Link
            href="#experience"
            className="hover:text-foreground transition-colors"
          >
            Experience
          </Link>
          <Link
            href="#skills"
            className="hover:text-foreground transition-colors"
          >
            Skills
          </Link>
          <Link
            href="#contact"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for hire
          </Badge>

          <Link
            href="#contact"
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full shadow-sm hover:shadow-cyan-500/20"
            )}
          >
            Let&apos;s Talk
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
