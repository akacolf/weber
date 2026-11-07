"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import {
  motion,
  AnimatePresence,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import { useStore } from "@tanstack/react-store";
import { introStore } from "@/lib/introStore";

const emptySubscribe = () => () => {};

export interface GreetingItem {
  word: string;
  lang: string;
  label: string;
}

/**
 * Global Multilingual Welcome Greetings mirroring Apple's iconic "Hello" language suite
 * covering all major world language families with correct BCP 47 language tags.
 */
export const GREETINGS: GreetingItem[] = [
  { word: "Welcome", lang: "en", label: "English" },
  { word: "Bienvenido", lang: "es", label: "Spanish" },
  { word: "Bienvenue", lang: "fr", label: "French" },
  { word: "ようこそ", lang: "ja", label: "Japanese" },
  { word: "Willkommen", lang: "de", label: "German" },
  { word: "مرحباً", lang: "ar", label: "Arabic" },
  { word: "Benvenuto", lang: "it", label: "Italian" },
  { word: "Bem-vindo", lang: "pt", label: "Portuguese" },
  { word: "欢迎", lang: "zh-CN", label: "Chinese (Simplified)" },
  { word: "歡迎", lang: "zh-TW", label: "Chinese (Traditional)" },
  { word: "Welkom", lang: "nl", label: "Dutch" },
  { word: "Välkommen", lang: "sv", label: "Swedish" },
  { word: "환영합니다", lang: "ko", label: "Korean" },
  { word: "Hoş geldiniz", lang: "tr", label: "Turkish" },
  { word: "Witaj", lang: "pl", label: "Polish" },
  { word: "Velkommen", lang: "da", label: "Danish" },
  { word: "Tervetuloa", lang: "fi", label: "Finnish" },
  { word: "Velkommen", lang: "no", label: "Norwegian" },
  { word: "Vítejte", lang: "cs", label: "Czech" },
  { word: "Üdvözöljük", lang: "hu", label: "Hungarian" },
  { word: "Bun venit", lang: "ro", label: "Romanian" },
  { word: "Καλώς ήρθατε", lang: "el", label: "Greek" },
  { word: "Добро пожаловать", lang: "ru", label: "Russian" },
  { word: "Ласкаво просимо", lang: "uk", label: "Ukrainian" },
  { word: "स्वागत है", lang: "hi", label: "Hindi" },
  { word: "ברוכים הבאים", lang: "he", label: "Hebrew" },
  { word: "Chào mừng", lang: "vi", label: "Vietnamese" },
  { word: "ยินดีต้อนรับ", lang: "th", label: "Thai" },
  { word: "Selamat datang", lang: "id", label: "Indonesian" },
  { word: "Karibu", lang: "sw", label: "Swahili" },
  { word: "Maligayang pagdating", lang: "tl", label: "Tagalog" },
];

interface AnimatedGreetingWordProps {
  greeting: GreetingItem;
  shouldReduceMotion: boolean | null;
  isIntroActive: boolean;
}

