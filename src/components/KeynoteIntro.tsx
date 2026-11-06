"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

export default function KeynoteIntro() {
  const [phase, setPhase] = useState<"loading" | "slide1" | "slide2" | "exit" | "done">("loading");

  const finishIntro = useCallback(() => {
    setPhase("exit");
    try {
      sessionStorage.setItem("colf_keynote_intro_seen", "true");
    } catch {
      // Ignore storage errors in private browsing
    }
    const timer = setTimeout(() => {
      setPhase("done");
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if intro has already been shown in this session
    try {
      const alreadySeen = sessionStorage.getItem("colf_keynote_intro_seen");
      const urlParams = new URLSearchParams(window.location.search);
      const forceIntro = urlParams.get("intro") === "true";
      const skipIntro = urlParams.get("skipIntro") === "true";

      if (skipIntro || (alreadySeen && !forceIntro)) {
        setPhase("done");
        return;
      }
    } catch {
      // Proceed if storage unavailable
    }

    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    // Start Phase 1: "Hi I'm Colf."
    setPhase("slide1");

    // Transition to Phase 2: "Awesome meeting you." at 1400ms
    const t1 = setTimeout(() => {
      setPhase("slide2");
    }, 1400);

    // Transition to Exit fade at 2800ms
    const t2 = setTimeout(() => {
      finishIntro();
    }, 2800);

    // Keyboard listener for quick skip (Escape or Space)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        finishIntro();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [finishIntro]);

  if (phase === "loading" || phase === "done") {
    return null;
  }

  const isExiting = phase === "exit";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome greeting"
      data-testid="keynote-intro-overlay"
      onClick={finishIntro}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-out select-none cursor-pointer ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Cinematic Keynote Background Atmospheric Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Central Spotlight Beam */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-sky-500/10 via-white/15 to-indigo-500/10 blur-[130px] rounded-full" />
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black_90%)]" />
      </div>

      {/* Skip Button */}
      <button
        type="button"
        data-testid="skip-intro-btn"
        onClick={(e) => {
          e.stopPropagation();
          finishIntro();
        }}
        aria-label="Skip introduction"
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-[10000] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer"
      >
        <span>Skip</span>
        <ArrowRight className="w-3 h-3" />
      </button>

      {/* Main Keynote Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Slide 1: "Hi I'm Colf." */}
        <div
          data-testid="keynote-greeting-1"
          className={`transition-all duration-700 ease-out transform ${
            phase === "slide1"
              ? "opacity-100 scale-100 translate-y-0 blur-0"
              : "opacity-0 scale-95 -translate-y-4 blur-sm pointer-events-none absolute inset-0"
          }`}
        >
          <div className="inline-block">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight font-serif text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]">
              Hi I&apos;m{" "}
              <span className="relative inline-block font-medium bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]">
                Colf.
              </span>
            </h2>
            <div className="mt-4 mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>

        {/* Slide 2: "Awesome meeting you." */}
        <div
          data-testid="keynote-greeting-2"
          className={`transition-all duration-700 ease-out transform ${
            phase === "slide2"
              ? "opacity-100 scale-100 translate-y-0 blur-0"
              : "opacity-0 scale-95 translate-y-4 blur-sm pointer-events-none absolute inset-0"
          }`}
        >
          <div className="inline-block">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight font-serif text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]">
              Awesome meeting you.
            </h2>
            <div className="mt-4 mx-auto w-32 h-[1px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Subtle bottom hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono tracking-widest uppercase pointer-events-none">
        Click or press Esc to enter
      </div>
    </div>
  );
}
