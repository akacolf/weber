"use client";

import React, { useRef, useState, useEffect } from "react";

interface LiquidLogoProps {
  className?: string;
  size?: number;
}

export default function LiquidLogo({ className = "", size = 64 }: LiquidLogoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setPointer({ x, y });
  };

  // Convert normalized pointer into light angles and glare
  const lightX = (pointer.x - 0.5) * 60;
  const lightY = (pointer.y - 0.5) * 60;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        setPointer({ x: 0.5, y: 0.5 });
      }}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none group ${className}`}
      aria-label="Liquid Logo Mark"
    >
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl opacity-60 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at ${pointer.x * 100}% ${
            pointer.y * 100
          }%, rgba(56, 189, 248, 0.5), rgba(168, 85, 247, 0.3), transparent 70%)`,
        }}
      />

      {/* Molten Liquid Badge Container */}
      <div className="relative w-full h-full rounded-2xl p-[1.5px] overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105 active:scale-95 shadow-2xl">
        {/* Animated chrome metallic border rim */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(${135 + lightX}deg, #ffffff 0%, #94a3b8 20%, #38bdf8 50%, #c084fc 80%, #ffffff 100%)`,
            filter: "contrast(1.3) brightness(1.2)",
          }}
        />

        {/* Liquid Core Body */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-neutral-900/90 via-black to-neutral-950 flex items-center justify-center overflow-hidden border border-white/10">
          {/* Specular Liquid Highlights */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${pointer.x * 100}% ${
                pointer.y * 100
              }%, rgba(255, 255, 255, 0.45) 0%, rgba(147, 197, 253, 0.2) 30%, transparent 60%)`,
              mixBlendMode: "overlay",
            }}
          />

          {/* Chrome Reflection Waves */}
          <div
            className="absolute -inset-full opacity-40 mix-blend-color-dodge transition-transform duration-1000 group-hover:rotate-12"
            style={{
              background: `conic-gradient(from ${lightX * 2}deg at 50% 50%, #38bdf8, #a855f7, #ec4899, #38bdf8)`,
              filter: "blur(8px)",
            }}
          />

          {/* Vector Liquid Monogram Icon */}
          <svg
            viewBox="0 0 48 48"
            className="w-3/5 h-3/5 relative z-10 transition-transform duration-500 ease-out drop-shadow-[0_2px_12px_rgba(56,189,248,0.5)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="liquidGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#bae6fd" />
                <stop offset="70%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
              <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized fluid infinity / wave monogram */}
            <path
              d="M12 24C12 18 16 14 21 17C26 20 22 28 27 31C32 34 36 30 36 24C36 18 32 14 27 17C22 20 26 28 21 31C16 34 12 30 12 24Z"
              stroke="url(#liquidGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transformOrigin: "center",
                transform: isHovered
                  ? `rotate(${lightX * 0.3}deg) scale(1.08)`
                  : "none",
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              filter="url(#liquidGlow)"
            />
            {/* Center droplet */}
            <circle
              cx={24 + lightX * 0.08}
              cy={24 + lightY * 0.08}
              r="3"
              fill="#ffffff"
              className="drop-shadow-[0_0_8px_#ffffff]"
            />
          </svg>

          {/* Glint flare */}
          <div
            className="absolute w-2 h-2 rounded-full bg-white blur-[1px] transition-all duration-300 pointer-events-none"
            style={{
              top: `${20 + pointer.y * 30}%`,
              left: `${20 + pointer.x * 30}%`,
              opacity: isHovered ? 0.9 : 0.3,
            }}
          />
        </div>
      </div>
    </div>
  );
}
