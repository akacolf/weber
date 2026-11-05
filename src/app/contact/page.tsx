import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Me — Khalid Al Shareef",
  description: "Get in touch with Khalid Al Shareef for collaborations, inquiries, or opportunities.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-secondary text-muted-foreground border border-border/40">
          Section • 04
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Contact me
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed pt-2">
          Interested in working together or discussing an ambitious project? Reach out anytime.
        </p>
      </div>
    </main>
  );
}
