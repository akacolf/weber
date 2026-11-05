"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { label: "About me", href: "/about" },
  { label: "Products I've built", href: "/products" },
  { label: "My resume/cv", href: "/resume" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo (Left) */}
        <div className="flex items-center flex-1 justify-start">
          <Logo />
        </div>

        {/* Desktop Navigation (Middle) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center justify-center gap-8 text-sm font-medium"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors select-none",
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

        {/* Actions / Contact CTA (Right) */}
        <div className="flex items-center flex-1 justify-end gap-3">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 active:scale-95 transition-all duration-150 select-none shadow-sm"
          >
            Contact me
          </Link>

          {/* Mobile Navigation Trigger */}
          <div className="flex md:hidden items-center">
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
                    <SheetTitle className="text-base font-semibold">
                      Menu
                    </SheetTitle>
                  </SheetHeader>

                  <nav aria-label="Mobile Navigation" className="flex flex-col gap-2 pt-6">
                    {NAV_LINKS.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                            isActive
                              ? "text-foreground font-semibold bg-secondary/50"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="h-4 w-4 opacity-40" />
                        </Link>
                      );
                    })}
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className="mt-4 flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-white/90 active:scale-95 transition-all shadow-sm select-none"
                    >
                      Contact me
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
