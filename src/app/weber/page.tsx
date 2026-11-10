import type { Metadata } from "next";
import WeberChat from "@/components/WeberChat";

export const metadata: Metadata = {
  title: "Weber",
  description:
    "Interactive model serving interface for Weber — a specialized AI model trained for general purpose chatting.",
};

export default function WeberPage() {
  return (
    <main className="h-dvh max-h-dvh w-full overflow-hidden bg-background relative flex flex-col">
      <WeberChat />
    </main>
  );
}
