"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  className = "",
  showWordmark = true,
  size = "md",
}: LogoProps) {
  const sizeConfig = {
    sm: {
      container: "w-8 h-8 rounded-lg",
      image: 24,
      imageClass: "w-6 h-6",
      text: "text-xs",
    },
    md: {
      container: "w-9 h-9 rounded-xl",
      image: 30,
      imageClass: "w-[30px] h-[30px]",
      text: "text-sm",
    },
    lg: {
      container: "w-11 h-11 rounded-2xl",
      image: 36,
      imageClass: "w-9 h-9",
      text: "text-base",
    },
  }[size];

  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 select-none transition-transform duration-200 active:scale-95 ${className}`}
      aria-label="Khalid Al Shareef - Home"
    >
      {/* Visual Symbol / Monogram Mark with the uploaded logo */}
      <div
        className={`relative flex items-center justify-center ${sizeConfig.container} bg-gradient-to-br from-neutral-800/90 via-neutral-900 to-black p-0.5 border border-white/10 shadow-lg shadow-black/40 group-hover:border-white/25 group-hover:shadow-white/5 transition-all duration-300 overflow-hidden shrink-0`}
      >
        {/* Glow ambient background on hover */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/15 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

        <Image
          src="/logo_white_transparent.svg"
          alt="Khalid Al Shareef Logo"
          width={sizeConfig.image}
          height={sizeConfig.image}
          className={`relative ${sizeConfig.imageClass} object-contain transform group-hover:scale-105 transition-transform duration-300 brightness-100`}
          priority
          unoptimized
        />
      </div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <span
          className={`font-semibold ${sizeConfig.text} tracking-tight text-foreground/90 group-hover:text-foreground transition-colors`}
        >
          Khalid Al Shareef
        </span>
      )}
    </Link>
  );
}
