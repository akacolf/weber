import type { Metadata } from "next";
import { Libre_Baskerville, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Developer & Technologist — Portfolio",
  description:
    "Personal portfolio crafted with Next.js 16, TypeScript, Tailwind CSS, and Shadcn UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className={`${libreBaskerville.className} min-h-full flex flex-col bg-background text-foreground`}>
        <TooltipProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
