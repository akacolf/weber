"use client"

import * as React from "react"
import { BrainIcon, CheckCircle2Icon, ChevronRightIcon, SparklesIcon } from "lucide-react"
import { cn } from "cn"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Spinner } from "@/components/ui/spinner"

interface ReasoningContextValue {
  isStreaming?: boolean
  duration?: number
}

const ReasoningContext = React.createContext<ReasoningContextValue>({})

function Reasoning({
  className,
  isStreaming = false,
  duration,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean
  duration?: number
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const handleOpenChange: React.ComponentProps<typeof Collapsible>["onOpenChange"] = (
    nextOpen,
    eventDetails
  ) => {
    if (open === undefined) {
      setIsOpen(nextOpen)
    }
    onOpenChange?.(nextOpen, eventDetails)
  }

  return (
    <ReasoningContext.Provider value={{ isStreaming, duration }}>
      <Collapsible
        data-slot="reasoning"
        open={open ?? isOpen}
        onOpenChange={handleOpenChange}
        className={cn("flex w-full min-w-0 flex-col", className)}
        {...props}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  )
}

function ReasoningTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger>) {
  const { isStreaming, duration } = React.useContext(ReasoningContext)

  return (
    <CollapsibleTrigger
      data-slot="reasoning-trigger"
      className={cn(
        "group/reasoning-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-md py-1 px-0 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 select-none",
        className
      )}
      {...props}
    >
      <span className="flex size-3.5 shrink-0 items-center justify-center text-muted-foreground group-hover/reasoning-trigger:text-foreground transition-colors">
        {isStreaming ? (
          <Spinner className="size-3.5 text-muted-foreground animate-spin" />
        ) : (
          <BrainIcon className="size-3.5 text-muted-foreground" />
        )}
      </span>

      <span
        data-slot="reasoning-title"
        className={cn(
          "min-w-0 truncate text-muted-foreground font-normal group-hover/reasoning-trigger:text-foreground transition-colors"
        )}
      >
        {children ?? (
          <>
            {isStreaming ? (
              "Thinking…"
            ) : (
              <span>
                Thought
                {duration !== undefined && (
                  <span className="ml-1 text-muted-foreground/70 font-mono font-normal">
                    for {duration}s
                  </span>
                )}
              </span>
            )}
          </>
        )}
      </span>

      <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-aria-expanded/reasoning-trigger:rotate-90 group-hover/reasoning-trigger:text-foreground" />
    </CollapsibleTrigger>
  )
}

function ReasoningContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="reasoning-content"
      className="min-w-0 overflow-hidden transition-[height] duration-200"
      {...props}
    >
      <div
        className={cn(
          "mt-2 mb-2 w-full min-w-0 rounded-xl border border-border/50 bg-background/50 dark:bg-neutral-900/40 p-3 font-mono text-xs leading-relaxed text-muted-foreground/90 whitespace-pre-wrap break-words selection:bg-foreground/10",
          className
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  )
}

interface ChainOfThoughtStepProps extends React.ComponentProps<"div"> {
  title: string
  status?: "pending" | "running" | "done" | "error"
  description?: string
}

function ChainOfThoughtStep({
  title,
  status = "done",
  description,
  className,
  children,
  ...props
}: ChainOfThoughtStepProps) {
  return (
    <div
      data-slot="chain-of-thought-step"
      className={cn("flex flex-col gap-1 py-1 text-xs", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-3.5 shrink-0 items-center justify-center">
          {status === "running" && <Spinner className="size-3 text-muted-foreground animate-spin" />}
          {status === "done" && <CheckCircle2Icon className="size-3 text-emerald-500" />}
          {status === "pending" && <span className="size-1.5 rounded-full bg-muted-foreground/40" />}
          {status === "error" && <span className="size-1.5 rounded-full bg-destructive" />}
        </span>
        <span className={cn("font-medium", status === "running" ? "text-foreground" : "text-muted-foreground")}>
          {title}
        </span>
        {description && (
          <span className="text-muted-foreground/60 font-mono text-[11px] ml-auto">
            {description}
          </span>
        )}
      </div>
      {children && <div className="ml-5 text-muted-foreground/80">{children}</div>}
    </div>
  )
}

function ChainOfThought({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chain-of-thought"
      className={cn("flex flex-col gap-1.5 py-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  ChainOfThought,
  ChainOfThoughtStep,
}
