import type { Metadata } from "next";
import WeberChat from "@/components/WeberChat";

export const metadata: Metadata = {
  title: "Weber",
  description:
    "Interactive model serving interface for Weber (John Sakura 1.0) — Anaxonic's specialized AI assistant trained for onchain developers and blockchain engineers.",
};

export default function WeberPage() {
  return (
    <main className="h-dvh max-h-dvh w-full overflow-hidden bg-background relative flex flex-col">
      <WeberChat />
    </main>
  );
}
