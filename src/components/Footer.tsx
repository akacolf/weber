"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FOOTER_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About me", href: "/about" },
  { label: "Products I've built", href: "/products" },
  { label: "My resume/cv", href: "/resume" },
  { label: "Contact me", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/akacolf" },
  { label: "X / Twitter", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@portfolio.design" },
];

const CURRENT_YEAR = 2026;

export default function Footer() {
  const pathname = usePathname();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      aria-label="Site Footer"
      className="w-full border-t border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center">
              <Logo />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Creative Developer &amp; Technologist crafting performant digital
              experiences, thoughtful interfaces, and resilient web architectures.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for selected projects</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/80 font-semibold select-none">
              Navigation
            </h3>
            <nav aria-label="Footer Navigation" className="flex flex-col gap-2.5">
              {FOOTER_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors duration-150 select-none w-fit",
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Connect / Social Links */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/80 font-semibold select-none">
              Connect
            </h3>
            <div className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 group w-fit select-none"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-Footer Row */}
        <div className="border-t border-border/40 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="select-none text-center sm:text-left">
            &copy; {CURRENT_YEAR} Khalid Al Shareef. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="hidden md:inline select-none text-muted-foreground/60">
              Crafted with Next.js &amp; Libre Baskerville
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 select-none"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
