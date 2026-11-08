import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "<About me>",
  description:
    "Bio, background, and story of Khalid Al Shareef (Colf) — AI Engineer, Full-Stack Developer, and Founder at Anaxonic.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-foreground/[0.02] dark:bg-white/[0.02] blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-16">
        {/* Hero Introduction */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-serif leading-[1.1]">
            Hey, I&apos;m{" "}
            <span className="text-lime-600 dark:text-lime-400">
              Khalid Al Shareef
            </span>
            .
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Also known online as <span className="text-foreground font-mono font-medium">Colf</span> or{" "}
            <a
              href="https://github.com/akacolf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-mono font-medium underline underline-offset-4 decoration-muted-foreground/60 hover:decoration-foreground transition-colors"
            >
              @akacolf
            </a>. I build and ship
            AI-powered software, agentic workflows, consumer applications, and developer tools.
          </p>
        </div>

        {/* Narrative & Background */}
        <div className="space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
          <Card className="p-6 sm:p-8 rounded-2xl border-border/60 bg-card/60 backdrop-blur-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-serif">
              The <span className="text-lime-600 dark:text-lime-400">Journey</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              My engineering journey began with the fundamentals—studying Electrical &amp; Electronics
              Engineering at the University of Gaziantep. Diving deep into linear algebra, differential
              equations, an Introduction to AI course, embedded systems, microcontrollers, and low-level C++ gave me a first-principles
              foundation for how hardware and computing truly operate.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              That obsession with building translated directly into modern software engineering. I founded{" "}
              <strong className="text-foreground">Anaxonic</strong> to lead the development of AI-powered
              software products, architecting end-to-end applications across AI, web, mobile, and agentic
              systems.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Along the way, I built and shipped{" "}
              <a
                href="https://github.com/akacolf/quantum-club-webapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-semibold underline underline-offset-4 decoration-muted-foreground/60 hover:decoration-foreground transition-colors"
              >
                Quantum Club
              </a>
              , a Web3 super app that scaled to over 3,000 users, and engineered a lot of projects.
            </p>
          </Card>
        </div>

        {/* What I Focus On */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-foreground/70" />
            Core Focus Areas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-border/60 bg-secondary/15 space-y-2">
              <h3 className="font-semibold text-foreground text-sm font-serif">
                Autonomous &amp; Agentic AI
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Building multi-agent systems, LLM evaluation harnesses, voice assistants, and compound workflows using Google Gemini, PyTorch, and n8n. I also train models primarily via transformers.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/60 bg-secondary/15 space-y-2">
              <h3 className="font-semibold text-foreground text-sm font-serif">
                Full-Stack Architecture
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Crafting reactive web and mobile experiences with Next.js, React Native, TypeScript, Tailwind CSS, and resilient serverless backends.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/60 bg-secondary/15 space-y-2">
              <h3 className="font-semibold text-foreground text-sm font-serif">
                Decentralized Systems
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Developing smart contracts, Web3 applications, and onchain tooling on TON and Ethereum, promoting verifiable ownership and sovereign user data.
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <section id="gallery" className="space-y-4 pt-6 border-t border-border/50 scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-serif tracking-tight">
            Gallery
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            Coming sooner than you expect.
          </p>
        </section>
      </div>
    </main>
  );
}
