"use client"

import * as React from "react"
import { ArrowUp, Globe, Paperclip, Sparkles, Square } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

interface PromptInputProps extends React.ComponentProps<"div"> {
  isSubmitting?: boolean
}

function PromptInput({
  className,
  children,
  ...props
}: PromptInputProps) {
  return (
    <div
      data-slot="prompt-input"
      className={cn(
        "relative flex flex-col w-full rounded-2xl bg-card/90 border border-border/80 p-2.5 backdrop-blur-xl transition-all shadow-lg focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface PromptInputTextareaProps
  extends React.ComponentProps<"textarea"> {
  onEnterSubmit?: () => void
}

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, onEnterSubmit, onKeyDown, onChange, ...props }, ref) => {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
    onChange?.(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onEnterSubmit?.()
    }
    onKeyDown?.(e)
  }

  return (
    <textarea
      ref={(node) => {
        innerRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      rows={1}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full flex-1 bg-transparent border-0 outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 px-1 py-1 min-h-[28px] max-h-[180px] leading-relaxed transition-all",
        className
      )}
      {...props}
    />
  )
})
PromptInputTextarea.displayName = "PromptInputTextarea"

function PromptInputActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-input-actions"
      className={cn(
        "flex items-center justify-between gap-2 pt-1 px-1",
        className
      )}
      {...props}
    />
  )
}

function PromptInputTools({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-input-tools"
      className={cn("flex items-center gap-1.5 flex-wrap", className)}
      {...props}
    />
  )
}

interface PromptInputSubmitProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  onStop?: () => void
}

function PromptInputSubmit({
  isLoading = false,
  onStop,
  disabled,
  className,
  ...props
}: PromptInputSubmitProps) {
  if (isLoading) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onStop}
        className={cn(
          "h-8 w-8 rounded-full shrink-0 text-red-500 border-red-500/40 hover:bg-red-500/10 cursor-pointer p-0 flex items-center justify-center transition-all",
          className
        )}
        title="Stop generation"
        {...props}
      >
        <Square className="h-3.5 w-3.5 fill-current" />
      </Button>
    )
  }

  return (
    <Button
      type="submit"
      disabled={disabled}
      size="icon"
      className={cn(
        "h-8 w-8 rounded-full shrink-0 text-white transition-all cursor-pointer p-0 shadow-xs flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500",
        className
      )}
      title="Send message (Enter)"
      {...props}
    >
      <ArrowUp className="h-4 w-4 text-white" />
    </Button>
  )
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputTools,
  PromptInputSubmit,
}
