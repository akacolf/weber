import * as React from "react";
import { cn } from "@/lib/utils";

function Timeline({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"ol"> & { orientation?: "vertical" | "horizontal" }) {
  return (
    <ol
      data-slot="timeline"
      data-orientation={orientation}
      className={cn(
        "relative flex flex-col",
        orientation === "horizontal" && "flex-row",
        className
      )}
      {...props}
    />
  );
}

function TimelineItem({
  className,
  status = "default",
  ...props
}: React.ComponentProps<"li"> & {
  status?: "default" | "active" | "completed" | "upcoming";
}) {
  return (
    <li
      data-slot="timeline-item"
      data-status={status}
      className={cn(
        "group/timeline-item relative flex gap-4 sm:gap-6 md:gap-8 pb-12 sm:pb-16 last:pb-0",
        className
      )}
      {...props}
    />
  );
}

function TimelineConnector({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-connector"
      aria-hidden="true"
      className={cn(
        "absolute left-4 sm:left-5 top-10 sm:top-12 -bottom-4 sm:-bottom-6 w-px -translate-x-1/2 bg-border/70 group-last/timeline-item:hidden transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TimelinePoint({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-point"
      className={cn(
        "relative z-10 flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-foreground transition-all duration-200 group-data-[status=active]/timeline-item:border-foreground/80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TimelineHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function TimelineTime({
  className,
  ...props
}: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-time"
      className={cn("font-mono text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function TimelineTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="timeline-title"
      className={cn(
        "text-xl sm:text-2xl md:text-3xl font-serif font-normal tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}

function TimelineContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("flex flex-1 flex-col gap-3 min-w-0 pt-0.5", className)}
      {...props}
    />
  );
}

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelinePoint,
  TimelineHeader,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  TimelineContent,
};
