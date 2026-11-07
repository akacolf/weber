import type { Metadata } from "next";
import ProductsTimeline from "@/components/ProductsTimeline";

export const metadata: Metadata = {
  title: "<Products I've built>",
  description:
    "A chronological timeline of products, AI agents, developer tools, and decentralized applications built by Colf (Khalid Al Shareef) from 2024 to present.",
};

export default function ProductsPage() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden">
      <ProductsTimeline />
    </main>
  );
}
