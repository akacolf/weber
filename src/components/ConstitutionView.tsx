"use client";

import Image from "next/image";
import { ArrowDownRight, ScrollText } from "lucide-react";

interface Article {
  roman: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  rules: string[];
}

const ARTICLES: Article[] = [
  {
    roman: "Article I",
    num: "01",
    title: "Extreme Agency & Relentless Shipping",
    subtitle: "Bias toward action over passive consensus",
    description:
      "Ideas without execution are hallucinations. Ship early, ship frequently, and iterate with real feedback. When faced with ambiguity, take extreme ownership—never wait for permission or perfect conditions. If a wall exists, find a door; if no door exists, build one.",
    rules: [
      "When in doubt, ship a working prototype.",
      "Solve the problem end-to-end with zero handoffs.",
      "Action generates information that thinking alone cannot reveal.",
    ],
  },
  {
    roman: "Article II",
    num: "02",
    title: "Relentless Craft & Micro-Precision",
    subtitle: "Design polish is not decorative—it is respect for the user",
    description:
      "Software is human communication. If an interface lags by 50ms, a border is misaligned, or typography is sloppy, the product loses credibility. We hold interactions, latency, accessibility, and visual harmony to the highest standard of craft.",
    rules: [
      "Latency is a bug: optimize the critical render path.",
      "Typography and spacing are structural foundations, not afterthoughts.",
      "A product should feel tactile, responsive, and delightful under the fingertips.",
    ],
  },
  {
    roman: "Article III",
    num: "03",
    title: "First-Principles Engineering",
    subtitle: "Never accept an abstraction as magic",
    description:
      "Frameworks come and go; fundamental physics and computer science remain. Understand the low-level mechanics: from C++, assembly, and silicon microcontrollers to memory allocation, network roundtrips, and cryptographic primitives.",
    rules: [
      "Drill down until you hit rock-solid ground truths.",
      "Simplicity is earned through rigorous subtraction of unnecessary layers.",
      "Know how your tools work underneath before trusting them with production.",
    ],
  },
  {
    roman: "Article IV",
    num: "04",
    title: "AI-Native & Compound Leverage",
    subtitle: "Architect systems that compound with machine intelligence",
    description:
      "Treat AI not as a superficial novelty, but as a fundamental amplifier of human intellect. Build autonomous agentic workflows, deterministic evaluation harnesses, and self-reinforcing loops that transform manual labor into scalable intelligence.",
    rules: [
      "Augment every engineering loop with agentic workflows.",
      "Pair non-deterministic LLMs with deterministic verification harnesses.",
      "Design systems that become smarter and more resilient with every execution.",
    ],
  },
  {
    roman: "Article V",
    num: "05",
    title: "Sovereignty & Open Ecosystems",
    subtitle: "Empower individuals over walled gardens",
    description:
      "Build tools that respect user custody, privacy, and verifiable ownership. Champion open protocols, transparent codebases, and decentralized networks where trust is enforced by mathematics rather than centralized gatekeepers.",
    rules: [
      "Give users sovereign control over their identity and data.",
      "Contribute back to open-source foundations.",
      "Build software that remains resilient even when centralized services fail.",
    ],
  },
  {
    roman: "Article VI",
    num: "06",
    title: "The Long Game & Radical Integrity",
    subtitle: "Reputation compounds over decades",
    description:
      "Play long-term games with long-term people. True trust takes years to build and seconds to lose. Communicate with radical clarity, honor commitments, admit mistakes instantly, and build relationships that compound.",
    rules: [
      "Always prioritize durable trust over short-term convenience.",
      "Never compromise intellectual honesty or engineering ethics.",
      "Leave every codebase, community, and collaborator better than you found them.",
    ],
  },
];

