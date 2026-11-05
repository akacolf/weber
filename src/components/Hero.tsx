"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import LiquidLogo from "@/components/ui/LiquidLogo";
import { ArrowRight, Code2, Layers, Sparkles, Terminal } from "lucide-react";

// Safe dynamic import for 3D R3F Canvas
const HeroScene3D = dynamic(() => import("@/components/canvas/HeroScene3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] sm:h-[480px] lg:h-[540px] flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border border-sky-500/20 animate-spin border-t-sky-400" />
    </div>
  ),
});

export default function Hero() {
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
                Next.js 16 • React Three Fiber • Shader FX
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
              Crafting fluid{" "}
              <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                digital products
              </span>{" "}
              &amp; interactive 3D web.
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Full-stack software engineer &amp; creative technologist. Merging
              strict systems architecture with cutting-edge WebGL, liquid shaders,
              and tactile user interfaces.
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
                <p className="text-2xl font-bold font-mono text-foreground">60 FPS</p>
                <p className="text-xs text-muted-foreground">WebGL Performance</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Accessible Standards</p>
              </div>
            </div>
          </div>

          {/* Right 3D Visual Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient liquid backdrop halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 via-violet-500/20 to-pink-500/20 rounded-full blur-3xl -z-10" />

            <div className="relative w-full">
              <HeroScene3D />

              {/* Floating Interactive Liquid Logo pill */}
              <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-background/70 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-xl">
                <LiquidLogo size={44} />
                <div className="pr-2">
                  <p className="text-xs font-semibold leading-tight">Liquid Logo</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Molten Reflection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
