import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products I've Built — Khalid Al Shareef",
  description: "Explore products, web applications, and tools built by Khalid Al Shareef.",
};

export default function ProductsPage() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-secondary text-muted-foreground border border-border/40">
          Section • 02
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Products I&apos;ve built
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed pt-2">
          A showcase of applications, interactive web experiences, and developer tools designed with precision and care.
        </p>
      </div>
    </main>
  );
}
