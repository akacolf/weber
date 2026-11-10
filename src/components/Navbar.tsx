"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export const NAV_LINKS = [
  { label: "About me", href: "/about" },
  { label: "My constitution", href: "/constitution" },
  { label: "Products I've built", href: "/products" },
  { label: "My resume/cv", href: "/resume" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isAboutActive = pathname === "/about" || pathname === "/constitution";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors print:hidden">
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
          {/* About me Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "group inline-flex items-center gap-1.5 transition-colors select-none cursor-pointer outline-none rounded-md px-2 py-1 text-sm font-medium",
                isAboutActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="About me dropdown menu"
            >
              <span>About me</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[popup-open]:rotate-180 group-data-[open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-1.5 shadow-xl border-border/80">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push("/about")}
                  className={cn(
                    "px-3 py-2 text-xs font-medium cursor-pointer rounded-md transition-colors",
                    pathname === "/about"
                      ? "text-foreground font-semibold bg-accent/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  )}
                >
                  <Link
                    href="/about"
                    className="flex flex-col text-left w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="font-medium text-foreground">About me</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Background & bio</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/constitution")}
                  className={cn(
                    "px-3 py-2 text-xs font-medium cursor-pointer rounded-md transition-colors",
                    pathname === "/constitution"
                      ? "text-foreground font-semibold bg-accent/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  )}
                >
                  <Link
                    href="/constitution"
                    className="flex flex-col text-left w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="font-medium text-foreground">My constitution</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Principles & operating code</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Products link */}
          <Link
            href="/products"
            className={cn(
              "transition-colors select-none",
              pathname === "/products"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={pathname === "/products" ? "page" : undefined}
          >
            Products I&apos;ve built
          </Link>

          {/* Resume link */}
          <Link
            href="/resume"
            className={cn(
              "transition-colors select-none",
              pathname === "/resume"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={pathname === "/resume" ? "page" : undefined}
          >
            My resume/cv
          </Link>
        </nav>

        {/* Actions / Contact CTA (Right) */}
        <div className="flex items-center flex-1 justify-end gap-3">
          <ModeToggle />

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

                  <nav aria-label="Mobile Navigation" className="flex flex-col gap-4 pt-6">
                    {/* About section in mobile */}
                    <div className="space-y-1">
                      <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
                        About
                      </div>
                      <Link
                        href="/about"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                          pathname === "/about"
                            ? "text-foreground font-semibold bg-secondary/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        )}
                        aria-current={pathname === "/about" ? "page" : undefined}
                      >
                        <span>About me</span>
                        <ArrowUpRight className="h-4 w-4 opacity-40" />
                      </Link>
                      <Link
                        href="/constitution"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                          pathname === "/constitution"
                            ? "text-foreground font-semibold bg-secondary/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        )}
                        aria-current={pathname === "/constitution" ? "page" : undefined}
                      >
                        <span>My constitution</span>
                        <ArrowUpRight className="h-4 w-4 opacity-40" />
                      </Link>
                    </div>

                    {/* Navigation links */}
                    <div className="space-y-1 pt-1">
                      <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
                        Navigation
                      </div>
                      <Link
                        href="/products"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                          pathname === "/products"
                            ? "text-foreground font-semibold bg-secondary/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        )}
                        aria-current={pathname === "/products" ? "page" : undefined}
                      >
                        <span>Products I&apos;ve built</span>
                        <ArrowUpRight className="h-4 w-4 opacity-40" />
                      </Link>
                      <Link
                        href="/resume"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                          pathname === "/resume"
                            ? "text-foreground font-semibold bg-secondary/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        )}
                        aria-current={pathname === "/resume" ? "page" : undefined}
                      >
                        <span>My resume/cv</span>
                        <ArrowUpRight className="h-4 w-4 opacity-40" />
                      </Link>
                    </div>

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
