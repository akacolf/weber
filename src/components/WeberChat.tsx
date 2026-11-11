"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUp,
  Square,
  User,
  Plus,
  MessageSquare,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import {
  Message as UiMessage,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
} from "@/components/ui/code-block";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";
import { Spinner } from "@/components/ui/spinner";
import { ModeToggle } from "@/components/mode-toggle";
import { WeberLogo } from "@/components/WeberLogo";
import { Badge } from "@/components/ui/badge";
import { MathRenderer } from "@/components/MathRenderer";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

const STORAGE_KEY = "weber_conversations_v2";
const emptySubscribe = () => () => {};

interface WeberTopChatBarProps {
  activeTitle: string;
  hasMessages: boolean;
}

function WeberTopChatBar({ activeTitle, hasMessages }: WeberTopChatBarProps) {
  const { open, openMobile, isMobile } = useSidebar();
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  // When mounted: if mobile, show logo when openMobile is false; if desktop, show logo when open is false.
  // Before mount: sidebar is open by default on desktop (defaultOpen: true), so showHeaderLogo is false.
  const isSidebarOpen = mounted ? (isMobile ? openMobile : open) : true;
  const showHeaderLogo = !isSidebarOpen;

  return (
    <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-20 gap-2">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <SidebarTrigger className="h-8 w-8 hover:bg-muted cursor-pointer shrink-0" />
        {showHeaderLogo && (
          <div className="flex items-center gap-2 select-none shrink-0 animate-in fade-in duration-200">
            <Link
              href="/weber"
              className="flex items-center hover:opacity-80 transition-opacity"
              title="Weber AI"
              aria-label="Weber AI"
            >
              <WeberLogo className="h-6 sm:h-6.5 w-auto text-foreground" />
            </Link>
            <Badge
              variant="outline"
              className="h-5 px-2 text-[10.5px] font-mono font-medium rounded-full text-muted-foreground border-border/80 bg-muted/40 select-none"
            >
              Preview
            </Badge>
          </div>
        )}
        {hasMessages && (
          <>
            {showHeaderLogo && (
              <span className="text-muted-foreground/40 font-mono text-xs hidden sm:inline">•</span>
            )}
            <span className="text-xs font-mono font-medium text-muted-foreground truncate max-w-[140px] sm:max-w-md">
              {activeTitle}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <Link
          href="/"
          title="Back to homepage"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 px-2.5 sm:px-3 text-xs font-medium text-muted-foreground hover:text-foreground border-border/70 hover:border-border hover:bg-muted/50 transition-colors group cursor-pointer whitespace-nowrap"
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to homepage</span>
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
}

export default function WeberChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const hasMounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [activeId, setActiveId] = useState<string>("new");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingMessages, setIsClearingMessages] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const scrollToBottom = useCallback((smooth = false) => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    } else if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  }, []);

  const handleViewportScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // Keep auto-scroll active if user is within 80px of bottom
    isAtBottomRef.current = distanceFromBottom < 80;
  };

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom(isLoading ? false : true);
    }
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (isAtBottomRef.current) {
        el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Hydrate conversations from localStorage on client mount to prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.removeItem("weber_conversations_v1");

        const placeholderIds = new Set([
          "conv-ton-jetton",
          "conv-bonding-curves",
          "conv-func-serialization",
        ]);

        const savedV2 = localStorage.getItem(STORAGE_KEY);
        if (savedV2) {
          const parsed = JSON.parse(savedV2);
          if (Array.isArray(parsed)) {
            setConversations(parsed.filter((c: Conversation) => !placeholderIds.has(c.id)));
            return;
          }
        }

        const savedV1 = localStorage.getItem("weber_conversations_v1");
        if (savedV1) {
          const parsed = JSON.parse(savedV1);
          if (Array.isArray(parsed)) {
            setConversations(parsed.filter((c: Conversation) => !placeholderIds.has(c.id)));
          }
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save conversations helper
  const persistConversations = useCallback((updated: Conversation[]) => {
    setConversations(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  // Switch to selected conversation
  const handleSelectConversation = (id: string) => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
    setActiveId(id);
    const found = conversations.find((c) => c.id === id);
    if (found) {
      setMessages(found.messages);
    } else {
      setMessages([]);
    }
    setInput("");
  };

  // Start a new chat
  const handleNewChat = () => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
    setActiveId("new");
    setMessages([]);
    setInput("");
  };

  // Delete a conversation
  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    persistConversations(updated);
    if (activeId === id) {
      handleNewChat();
    }
  };

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const isClearCommand = useCallback(
    (val: string) => {
      if (messages.length === 0) return false;
      const c = val.trim().toLowerCase();
      return c === "clear" || c === "/clear" || c === '"clear"';
    },
    [messages.length]
  );

  const handleClearCommand = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsClearingMessages(true);

    setTimeout(() => {
      setMessages([]);
      if (activeId !== "new") {
        const updated = conversations.filter((c) => c.id !== activeId);
        persistConversations(updated);
        setActiveId("new");
      }
      setIsClearingMessages(false);
    }, 280);

    toast.custom(
      () => (
        <div className="w-fit mx-auto flex items-center justify-center px-4 py-2 rounded-full bg-white dark:bg-black text-black dark:text-white shadow-md border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-medium tracking-tight whitespace-nowrap select-none">
          chat cleared
        </div>
      ),
      {
        id: "weber-clear-chat",
        duration: 2000,
        position: "top-center",
        className: "w-full flex justify-center",
      }
    );
  }, [activeId, conversations, persistConversations]);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend ?? input).trim();
      if (!text) return;

      if (isClearCommand(text)) {
        handleClearCommand();
        return;
      }

      if (isLoading) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      setIsLoading(true);

      const assistantMsgId = `assistant-${Date.now()}`;
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const threadWithAssistant = [...newHistory, assistantMsg];
      setMessages(threadWithAssistant);
      isAtBottomRef.current = true;
      setTimeout(() => scrollToBottom(true), 20);

      // Determine conversation ID & title
      let targetConvId = activeId;
      let currentConvs = [...conversations];

      if (activeId === "new") {
        targetConvId = `conv-${Date.now()}`;
        setActiveId(targetConvId);
        const title = text.length > 45 ? `${text.slice(0, 45).trim()}…` : text;
        const newConv: Conversation = {
          id: targetConvId,
          title,
          createdAt: new Date().toISOString(),
          messages: threadWithAssistant,
        };
        currentConvs = [newConv, ...currentConvs];
        persistConversations(currentConvs);
      } else {
        currentConvs = currentConvs.map((c) =>
          c.id === targetConvId ? { ...c, messages: threadWithAssistant } : c
        );
        persistConversations(currentConvs);
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`Server returned error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const dataContent = trimmed.replace(/^data:\s*/, "");
            if (dataContent === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(dataContent);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulatedText += delta;
                setMessages((prev) => {
                  const updated = prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  );
                  return updated;
                });
                if (isAtBottomRef.current) {
                  requestAnimationFrame(() => scrollToBottom(false));
                }
              }
            } catch {
              // Ignore non-json chunks
            }
          }
        }

        // Final sync of completed message to conversations list
        setConversations((prev) => {
          const updated = prev.map((c) => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: accumulatedText }
                    : m
                ),
              };
            }
            return c;
          });
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // Manually stopped by user
        } else {
          const errorMsg =
            "I encountered an issue connecting to the inference server. Please try again in a moment.";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: msg.content || errorMsg,
                  }
                : msg
            )
          );
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [activeId, conversations, handleClearCommand, input, isClearCommand, isLoading, messages, persistConversations, scrollToBottom]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Helper to extract reasoning / thinking content from output
  const parseThinkingContent = (raw: string) => {
    const thinkRegex = /<think>([\s\S]*?)(?:<\/think>|$)/;
    const match = raw.match(thinkRegex);
    if (!match) {
      return { thinking: null, isThinkingActive: false, message: raw };
    }
    const thinking = match[1].trim();
    const isThinkingActive = !raw.includes("</think>");
    const message = raw.replace(thinkRegex, "").trim();
    return { thinking, isThinkingActive, message };
  };

  const INLINE_REGEX_SOURCE =
    "(\\$\\$(?:\\\\.|[^$])+\\$\\$|\\\\\\[[\\s\\S]+?\\\\\\]|(?<!\\\\)\\$(?!\\s)(?:\\\\.|[^$\\n])+?(?<!\\s)(?<!\\\\)\\$|\\\\\\([\\s\\S]+?\\\\\\)|\\`[^\\`]+\\`|\\[[^\\]]+\\]\\([^)]+\\)|\\*\\*[^*]+\\*\\*|(?<!\\*)\\*[^*]+\\*(?!\\*)|~~[^~]+~~)";

  const renderInline = (
    text: string,
    keyPrefix: string = "il"
  ): React.ReactNode[] => {
    if (!text) return [];
    const regex = new RegExp(INLINE_REGEX_SOURCE, "g");
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      const key = `${keyPrefix}-${idx++}`;

      if (token.startsWith("$$") && token.endsWith("$$")) {
        nodes.push(
          <MathRenderer
            key={key}
            math={token.slice(2, -2).trim()}
            block={true}
          />
        );
      } else if (token.startsWith("\\[") && token.endsWith("\\]")) {
        nodes.push(
          <MathRenderer
            key={key}
            math={token.slice(2, -2).trim()}
            block={true}
          />
        );
      } else if (token.startsWith("$") && token.endsWith("$")) {
        nodes.push(
          <MathRenderer
            key={key}
            math={token.slice(1, -1).trim()}
            block={false}
          />
        );
      } else if (token.startsWith("\\(") && token.endsWith("\\)")) {
        nodes.push(
          <MathRenderer
            key={key}
            math={token.slice(2, -2).trim()}
            block={false}
          />
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        nodes.push(
          <code
            key={key}
            className="px-1.5 py-0.5 rounded bg-muted/70 text-foreground font-mono text-[12px] border border-border/40 select-text"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (
        token.startsWith("[") &&
        token.includes("](") &&
        token.endsWith(")")
      ) {
        const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const label = linkMatch[1];
          const href = linkMatch[2];
          nodes.push(
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {renderInline(label, `${key}-l`)}
            </a>
          );
        } else {
          nodes.push(token);
        }
      } else if (token.startsWith("**") && token.endsWith("**")) {
        nodes.push(
          <strong key={key} className="font-semibold text-foreground">
            {renderInline(token.slice(2, -2), `${key}-b`)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        nodes.push(
          <em key={key} className="italic text-foreground/90">
            {renderInline(token.slice(1, -1), `${key}-em`)}
          </em>
        );
      } else if (token.startsWith("~~") && token.endsWith("~~")) {
        nodes.push(
          <del key={key} className="line-through text-muted-foreground">
            {renderInline(token.slice(2, -2), `${key}-del`)}
          </del>
        );
      } else {
        nodes.push(token);
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }

    return nodes;
  };

  // Render markdown helper (fenced code, LaTeX math, bold, lists, tables, headers, dividers)
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code Block with shadcn CodeBlock primitive
      if (line.startsWith("```")) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        const fullCode = codeLines.join("\n");

        elements.push(
          <CodeBlock
            key={`code-${i}`}
            className="my-3 font-mono text-xs shadow-md border-border/70 overflow-hidden"
          >
            <CodeBlockHeader className="justify-between px-3 py-2 bg-muted/30 border-b border-border/40">
              <CodeBlockTitle className="uppercase tracking-wider text-[11px] font-semibold text-muted-foreground">
                {lang || "code"}
              </CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={fullCode} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent className="p-3 text-[12.5px] leading-relaxed bg-neutral-950/70 dark:bg-neutral-950/90 text-neutral-100">
              {fullCode}
            </CodeBlockContent>
          </CodeBlock>
        );
        i++;
        continue;
      }

      // Display Math Block ($$ ... $$ or \[ ... \]) on a single line
      if (
        (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length > 4) ||
        (trimmed.startsWith("\\[") && trimmed.endsWith("\\]") && trimmed.length > 4)
      ) {
        const math = trimmed.startsWith("\\[")
          ? trimmed.slice(2, -2)
          : trimmed.slice(2, -2);
        elements.push(
          <MathRenderer
            key={`math-block-${i}`}
            math={math.trim()}
            block={true}
          />
        );
        i++;
        continue;
      }

      // Display Math Block across multiple lines ($$ or \[)
      if (trimmed === "$$" || (trimmed.startsWith("$$") && !trimmed.endsWith("$$"))) {
        const mathLines: string[] = [];
        const startMath = trimmed.slice(2).trim();
        if (startMath) mathLines.push(startMath);
        i++;
        while (i < lines.length && !lines[i].trim().endsWith("$$")) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          const endMath = lines[i].trim().slice(0, -2).trim();
          if (endMath) mathLines.push(endMath);
          i++;
        }
        elements.push(
          <MathRenderer
            key={`math-multi-${i}`}
            math={mathLines.join("\n")}
            block={true}
          />
        );
        continue;
      }

      if (trimmed === "\\[" || (trimmed.startsWith("\\[") && !trimmed.endsWith("\\]"))) {
        const mathLines: string[] = [];
        const startMath = trimmed.slice(2).trim();
        if (startMath) mathLines.push(startMath);
        i++;
        while (i < lines.length && !lines[i].trim().endsWith("\\]")) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          const endMath = lines[i].trim().slice(0, -2).trim();
          if (endMath) mathLines.push(endMath);
          i++;
        }
        elements.push(
          <MathRenderer
            key={`math-multi-bracket-${i}`}
            math={mathLines.join("\n")}
            block={true}
          />
        );
        continue;
      }

      // Horizontal rule (--- or *** or ___)
      if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        elements.push(
          <hr
            key={`hr-${i}`}
            className="my-3.5 border-t border-border/50"
          />
        );
        i++;
        continue;
      }

      // Markdown Tables
      if (
        trimmed.startsWith("|") &&
        trimmed.endsWith("|") &&
        i + 1 < lines.length &&
        /^\|[-:\s|]+\|$/.test(lines[i + 1].trim())
      ) {
        const parseRow = (rowStr: string) =>
          rowStr
            .trim()
            .replace(/^\||\|$/g, "")
            .split("|")
            .map((c) => c.trim());

        const headers = parseRow(trimmed);
        i += 2; // skip header and delimiter lines
        const rows: string[][] = [];
        while (
          i < lines.length &&
          lines[i].trim().startsWith("|") &&
          lines[i].trim().endsWith("|")
        ) {
          rows.push(parseRow(lines[i]));
          i++;
        }

        elements.push(
          <div
            key={`tbl-${i}`}
            className="my-3 overflow-x-auto rounded-lg border border-border/60 bg-muted/10 shadow-xs"
          >
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="py-2 px-3 text-foreground font-medium">
                      {renderInline(h, `th-${i}-${hIdx}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-muted/20 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 text-foreground/90">
                        {renderInline(cell, `td-${i}-${rIdx}-${cIdx}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h2
            key={i}
            className="font-bold text-lg text-foreground mt-4 mb-2 tracking-tight"
          >
            {renderInline(line.slice(2), `h1-${i}`)}
          </h2>
        );
        i++;
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h3
            key={i}
            className="font-bold text-base text-foreground mt-4 mb-1.5 tracking-tight"
          >
            {renderInline(line.slice(3), `h2-${i}`)}
          </h3>
        );
        i++;
        continue;
      }
      if (line.startsWith("### ")) {
        elements.push(
          <h4
            key={i}
            className="font-semibold text-sm text-foreground mt-3 mb-1 tracking-tight"
          >
            {renderInline(line.slice(4), `h3-${i}`)}
          </h4>
        );
        i++;
        continue;
      }
      if (line.startsWith("#### ")) {
        elements.push(
          <h5
            key={i}
            className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mt-2.5 mb-1"
          >
            {renderInline(line.slice(5), `h4-${i}`)}
          </h5>
        );
        i++;
        continue;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("> ")) {
          quoteLines.push(lines[i].slice(2));
          i++;
        }
        elements.push(
          <blockquote
            key={`bq-${i}`}
            className="border-l-2 border-primary/60 pl-3 my-2 text-sm italic text-muted-foreground bg-muted/15 py-1.5 pr-2 rounded-r"
          >
            {renderInline(quoteLines.join(" "), `bq-c-${i}`)}
          </blockquote>
        );
        continue;
      }

      // Unordered lists (- or * or • or \u2022)
      if (trimmed.match(/^([*•\u2022-]\s+)/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^([*•\u2022-]\s+)/)) {
          listItems.push(lines[i].trim().replace(/^([*•\u2022-]\s+)/, ""));
          i++;
        }
        elements.push(
          <ul
            key={`ul-${i}`}
            className="list-disc list-inside space-y-1 my-2 text-sm leading-relaxed text-muted-foreground"
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground/90">
                {renderInline(item, `ul-${i}-${idx}`)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Numbered lists (1. or 1))
      if (trimmed.match(/^\d+[.)]\s+/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^\d+[.)]\s+/)) {
          listItems.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
          i++;
        }
        elements.push(
          <ol
            key={`ol-${i}`}
            className="list-decimal list-inside space-y-1 my-2 text-sm leading-relaxed text-muted-foreground"
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground/90">
                {renderInline(item, `ol-${i}-${idx}`)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Blank line
      if (trimmed === "") {
        i++;
        continue;
      }

      // Regular paragraph
      elements.push(
        <p
          key={i}
          className="text-sm leading-relaxed text-foreground/90 mb-2 last:mb-0"
        >
          {renderInline(line, `p-${i}`)}
        </p>
      );
      i++;
    }

    return elements;
  };

  const activeConv = conversations.find((c) => c.id === activeId);
  const activeTitle = activeConv ? activeConv.title : "New conversation";

  return (
    <SidebarProvider defaultOpen={true} className="h-dvh max-h-dvh overflow-hidden">
      {/* ----------------- PAST CONVERSATIONS SIDEBAR ----------------- */}
      <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border/70">
        <SidebarHeader className="p-3 border-b border-sidebar-border/50 gap-2.5">
          <div className="flex items-center gap-2 px-1 py-1">
            <Link
              href="/weber"
              className="inline-flex items-center hover:opacity-80 transition-opacity"
              title="Weber AI"
              aria-label="Weber AI"
            >
              <WeberLogo className="h-6 sm:h-6.5 w-auto text-foreground" />
            </Link>
            <Badge
              variant="outline"
              className="h-5 px-2 text-[10.5px] font-mono font-medium rounded-full text-muted-foreground border-border/80 bg-muted/40 select-none"
            >
              Preview
            </Badge>
          </div>

          <Button
            variant="outline"
            onClick={handleNewChat}
            className="w-full justify-start gap-2 h-9 text-xs font-medium border-border/80 bg-background/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-foreground shadow-xs cursor-pointer group/new-chat"
          >
            <Plus className="h-4 w-4 text-foreground/80 group-hover/new-chat:text-sidebar-accent-foreground shrink-0 transition-colors" />
            <span>New chat</span>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground/80 px-2">
              Past Conversations
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {hasMounted &&
                  conversations.map((conv) => {
                    const isActive = conv.id === activeId;
                    return (
                      <SidebarMenuItem key={conv.id}>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => handleSelectConversation(conv.id)}
                          className="cursor-pointer text-xs group/item"
                          title={conv.title}
                        >
                          <MessageSquare
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 transition-colors",
                              isActive
                                ? "text-sidebar-accent-foreground font-medium"
                                : "text-muted-foreground opacity-70 group-hover/item:opacity-100"
                            )}
                          />
                          <span className="truncate">{conv.title}</span>
                        </SidebarMenuButton>
                        <SidebarMenuAction
                          showOnHover
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv.id);
                          }}
                          title="Delete conversation"
                          className="cursor-pointer text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </SidebarMenuAction>
                      </SidebarMenuItem>
                    );
                  })}
                {(!hasMounted || conversations.length === 0) && (
                  <div className="px-3 py-6 text-center text-xs text-muted-foreground/60 select-none">
                    No past conversations
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/50 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground select-none"
              >
                <Avatar className="size-8 rounded-full after:hidden after:border-0 shrink-0">
                  <AvatarFallback className="rounded-full bg-muted text-muted-foreground">
                    <User className="size-4 text-foreground/80" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xs text-foreground">Jane Doe</span>
                  <span className="truncate text-[11px] text-muted-foreground font-normal">
                    janedoe@gmail.com
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* ----------------- MAIN CHAT INSET ----------------- */}
      <SidebarInset className="relative flex flex-col flex-1 h-dvh max-h-dvh overflow-hidden bg-background">
        {/* Top Chat Bar */}
        <WeberTopChatBar activeTitle={activeTitle} hasMessages={messages.length > 0} />

        {/* Ambient background glows */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-sky-500/[0.04] dark:bg-sky-500/[0.07] blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-12 right-1/4 w-[420px] h-[320px] bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* ----------------- DYNAMIC VIEW (INITIAL vs ACTIVE CONVERSATION) ----------------- */}
        {messages.length === 0 ? (
          /* Initial State: Greeting above conversation bar */
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-16 flex-1 flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Greeting Header */}
            <section className="text-center max-w-2xl mx-auto mb-8 space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
                Hi{" "}
                <span className="text-[#84cc16] dark:text-[#a3e635] text-lime-500 dark:text-lime-400 font-bold">
                  Human
                </span>
                . What can I do for you today?
              </h1>
            </section>

            {/* Conversation Bar */}
            <div className="w-full relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="relative"
              >
                <div
                  className={cn(
                    "flex gap-2 px-3.5 py-2 rounded-2xl bg-card/90 border border-border/80 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30 backdrop-blur-xl transition-all shadow-xl",
                    input.includes("\n") ? "items-end" : "items-center"
                  )}
                >
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything"
                    rows={1}
                    autoFocus
                    className="flex-1 bg-transparent border-0 outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 py-1.5 px-1 min-h-[24px] max-h-[180px] leading-6 transition-all"
                  />

                  <Button
                    type="submit"
                    disabled={!input.trim()}
                    size="icon"
                    className="h-8 w-8 rounded-full shrink-0 text-white transition-all cursor-pointer p-0 shadow-xs flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500"
                    title="Send message (Enter)"
                  >
                    <ArrowUp className="h-4 w-4 text-white" />
                  </Button>
                </div>

                <div className="flex items-center justify-center mt-2.5 px-1 text-[11px] text-muted-foreground text-center">
                  <span>Weber can make mistakes. Verify facts.</span>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Conversation View: Directly on page without boxed card wrapper */
          <div className="flex-1 flex flex-col justify-between min-h-0 w-full animate-in fade-in duration-300">
            {/* Base Chat Message Scroller directly on the page */}
            <MessageScrollerProvider autoScroll>
              <MessageScroller className="flex-1 min-h-0">
                <MessageScrollerViewport
                  ref={viewportRef}
                  onScroll={handleViewportScroll}
                  className="px-4 sm:px-6 md:px-8 py-6 h-full overflow-y-auto overscroll-contain"
                >
                  <MessageScrollerContent
                    className={cn(
                      "w-full max-w-3xl mx-auto space-y-6 transition-all duration-300 ease-out",
                      isClearingMessages && "opacity-0 -translate-y-6 scale-[0.98] filter blur-[2px]"
                    )}
                  >
                    {messages.map((msg, idx) => {
                      const isUser = msg.role === "user";
                      return (
                        <MessageScrollerItem
                          key={msg.id}
                          messageId={msg.id}
                          scrollAnchor={isUser && idx === messages.length - 2}
                        >
                          <UiMessage align={isUser ? "end" : "start"}>
                            <MessageContent
                              className={isUser ? "items-end" : "items-start"}
                            >
                              <Bubble
                                align={isUser ? "end" : "start"}
                                variant={isUser ? "default" : "muted"}
                                className={cn(
                                  isUser
                                    ? "max-w-[85%] sm:max-w-[78%]"
                                    : "max-w-full"
                                )}
                              >
                                <BubbleContent
                                  className={cn(
                                    "rounded-2xl px-4 py-3 text-sm shadow-xs max-w-full",
                                    isUser
                                      ? "bg-foreground text-background font-sans"
                                      : "bg-muted/40 border border-border/60 text-foreground"
                                  )}
                                >
                                  {isUser ? (
                                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                                      {renderInline(msg.content, `usr-${msg.id}`)}
                                    </div>
                                  ) : (
                                    <div>
                                      {msg.content ? (
                                        (() => {
                                          const parsed = parseThinkingContent(msg.content);
                                          return (
                                            <div className="space-y-3">
                                              {parsed.thinking && (
                                                <Trace className="mb-2">
                                                  <TraceCollapsible defaultOpen={parsed.isThinkingActive}>
                                                    <TraceCollapsibleTrigger>
                                                      <TraceLine status={parsed.isThinkingActive ? "running" : undefined}>
                                                        <TraceTitle className="text-xs font-medium">
                                                          {parsed.isThinkingActive ? "Thinking…" : "Thought"}
                                                        </TraceTitle>
                                                      </TraceLine>
                                                    </TraceCollapsibleTrigger>
                                                    <TraceCollapsibleContent>
                                                      <div className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed py-1">
                                                        {parsed.thinking}
                                                      </div>
                                                    </TraceCollapsibleContent>
                                                  </TraceCollapsible>
                                                </Trace>
                                              )}
                                              {parsed.message ? (
                                                renderMessageContent(
                                                  parsed.message
                                                )
                                              ) : parsed.isThinkingActive ? null : (
                                                renderMessageContent(
                                                  msg.content
                                                )
                                              )}
                                            </div>
                                          );
                                        })()
                                      ) : (
                                        <div className="flex items-center gap-2 py-0.5 text-sm font-medium text-muted-foreground animate-in fade-in duration-200">
                                          <Spinner className="size-3.5 text-muted-foreground animate-spin shrink-0" />
                                          <span>Thinking</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </BubbleContent>
                              </Bubble>

                              <MessageFooter className="text-[10px] font-mono text-muted-foreground/70 px-1">
                                {msg.timestamp}
                              </MessageFooter>
                            </MessageContent>
                          </UiMessage>
                        </MessageScrollerItem>
                      );
                    })}

                    {isLoading &&
                      messages[messages.length - 1]?.role === "user" && (
                        <MessageScrollerItem messageId="generating-indicator">
                          <UiMessage align="start">
                            <MessageContent>
                              <Bubble variant="muted" align="start">
                                <BubbleContent className="rounded-2xl px-4 py-3 bg-muted/40 border border-border/60 text-foreground text-sm flex items-center gap-2">
                                  <Spinner className="size-3.5 text-muted-foreground animate-spin shrink-0" />
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Thinking
                                  </span>
                                </BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </UiMessage>
                        </MessageScrollerItem>
                      )}
                    <div ref={bottomRef} className="h-px w-full pointer-events-none" />
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton
                  onClick={() => {
                    isAtBottomRef.current = true;
                    scrollToBottom(true);
                  }}
                />
              </MessageScroller>
            </MessageScrollerProvider>

            {/* Input Bar docked directly at bottom of page */}
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-6 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="relative"
              >
                <div
                  className={cn(
                    "flex gap-2 px-3.5 py-2 rounded-2xl bg-card/90 border border-border/80 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30 backdrop-blur-xl transition-all shadow-lg",
                    input.includes("\n") ? "items-end" : "items-center"
                  )}
                >
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything"
                    rows={1}
                    className={cn(
                      "flex-1 bg-transparent border-0 outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 py-1.5 px-1 min-h-[24px] max-h-[160px] leading-6 transition-all",
                      isClearCommand(input) && "font-mono text-emerald-600 dark:text-emerald-400 font-medium tracking-wide"
                    )}
                  />

                  {isLoading ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={stopGeneration}
                      className="h-8 w-8 rounded-full shrink-0 text-red-400 border-red-500/40 hover:bg-red-500/10 cursor-pointer p-0 flex items-center justify-center"
                      title="Stop generation"
                    >
                      <Square className="h-3.5 w-3.5 fill-current" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!input.trim()}
                      size="icon"
                      className="h-8 w-8 rounded-full shrink-0 text-white transition-all cursor-pointer p-0 shadow-xs flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500"
                      title={isClearCommand(input) ? "Execute clear (Enter)" : "Send message (Enter)"}
                    >
                      <ArrowUp className="h-4 w-4 text-white" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-center mt-2 px-1 text-[11px] text-muted-foreground text-center">
                  <span>Weber can make mistakes. Verify facts.</span>
                </div>
              </form>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
