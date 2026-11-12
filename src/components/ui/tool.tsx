"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  Code2Icon,
  DatabaseIcon,
  ExternalLinkIcon,
  HelpCircleIcon,
  SearchIcon,
  TerminalIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react"
import { cn } from "cn"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export type ToolStatus = "running" | "completed" | "error" | "pending_approval"

interface ToolProps extends React.ComponentProps<typeof Collapsible> {
  name: string
  status?: ToolStatus
  icon?: "terminal" | "search" | "code" | "database" | "wrench" | React.ReactNode
}

function getToolIcon(icon?: ToolProps["icon"]) {
  if (React.isValidElement(icon)) return icon
  switch (icon) {
    case "terminal":
      return <TerminalIcon className="size-3.5" />
    case "search":
      return <SearchIcon className="size-3.5" />
    case "code":
      return <Code2Icon className="size-3.5" />
    case "database":
      return <DatabaseIcon className="size-3.5" />
    default:
      return <WrenchIcon className="size-3.5" />
  }
}

function ToolStatusBadge({ status }: { status: ToolStatus }) {
  switch (status) {
    case "running":
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20">
          <Spinner className="size-2.5 animate-spin" />
          <span>running</span>
        </span>
      )
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2Icon className="size-2.5" />
          <span>done</span>
        </span>
      )
    case "error":
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-destructive/10 text-destructive border border-destructive/20">
          <XCircleIcon className="size-2.5" />
          <span>error</span>
        </span>
      )
    case "pending_approval":
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <HelpCircleIcon className="size-2.5" />
          <span>approval required</span>
        </span>
      )
  }
}

function Tool({
  name,
  status = "completed",
  icon,
  className,
  children,
  defaultOpen,
  ...props
}: ToolProps) {
  return (
    <Collapsible
      data-slot="tool"
      defaultOpen={defaultOpen ?? (status === "running" || status === "pending_approval")}
      className={cn(
        "my-2 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs overflow-hidden transition-all shadow-xs",
        status === "running" && "border-sky-500/40 bg-sky-500/[0.02]",
        status === "pending_approval" && "border-amber-500/40 bg-amber-500/[0.02]",
        className
      )}
      {...props}
    >
      <CollapsibleTrigger
        className="group/tool-trigger flex w-full items-center justify-between px-3 py-2 text-left text-xs font-mono transition-colors hover:bg-muted/40 cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-foreground/80">
            {getToolIcon(icon)}
          </span>
          <span className="font-semibold text-foreground truncate">{name}</span>
          <ToolStatusBadge status={status} />
        </div>
        <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-aria-expanded/tool-trigger:rotate-90 group-hover/tool-trigger:text-foreground" />
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t border-border/40 p-3 text-xs">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

function ToolArgs({
  args,
  className,
}: {
  args: Record<string, unknown> | string
  className?: string
}) {
  const formatted =
    typeof args === "string" ? args : JSON.stringify(args, null, 2)

  return (
    <div className={cn("space-y-1 mb-2", className)}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
        Input
      </div>
      <pre className="p-2 rounded-md bg-muted/50 border border-border/40 text-[11px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed">
        {formatted}
      </pre>
    </div>
  )
}

function ToolResult({
  result,
  className,
}: {
  result: unknown
  className?: string
}) {
  const formatted =
    typeof result === "string" ? result : JSON.stringify(result, null, 2)

  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
        Output
      </div>
      <pre className="p-2 rounded-md bg-muted/30 border border-border/40 text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
        {formatted}
      </pre>
    </div>
  )
}

function ToolConfirmation({
  actionDescription,
  onApprove,
  onReject,
  className,
}: {
  actionDescription: string
  onApprove: () => void
  onReject: () => void
  className?: string
}) {
  return (
    <div
      data-slot="tool-confirmation"
      className={cn(
        "my-2 rounded-xl border border-amber-500/40 bg-amber-500/[0.04] p-3 text-xs space-y-2.5",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <HelpCircleIcon className="size-4 shrink-0 text-amber-500 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-semibold text-foreground">Action Confirmation Required</div>
          <p className="text-muted-foreground leading-relaxed">{actionDescription}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-500/20">
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          className="h-7 px-2.5 text-xs border-border/70 hover:bg-muted cursor-pointer"
        >
          Reject
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onApprove}
          className="h-7 px-2.5 text-xs bg-amber-600 hover:bg-amber-500 text-white cursor-pointer"
        >
          Approve & Run
        </Button>
      </div>
    </div>
  )
}

export {
  Tool,
  ToolStatusBadge,
  ToolArgs,
  ToolResult,
  ToolConfirmation,
}
