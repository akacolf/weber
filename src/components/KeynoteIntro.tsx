"use client";

import React, { useEffect, useState, useCallback } from "react";

export default function KeynoteIntro() {
  const [phase, setPhase] = useState<"slide1" | "slide2" | "exit" | "done">("slide1");
  const [progress, setProgress] = useState(0);

  const finishIntro = useCallback(() => {
    setPhase("exit");
    const timer = setTimeout(() => {
      setPhase("done");
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Clear any legacy storage key
    try {
      sessionStorage.removeItem("colf_keynote_intro_seen");
    } catch {
      // Ignore storage errors in private browsing
    }

    // Check if explicitly requested to skip intro via URL query (?skipIntro=true)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("skipIntro") === "true") {
        setPhase("done");
        return;
      }
    } catch {
      // Proceed if search params unavailable
    }

    // Trigger smooth 6-second timer line progress animation on mount
    const animFrame = requestAnimationFrame(() => {
      setProgress(100);
    });

    // Phase 1 is active on mount ("Hi I'm Colf.") for 3 seconds (3000ms)
    const t1 = setTimeout(() => {
      setPhase("slide2");
    }, 3000);

    // Phase 2 ("Awesome meeting you.") lasts for 3 seconds, then transitions to exit at 6000ms
    const t2 = setTimeout(() => {
      finishIntro();
    }, 6000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [finishIntro]);

  if (phase === "done") {
    return null;
  }

  const isExiting = phase === "exit";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome greeting"
      data-testid="keynote-intro-overlay"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-out select-none cursor-default ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Main Keynote Content Container (Pure black backdrop, no light behind texts) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Slide 1: "Hi I'm Colf." */}
        <div
          data-testid="keynote-greeting-1"
          className={`transition-all duration-700 ease-out transform ${
            phase === "slide1"
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-4 pointer-events-none absolute inset-0"
          }`}
        >
          <div className="inline-block">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight font-serif text-white">
              Hi I&apos;m{" "}
              <span className="font-medium text-white">
                Colf.
              </span>
            </h2>
          </div>
        </div>

        {/* Slide 2: "Awesome meeting you." */}
        <div
          data-testid="keynote-greeting-2"
          className={`transition-all duration-700 ease-out transform ${
            phase === "slide2"
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none absolute inset-0"
          }`}
        >
          <div className="inline-block">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight font-serif text-white">
              Awesome meeting you.
            </h2>
          </div>
        </div>
      </div>

      {/* Minimalist Wait Timer Line (just the timer line, no text) */}
      <div
        data-testid="keynote-timer"
        className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-[2px] bg-white/10 rounded-full overflow-hidden pointer-events-none"
      >
        <div
          data-testid="keynote-timer-line"
          className="h-full bg-white/40 rounded-full transition-all duration-[6000ms] ease-linear min-w-[2px]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
