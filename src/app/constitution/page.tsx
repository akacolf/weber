import type { Metadata } from "next";
import ConstitutionView from "@/components/ConstitutionView";

export const metadata: Metadata = {
  title: "<My constitution>",
  description:
    "The foundational principles, engineering philosophy, and personal operating code of Khalid Al Shareef (Colf).",
};

export default function ConstitutionPage() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-foreground/[0.02] dark:bg-white/[0.02] blur-[140px] rounded-full pointer-events-none -z-10" />

      <ConstitutionView />
    </main>
  );
}
