import CodeTerminal from "@/components/CodeTerminal";

export default function Home() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-white/[0.02] blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
        {/* Editorial Greeting Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground font-serif">
            Nice to meet you.
          </h1>
        </div>

        {/* Real Code Terminal Window */}
        <div className="w-full">
          <CodeTerminal />
        </div>
      </div>
    </main>
  );
}
