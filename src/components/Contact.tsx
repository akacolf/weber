"use client";

import React, { useState } from "react";
import LiquidGlassCard from "@/components/ui/LiquidGlassCard";
import { Button } from "@/components/ui/button";
import { Copy, Check, Mail, MessageSquare, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "khalidthenoble@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <LiquidGlassCard
          glowColor="rgba(56, 189, 248, 0.2)"
          className="text-center p-8 sm:p-14 relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>LET&apos;S COLLABORATE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Have a project in mind?
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            I partner with forward-thinking teams to engineer distinctive web
            experiences, interactive 3D interfaces, and resilient digital architectures.
          </p>

          {/* Email Copy Card */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 bg-background/80 backdrop-blur-md rounded-2xl border border-border/80 dark:border-white/10 shadow-lg mb-8">
            <div className="flex items-center gap-2 px-4 py-2">
              <Mail className="w-4 h-4 text-sky-400" />
              <span className="font-mono text-sm text-foreground select-all">
                {email}
              </span>
            </div>

            <Button
              onClick={handleCopy}
              size="sm"
              variant="secondary"
              className="rounded-xl w-full sm:w-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Email
                </>
              )}
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground border-t border-border/40 dark:border-white/5 pt-8">
            <a
              href="https://github.com/akacolf"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              GitHub <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://x.com/akacolf"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              X / Twitter <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com/in/colf"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://readcv.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              ReadCV <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </LiquidGlassCard>
      </div>
    </section>
  );
}