function AnimatedGreetingWord({
  greeting,
  shouldReduceMotion,
  isIntroActive,
}: AnimatedGreetingWordProps) {
  const isPresent = useIsPresent();

  // If user prefers reduced motion, crossfade opacity smoothly
  if (shouldReduceMotion) {
    return (
      <motion.span
        suppressHydrationWarning
        data-testid={isPresent ? "rotating-welcome-word" : undefined}
        lang={greeting.lang}
        aria-hidden={!isPresent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="text-lime-600 dark:text-lime-400 font-medium inline-block whitespace-nowrap px-1"
      >
        {greeting.word}
      </motion.span>
    );
  }

  return (
    <motion.span
      suppressHydrationWarning
      data-testid={isPresent ? "rotating-welcome-word" : undefined}
      lang={greeting.lang}
      aria-hidden={!isPresent}
      initial={{
        y: "115%",
        opacity: 0,
        filter: "blur(6px)",
        scale: 0.95,
      }}
      animate={
        isIntroActive
          ? {
              y: "115%",
              opacity: 0,
              filter: "blur(6px)",
              scale: 0.95,
            }
          : {
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
            }
      }
      exit={{
        y: "-115%",
        opacity: 0,
        filter: "blur(6px)",
        scale: 0.95,
      }}
      transition={{
        y: { type: "spring", stiffness: 220, damping: 24, mass: 0.75 },
        opacity: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }}
      className="text-lime-600 dark:text-lime-400 font-medium inline-block whitespace-nowrap px-1 will-change-transform pb-1"
    >
      {greeting.word}
    </motion.span>
  );
}

export default function RotatingWelcome() {
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // SSR-safe mount flag to prevent hydration mismatches
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const widthsCache = useRef<number[]>([]);

  const systemReducedMotion = useReducedMotion();
  // Ensure reduced motion is strictly false on SSR and initial hydration render
  // to avoid style mismatches when user has OS reduce-motion enabled
  const shouldReduceMotion = mounted ? !!systemReducedMotion : false;
  const hasPlayed = useStore(introStore, (state) => state.hasPlayed);

  // Check if keynote intro overlay is currently active or if timer is paused for testing
  const isIntroActive = (() => {
    if (!mounted) return false;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("skipIntro") === "true") return false;
    } catch {
      // ignore
    }
    return !hasPlayed;
  })();

  const isTimerPaused = (() => {
    if (!mounted) return false;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("pauseTimer") === "true") return true;
    } catch {
      // ignore
    }
    return false;
  })();

  const currentIndexRef = useRef(index);
  useEffect(() => {
    currentIndexRef.current = index;
  }, [index]);

  const measureAllWidths = useCallback(() => {
    if (!measureRef.current) return;
    const computed: number[] = [];
    for (let i = 0; i < GREETINGS.length; i++) {
      measureRef.current.setAttribute("lang", GREETINGS[i].lang);
      measureRef.current.textContent = GREETINGS[i].word;
      const w = measureRef.current.getBoundingClientRect().width;
      // Extra 12px safety clearance ensures italic swashes, diacritics, and subpixel rendering are never cramped
      computed[i] = Math.ceil(w) + 12;
    }
    widthsCache.current = computed;
    const currentIdx = currentIndexRef.current;
    if (computed[currentIdx]) {
      setContainerWidth(computed[currentIdx]);
    }
  }, []);

  const measureCurrentWidth = useCallback((greetingIndex: number) => {
    if (widthsCache.current[greetingIndex]) {
      setContainerWidth(widthsCache.current[greetingIndex]);
      return;
    }
    if (measureRef.current) {
      measureRef.current.setAttribute("lang", GREETINGS[greetingIndex].lang);
      measureRef.current.textContent = GREETINGS[greetingIndex].word;
      const width = measureRef.current.getBoundingClientRect().width;
      if (width > 0) {
        const fullWidth = Math.ceil(width) + 12;
        widthsCache.current[greetingIndex] = fullWidth;
        setContainerWidth(fullWidth);
      }
    }
  }, []);

  // Synchronize container width before paint to prevent layout shifts
  useLayoutEffect(() => {
    if (widthsCache.current.length === 0) {
      measureAllWidths();
    } else if (widthsCache.current[index]) {
      setContainerWidth(widthsCache.current[index]);
    } else {
      measureCurrentWidth(index);
    }
  }, [index, measureAllWidths, measureCurrentWidth]);

  // Re-measure accurately once document web fonts are fully loaded
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        measureAllWidths();
      });
    }
  }, [measureAllWidths]);

  // Responsive re-measure on window resize
  useEffect(() => {
    const handleResize = () => {
      measureAllWidths();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureAllWidths]);

  // Multilingual rotation interval
  useEffect(() => {
    if (isIntroActive || isHovered || isTimerPaused || !mounted) return;

    const intervalTime = 2200; // Apple keynote dwell time between language rotations

    const timer = setInterval(() => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "hidden"
      ) {
        return;
      }
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isIntroActive, isHovered, isTimerPaused, mounted]);

  const handleNextGreeting = useCallback(() => {
    setIndex((prev) => (prev + 1) % GREETINGS.length);
  }, []);

  const targetWidth = containerWidth;

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground font-serif leading-[1.2] flex flex-wrap items-baseline justify-center gap-x-[0.3em] select-none py-1">
      {/* Accessible screen-reader text for SEO and assistive technologies */}
      <span className="sr-only">Welcome to my website.</span>

      {/* Visual Animated Greeting Container */}
      <span
        aria-hidden="true"
        className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.3em]"
      >
        {/* Slot: Rotating Multilingual Greeting Word Container with generous clearance for ascenders and descenders */}
        <motion.span
          ref={containerRef}
          data-testid="rotating-welcome-container"
          onClick={handleNextGreeting}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title={`Click to rotate language (currently: ${GREETINGS[index].label})`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          animate={{
            width: targetWidth ? `${targetWidth}px` : "auto",
          }}
          transition={{
            width: mounted
              ? { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 },
            scale: { type: "spring", stiffness: 300, damping: 22 },
          }}
          className="relative inline-flex items-center justify-start align-baseline pt-2 pb-6 -mb-6 cursor-pointer select-none"
          style={{
            verticalAlign: "baseline",
            clipPath: "inset(0% -100vw 0% -100vw)",
          }}
        >
          {/* Active / Exiting Multilingual Greeting */}
          <AnimatePresence mode="popLayout" initial={false}>
            <AnimatedGreetingWord
              key={GREETINGS[index].word}
              greeting={GREETINGS[index]}
              shouldReduceMotion={shouldReduceMotion}
              isIntroActive={isIntroActive}
            />
          </AnimatePresence>

          {/* Hidden off-screen width measurer */}
          <span
            ref={measureRef}
            lang={GREETINGS[index].lang}
            className="invisible absolute pointer-events-none opacity-0 select-none text-lime-600 dark:text-lime-400 font-medium inline-block whitespace-nowrap px-1 pb-1"
            aria-hidden="true"
          >
            {GREETINGS[index].word}
          </span>
        </motion.span>

        {/* Suffix phrase: Completely unclipped (no overflow:hidden containers) ensuring letters like 'y' in 'my' are never cut off */}
        <motion.span
          data-testid="welcome-suffix"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 8, filter: "blur(4px)" }
          }
          animate={
            isIntroActive
              ? { opacity: 0, y: 8, filter: "blur(4px)" }
              : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: shouldReduceMotion ? 0 : 0.08,
          }}
          className="text-foreground inline-block align-baseline whitespace-normal"
        >
          to my website.
        </motion.span>
      </span>
    </h1>
  );
}
