import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import ShaderGradientBackground from "@/components/canvas/ShaderGradientBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen text-foreground bg-background selection:bg-sky-500/30 selection:text-sky-200">
      {/* Background Animated Shader */}
      <ShaderGradientBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col">
        <Hero />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-border/40 py-8 text-center text-xs text-muted-foreground font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 • Designed with React Three Fiber, Liquid Glass &amp; Shadcn</p>
          <p className="text-muted-foreground/80">Built with Antigravity Skills &amp; Playwright Verified</p>
        </div>
      </footer>
    </div>
  );
}
