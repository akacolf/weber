import CodeTerminal from "@/components/CodeTerminal";

export default function Home() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 text-center">
        {/* Terminal Component */}
        <div className="w-full text-left">
          <CodeTerminal />
        </div>
      </div>
    </main>
  );
}
