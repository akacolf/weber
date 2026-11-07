"use client";

import React, { useEffect, useState, useCallback, useRef, useSyncExternalStore } from "react";
import { useStore } from "@tanstack/react-store";
import { introStore, markIntroAsPlayed } from "@/lib/introStore";

const emptySubscribe = () => () => {};

const shouldSkipIntro = (hasPlayed: boolean): boolean => {
  if (hasPlayed) return true;
  if (typeof window !== "undefined") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("skipIntro") === "true") {
        return true;
      }
    } catch {
      // Proceed if search params unavailable
    }
  }
  return false;
};

export default function KeynoteIntro() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const hasPlayed = useStore(introStore, (state) => state.hasPlayed);
  const skip = shouldSkipIntro(hasPlayed);
  const [phase, setPhase] = useState<"slide1" | "slide2" | "exit" | "done">(() =>
    skip ? "done" : "slide1"
  );
  const [progress, setProgress] = useState(0);
  const hasFinishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    markIntroAsPlayed();
    setPhase("exit");
    const timer = setTimeout(() => {
      setPhase("done");
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || skip || hasPlayed) {
      return;
    }

    // Trigger smooth 4-second timer line progress animation on mount
    const animFrame = requestAnimationFrame(() => {
      setProgress(100);
    });

    // Phase 1 is active on mount ("Hi I'm Colf.") for 2 seconds (2000ms)
    const t1 = setTimeout(() => {
      setPhase("slide2");
    }, 2000);

    // Phase 2 ("Awesome meeting you.") lasts 2 seconds, then transitions to exit at 4000ms
    const t2 = setTimeout(() => {
      finishIntro();
    }, 4000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mounted, skip, hasPlayed, finishIntro]);

  if (!mounted || skip || hasPlayed || phase === "done") {
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
              <span className="font-medium text-lime-400 dark:text-lime-400">
                Colf
              </span>
              .
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
              Awesome meeting{" "}
              <span className="font-medium text-lime-400 dark:text-lime-400">
                you
              </span>
              .
            </h2>
          </div>
        </div>
      </div>

      {/* Minimalist Wait Timer Line */}
      <div
        data-testid="keynote-timer"
        className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-[2px] bg-white/10 rounded-full overflow-hidden pointer-events-none"
      >
        <div
          data-testid="keynote-timer-line"
          className="h-full bg-white/40 rounded-full transition-all duration-[4000ms] ease-linear min-w-[2px]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
