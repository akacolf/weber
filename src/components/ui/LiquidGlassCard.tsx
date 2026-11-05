"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  refractIntensity?: number;
}

export default function LiquidGlassCard({
  children,
  className,
  glowColor = "rgba(56, 189, 248, 0.15)",
  refractIntensity = 12,
  ...props
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Dynamically attempt initializing liquid-glass-js if available in browser
    let glassInstance: any = null;
    let isMounted = true;

    async function initGlass() {
      try {
        const { LiquidGlass } = await import("liquid-glass-js");
        if (!isMounted || !cardRef.current) return;

        // Custom lens overlay
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          glassInstance = new LiquidGlass({
            width: rect.width,
            height: rect.height,
            radius: 16,
            scale: refractIntensity,
            depth: 24,
            curvature: 3.5,
            convexity: 0.8,
            chroma: 1.2,
            blur: 12,
            glow: 0.3,
            edge: 0.6,
            specAngle: 45,
            draggable: false,
          });
        }
      } catch (err) {
        // Fallback to CSS glassmorphism
      }
    }

    initGlass();

    return () => {
      isMounted = false;
      if (glassInstance && typeof glassInstance.destroy === "function") {
        glassInstance.destroy();
      }
    };
  }, [refractIntensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-2xl overflow-hidden p-6 transition-all duration-300",
        "bg-neutral-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]",
        "hover:border-white/25 hover:shadow-[0_12px_48px_0_rgba(56,189,248,0.15)]",
        className
      )}
      {...props}
    >
      {/* Specular glare follower */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 60%)`,
        }}
      />

      {/* Glass bevel top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
