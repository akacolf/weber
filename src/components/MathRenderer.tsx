"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = React.memo(
  function MathRenderer({ math, block = false, className = "" }) {
    const html = useMemo(() => {
      const clean = math.trim();
      if (!clean) return "";
      try {
        return katex.renderToString(clean, {
          displayMode: block,
          throwOnError: false,
          output: "htmlAndMathml",
          trust: false,
          strict: false,
        });
      } catch {
        return null;
      }
    }, [math, block]);

    if (!html) {
      return (
        <span className={`font-mono text-xs ${className}`}>
          {block ? `$$${math}$$` : `$${math}$`}
        </span>
      );
    }

    if (block) {
      return (
        <div
          className={`my-3 overflow-x-auto overflow-y-hidden py-2 px-3 text-center text-foreground font-serif text-[14px] sm:text-[15.5px] rounded-lg border border-border/40 bg-muted/20 select-text ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return (
      <span
        className={`inline-math px-0.5 align-baseline font-serif text-foreground select-text ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
);
