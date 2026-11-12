"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, CpuIcon, SparklesIcon, ZapIcon } from "lucide-react"
import { cn } from "cn"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export interface AIModel {
  id: string
  name: string
  description?: string
  tier?: "pro" | "fast" | "reasoning"
  badge?: string
}

export const DEFAULT_WEBER_MODELS: AIModel[] = [
  {
    id: "weber-pro",
    name: "Weber 2.0 Pro",
    description: "Multimodal architecture, TON smart contracts & systems reasoning",
    tier: "pro",
    badge: "Recommended",
  },
  {
    id: "weber-deepthink",
    name: "Weber DeepThink",
    description: "Step-by-step mathematical proofs, formal verification & code analysis",
    tier: "reasoning",
    badge: "Reasoning",
  },
  {
    id: "weber-flash",
    name: "Weber Flash",
    description: "Ultra-low latency instant answers for fast exploratory questions",
    tier: "fast",
    badge: "Fast",
  },
]

interface ModelSelectorProps {
  models?: AIModel[]
  selectedModelId: string
  onSelectModel: (modelId: string) => void
  className?: string
  compact?: boolean
}

function getTierIcon(tier?: AIModel["tier"]) {
  switch (tier) {
    case "reasoning":
      return <CpuIcon className="size-3.5 text-purple-500" />
    case "fast":
      return <ZapIcon className="size-3.5 text-amber-500" />
    case "pro":
    default:
      return <SparklesIcon className="size-3.5 text-sky-500" />
  }
}

function ModelSelector({
  models = DEFAULT_WEBER_MODELS,
  selectedModelId,
  onSelectModel,
  className,
  compact = false,
}: ModelSelectorProps) {
  const currentModel = models.find((m) => m.id === selectedModelId) || models[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="model-selector-trigger"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-medium text-foreground/90 backdrop-blur-md transition-all hover:bg-muted/70 hover:border-border hover:shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer select-none",
          className
        )}
      >
        <span className="flex size-4 shrink-0 items-center justify-center">
          {getTierIcon(currentModel.tier)}
        </span>
        <span className="truncate max-w-[120px] font-sans">
          {currentModel.name}
        </span>
        {currentModel.badge && !compact && (
          <Badge
            variant="outline"
            className="h-4 px-1 text-[9.5px] font-mono font-medium rounded text-muted-foreground border-border/80 bg-muted/40"
          >
            {currentModel.badge}
          </Badge>
        )}
        <ChevronDownIcon className="size-3 shrink-0 text-muted-foreground/60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-68 p-1.5 rounded-xl shadow-lg border-border/80 bg-popover/95 backdrop-blur-md"
      >
        <DropdownMenuLabel className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground/80 px-2 py-1">
          Model & Reasoning Engine
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {models.map((model) => {
          const isSelected = model.id === currentModel.id
          return (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className={cn(
                "flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors",
                isSelected && "bg-muted/70"
              )}
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-foreground mt-0.5">
                {getTierIcon(model.tier)}
              </span>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="font-semibold text-xs text-foreground truncate">
                    {model.name}
                  </span>
                  {model.badge && (
                    <Badge
                      variant="outline"
                      className="h-4 px-1 text-[9px] font-mono text-muted-foreground"
                    >
                      {model.badge}
                    </Badge>
                  )}
                </div>
                {model.description && (
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                    {model.description}
                  </p>
                )}
              </div>
              {isSelected && (
                <CheckIcon className="size-3.5 text-primary shrink-0 self-center" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ModelSelector }
