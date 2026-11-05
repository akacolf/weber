import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume & CV — Khalid Al Shareef",
  description: "Professional background, skills, roles, and career journey of Khalid Al Shareef.",
};

export default function ResumePage() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-secondary text-muted-foreground border border-border/40">
          Section • 03
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          My resume/cv
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed pt-2">
          Experience, technical proficiencies, education, and credentials spanning modern full-stack development and system engineering.
        </p>
      </div>
    </main>
  );
}