export default function ConstitutionView() {
  const scrollToArticle = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-16">
      {/* Header with Constitution Icon (replaces previous text badge) */}
      <header className="text-center space-y-5">
        <div className="flex items-center justify-center text-foreground mx-auto">
          <ScrollText className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-serif">
            My <span className="text-lime-600 dark:text-lime-400">Constitution</span>
          </h1>
        </div>

        {/* Foundational Preamble Quote */}
        <div className="pt-4 max-w-2xl mx-auto">
          <blockquote className="text-base sm:text-lg text-foreground/90 font-serif leading-relaxed italic border-y border-border/60 py-6 px-4">
            &ldquo;I established these foundational principles, non-negotiables, and decision heuristics to govern all engineering craft, system architecture, and personal conduct as it&apos;s to the utmost of my willingness to craft the highest quality work there is.&rdquo;
          </blockquote>
        </div>
      </header>

      {/* Table of Articles (Quick Jump Navigation) */}
      <section className="rounded-2xl border border-border/70 bg-card/50 backdrop-blur-xs p-6 sm:p-8 space-y-6">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
            Constitution Articles
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select any article to jump directly to its foundational principles.
          </p>
        </div>

        <div className="divide-y divide-border/40">
          {ARTICLES.map((article, idx) => (
            <div key={article.num} className="py-2.5 sm:py-3">
              <button
                type="button"
                onClick={() => scrollToArticle(`article-${idx + 1}`)}
                className="w-full flex items-center justify-between text-left group gap-4 focus:outline-hidden py-1 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="font-mono text-xs sm:text-sm font-medium text-muted-foreground/80 w-6">
                    {article.num}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-semibold text-foreground group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                    {article.title}
                  </span>
                </div>
                <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/70 group-hover:text-lime-600 dark:group-hover:text-lime-400 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-150 shrink-0" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* The Full Constitution Articles (Editorial Reading Layout) */}
      <section className="space-y-16">
        {ARTICLES.map((article, idx) => (
          <article
            key={article.roman}
            id={`article-${idx + 1}`}
            className="scroll-mt-24 space-y-5"
          >
            {/* Article Heading */}
            <div className="border-b border-border/50 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight">
                {article.title}
              </h2>
            </div>

            {/* Exposition narrative */}
            <p className="text-sm sm:text-base text-foreground/85 leading-relaxed font-sans pt-1">
              {article.description}
            </p>

            {/* Numbered Sections / Directives */}
            <div className="pt-2 pl-4 sm:pl-6 border-l-2 border-border/70 space-y-3">
              {article.rules.map((rule, rIdx) => (
                <div
                  key={rIdx}
                  className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex items-start gap-3"
                >
                  <span className="font-mono text-xs font-semibold text-foreground shrink-0 pt-0.5">
                    {rIdx + 1}.
                  </span>
                  <span className="text-foreground/90">{rule}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Ratification & Signature */}
      <footer className="border-t border-border/60 pt-16 text-center space-y-6">
        <blockquote className="text-base sm:text-lg italic text-foreground font-serif max-w-xl mx-auto leading-relaxed">
          &ldquo;I hereby solemnly declare that I&apos;ll abide the principles of this Constitution and always seek the benefit of humanity.&rdquo;
        </blockquote>

        {/* Hand-Signed Document Block */}
        <div className="pt-6 pb-2 flex justify-center">
          <div className="inline-flex flex-col items-center">
            {/* Signature image positioned right over the baseline */}
            <div className="relative h-20 sm:h-24 w-52 sm:w-60 flex items-end justify-center select-none pointer-events-none -mb-3">
              {/* Dark mode: crisp white signature on dark background */}
              <Image
                src="/mysignature_white.png"
                alt="Khalid Al Shareef signature"
                width={260}
                height={145}
                className="hidden dark:block w-auto h-full max-h-20 sm:max-h-24 object-contain"
                priority
              />
              {/* Light mode: crisp black signature on light background */}
              <Image
                src="/mysignature.png"
                alt="Khalid Al Shareef signature"
                width={260}
                height={145}
                className="block dark:hidden w-auto h-full max-h-20 sm:max-h-24 object-contain"
                priority
              />
            </div>

            {/* The line on which the signature rests */}
            <div className="w-56 sm:w-64 h-[1.5px] bg-foreground/35" />

            {/* Printed name and title below the signing line */}
            <p className="text-sm font-serif font-semibold text-foreground mt-3">
              Khalid Al Shareef (Colf)
            </p>
            <p className="text-xs font-mono text-muted-foreground/75 tracking-wider uppercase mt-0.5">
              Full-Stack &amp; AI Engineer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
