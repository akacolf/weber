import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 flex flex-col justify-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-secondary text-muted-foreground border border-border/40">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Khalid Al Shareef • Portfolio
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
          Building thoughtful software, products &amp; systems.
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Welcome to my personal portfolio. Explore my background, see products I&apos;ve built, review my experience, or get in touch.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            About me
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 transition-colors"
          >
            Products I&apos;ve built
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 transition-colors"
          >
            My resume/cv
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 transition-colors"
          >
            Contact me
          </Link>
        </div>
      </div>
    </main>
  );
}
