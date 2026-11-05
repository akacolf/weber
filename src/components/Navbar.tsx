"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { label: "About me", href: "/about" },
  { label: "Products I've built", href: "/products" },
  { label: "My resume/cv", href: "/resume" },
  { label: "Contact me", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/40 backdrop-blur-sm"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 select-none",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Status Badge & Quick CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Badge
            variant="outline"
            className="hidden lg:inline-flex items-center gap-1.5 py-1 px-2.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs font-mono"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for projects
          </Badge>

          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full shadow-sm hover:shadow-cyan-500/20 text-xs font-medium px-4"
            )}
          >
            Get in touch
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "rounded-lg text-muted-foreground hover:text-foreground"
              )}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="text-left pb-6 border-b border-border/40">
                  <SheetTitle className="flex items-center gap-2 text-base font-semibold">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Navigation
                  </SheetTitle>
                </SheetHeader>

                <nav aria-label="Mobile Navigation" className="flex flex-col gap-1.5 pt-6">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between",
                          isActive
                            ? "bg-accent text-accent-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-4 w-4 opacity-40" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-border/40 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available for new opportunities
                </div>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full rounded-xl"
                  )}
                >
                  Contact me
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
