"use client"

import * as React from "react"
import { ArrowUpRightIcon, BookOpenIcon, ExternalLinkIcon, FileTextIcon, GlobeIcon } from "lucide-react"
import { cn } from "cn"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export interface SourceData {
  url: string
  title?: string
  hostname?: string
  snippet?: string
}

function extractHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function Sources({
  className,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible
      data-slot="sources"
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function SourcesTrigger({
  count = 0,
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger> & {
  count?: number
}) {
  return (
    <CollapsibleTrigger
      data-slot="sources-trigger"
      className={cn(
        "group/sources-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-md py-1 px-0 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 select-none",
        className
      )}
      {...props}
    >
      <GlobeIcon className="size-3.5 shrink-0 text-muted-foreground group-hover/sources-trigger:text-foreground transition-colors" />
      <span className="min-w-0 truncate font-medium">
        {children ?? `Used ${count} ${count === 1 ? "source" : "sources"}`}
      </span>
      <span className="text-[11px] font-mono text-muted-foreground/60 transition-transform duration-200 group-aria-expanded/sources-trigger:rotate-90">
        ›
      </span>
    </CollapsibleTrigger>
  )
}

function SourcesContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="sources-content"
      className="min-w-0 overflow-hidden transition-[height] duration-200"
      {...props}
    />
  )
}

function SourcesList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sources-list"
      className={cn(
        "mt-2 mb-2 ml-2 flex flex-col gap-1 border-l-2 border-border/60 pl-3 py-1",
        className
      )}
      {...props}
    />
  )
}

interface SourceItemProps extends React.ComponentProps<"a"> {
  url: string
  title?: string
  hostname?: string
  snippet?: string
}

function SourceItem({
  url,
  title,
  hostname,
  snippet,
  className,
  ...props
}: SourceItemProps) {
  const displayHost = hostname || extractHostname(url)
  const displayTitle = title || displayHost

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-slot="source-item"
      className={cn(
        "group/source-item flex items-center justify-between gap-2.5 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs transition-all hover:bg-muted/50 hover:border-border hover:shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="flex size-4 shrink-0 items-center justify-center rounded bg-muted/80 text-muted-foreground">
          <GlobeIcon className="size-3" />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-foreground truncate group-hover/source-item:text-primary transition-colors">
            {displayTitle}
          </span>
          <span className="font-mono text-[10.5px] text-muted-foreground/70 truncate">
            {displayHost}
          </span>
        </div>
      </div>
      <ArrowUpRightIcon className="size-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover/source-item:text-foreground group-hover/source-item:translate-x-0.5 group-hover/source-item:-translate-y-0.5" />
    </a>
  )
}

function SourcesGrid({
  sources,
  className,
}: {
  sources: SourceData[]
  className?: string
}) {
  if (!sources || sources.length === 0) return null

  return (
    <div
      data-slot="sources-grid"
      className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 my-2", className)}
    >
      {sources.map((source, index) => (
        <SourceItem key={`${source.url}-${index}`} {...source} />
      ))}
    </div>
  )
}

export {
  Sources,
  SourcesTrigger,
  SourcesContent,
  SourcesList,
  SourceItem,
  SourcesGrid,
}
