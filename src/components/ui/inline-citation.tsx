"use client"

import * as React from "react"
import { ArrowUpRightIcon, GlobeIcon } from "lucide-react"
import { cn } from "cn"

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

export interface InlineCitationProps {
  index: number | string
  url: string
  title?: string
  hostname?: string
  snippet?: string
  className?: string
}

function extractHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function InlineCitation({
  index,
  url,
  title,
  hostname,
  snippet,
  className,
}: InlineCitationProps) {
  const displayHost = hostname || extractHostname(url)
  const displayTitle = title || displayHost

  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          "inline-flex items-center justify-center align-baseline px-1.5 py-0.5 mx-0.5 text-[11px] font-mono font-medium rounded-md bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer select-none no-underline",
          className
        )}
      >
        <span>[{index}]</span>
      </HoverCardTrigger>

      <HoverCardContent
        side="top"
        align="start"
        className="w-72 p-3 text-xs shadow-lg border border-border bg-popover/95 backdrop-blur-md rounded-xl"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GlobeIcon className="size-3.5 shrink-0" />
            <span className="font-mono text-[10.5px] truncate font-medium">
              {displayHost}
            </span>
          </div>

          <div className="font-semibold text-foreground text-xs leading-snug line-clamp-2">
            {displayTitle}
          </div>

          {snippet && (
            <p className="text-muted-foreground/85 text-[11.5px] leading-relaxed line-clamp-3 bg-muted/40 p-1.5 rounded-md border border-border/40 italic">
              “{snippet}”
            </p>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-between text-[11px] font-medium text-primary hover:underline group/cite-link pt-1 border-t border-border/40"
          >
            <span>Visit reference</span>
            <ArrowUpRightIcon className="size-3.5 transition-transform group-hover/cite-link:translate-x-0.5 group-hover/cite-link:-translate-y-0.5" />
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export { InlineCitation }
