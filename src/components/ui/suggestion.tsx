"use client"

import * as React from "react"
import { ArrowUpRightIcon, SparklesIcon } from "lucide-react"
import { cn } from "cn"

interface SuggestionsProps extends React.ComponentProps<"div"> {
  title?: string
}

function Suggestions({
  title,
  className,
  children,
  ...props
}: SuggestionsProps) {
  return (
    <div
      data-slot="suggestions"
      className={cn("flex flex-col gap-2 my-3", className)}
      {...props}
    >
      {title && (
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground/75 px-0.5">
          <SparklesIcon className="size-3 text-primary/70" />
          <span>{title}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {children}
      </div>
    </div>
  )
}

interface SuggestionItemProps extends React.ComponentProps<"button"> {
  icon?: React.ReactNode
}

function SuggestionItem({
  icon,
  className,
  children,
  ...props
}: SuggestionItemProps) {
  return (
    <button
      type="button"
      data-slot="suggestion-item"
      className={cn(
        "group/suggestion inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted/60 hover:text-foreground hover:shadow-xs active:scale-[0.98] cursor-pointer text-left select-none",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 text-muted-foreground group-hover/suggestion:text-primary transition-colors">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
      <ArrowUpRightIcon className="size-3 shrink-0 opacity-40 transition-all duration-200 group-hover/suggestion:opacity-100 group-hover/suggestion:translate-x-0.5 group-hover/suggestion:-translate-y-0.5" />
    </button>
  )
}

export { Suggestions, SuggestionItem }
