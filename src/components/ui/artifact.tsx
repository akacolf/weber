"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, ExternalLinkIcon, FileCodeIcon, Maximize2Icon, Minimize2Icon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ArtifactProps extends React.ComponentProps<"div"> {
  title: string
  type?: string
  identifier?: string
}

function Artifact({
  title,
  type = "code",
  identifier,
  className,
  children,
  ...props
}: ArtifactProps) {
  return (
    <div
      data-slot="artifact"
      className={cn(
        "my-3 flex flex-col rounded-xl border border-border/70 bg-card/70 shadow-sm backdrop-blur-xs overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ArtifactHeaderProps extends React.ComponentProps<"div"> {
  title: string
  type?: string
  onCopy?: () => void
  copyValue?: string
}

function ArtifactHeader({
  title,
  type = "code",
  onCopy,
  copyValue,
  className,
  children,
  ...props
}: ArtifactHeaderProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (copyValue) {
      navigator.clipboard.writeText(copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    onCopy?.()
  }

  return (
    <div
      data-slot="artifact-header"
      className={cn(
        "flex items-center justify-between px-3 py-2 border-b border-border/40 bg-muted/30 text-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
          <FileCodeIcon className="size-3.5" />
        </span>
        <span className="font-semibold text-foreground truncate">{title}</span>
        {type && (
          <Badge
            variant="outline"
            className="h-4 px-1 text-[9.5px] font-mono uppercase tracking-wider text-muted-foreground border-border/60"
          >
            {type}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {copyValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Copy artifact content"
          >
            {copied ? (
              <CheckIcon className="size-3.5 text-emerald-500" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
          </Button>
        )}
        {children}
      </div>
    </div>
  )
}

function ArtifactContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="artifact-content"
      className={cn("p-3 overflow-x-auto text-xs", className)}
      {...props}
    />
  )
}

export { Artifact, ArtifactHeader, ArtifactContent }
