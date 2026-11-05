"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 select-none transition-transform duration-200 active:scale-95 ${className}`}
      aria-label="Khalid Al Shareef - Home"
    >
      {/* Visual Symbol / Monogram Mark */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800/80 via-neutral-900/90 to-black/90 p-[1px] border border-white/10 shadow-lg shadow-black/40 group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10 transition-all duration-300">
        {/* Glow ambient background */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-5 h-5 transform group-hover:scale-105 transition-transform duration-300"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logo-grad-primary" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#818cf8" />
              <stop offset="1" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="logo-grad-secondary" x1="28" y1="4" x2="4" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="1" stopColor="#a855f7" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Abstract faceted emblem */}
          <path
            d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z"
            stroke="url(#logo-grad-primary)"
            strokeWidth="1.75"
            strokeLinejoin="round"
            className="opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <path
            d="M16 3V16M27 22.5L16 16M5 22.5L16 16"
            stroke="url(#logo-grad-secondary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="2.5" fill="url(#logo-grad-primary)" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <span className="font-semibold text-sm tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
        Khalid Al Shareef
      </span>
    </Link>
  );
}
