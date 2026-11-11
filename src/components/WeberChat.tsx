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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // When mounted: if mobile, show logo when openMobile is false; if desktop, show logo when open is false.
  // Before mount: sidebar is open by default on desktop (defaultOpen: true), so showHeaderLogo is false.
  const isSidebarOpen = mounted ? (isMobile ? openMobile : open) : true;
  const showHeaderLogo = !isSidebarOpen;

  return (
    <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-20 gap-2">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <SidebarTrigger className="h-8 w-8 hover:bg-muted cursor-pointer shrink-0" />
        {showHeaderLogo && (
          <Link
            href="/weber"
            className="flex items-center gap-2 select-none hover:opacity-80 transition-opacity shrink-0 animate-in fade-in duration-200"
            title="Weber AI"
            aria-label="Weber AI"
          >
            <WeberLogo className="h-5 sm:h-5.5 w-auto text-foreground" />
          </Link>
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
          title="Back to my homepage"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 px-2.5 sm:px-3 text-xs font-medium text-muted-foreground hover:text-foreground border-border/70 hover:border-border hover:bg-muted/50 transition-colors group cursor-pointer whitespace-nowrap"
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to my homepage</span>
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

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend ?? input).trim();
      if (!text || isLoading) return;

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
            "I encountered an issue connecting to the inference server. Please ensure the backend is running (`python -m anaxonic.serve`) or retry.";
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
    [activeId, conversations, input, isLoading, messages, persistConversations, scrollToBottom]
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

  // Render markdown helper (fenced code, bold, lists, headers)
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

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

      // Headings
      if (line.startsWith("### ")) {
        elements.push(
          <h4
            key={i}
            className="font-semibold text-sm text-foreground mt-3 mb-1 tracking-tight"
          >
            {line.slice(4)}
          </h4>
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
            {line.slice(3)}
          </h3>
        );
        i++;
        continue;
      }

      // Unordered lists
      if (line.match(/^[-*]\s+/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
          listItems.push(lines[i].replace(/^[-*]\s+/, ""));
          i++;
        }
        elements.push(
          <ul
            key={`ul-${i}`}
            className="list-disc list-inside space-y-1 my-2 text-sm leading-relaxed text-muted-foreground"
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground/90">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s+/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
          listItems.push(lines[i].replace(/^\d+\.\s+/, ""));
          i++;
        }
        elements.push(
          <ol
            key={`ol-${i}`}
            className="list-decimal list-inside space-y-1 my-2 text-sm leading-relaxed text-muted-foreground"
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground/90">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Blank line
      if (line.trim() === "") {
        i++;
        continue;
      }

      // Regular paragraph
      elements.push(
        <p
          key={i}
          className="text-sm leading-relaxed text-foreground/90 mb-2 last:mb-0"
        >
          {renderInline(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-muted/70 text-foreground font-mono text-[12px] border border-border/40"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const activeConv = conversations.find((c) => c.id === activeId);
  const activeTitle = activeConv ? activeConv.title : "New conversation";

  return (
    <SidebarProvider defaultOpen={true} className="h-dvh max-h-dvh overflow-hidden">
      {/* ----------------- PAST CONVERSATIONS SIDEBAR ----------------- */}
      <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border/70">
        <SidebarHeader className="p-3 border-b border-sidebar-border/50 gap-2.5">
          <div className="flex items-center px-1 py-1">
            <Link
              href="/weber"
              className="inline-flex items-center hover:opacity-80 transition-opacity"
              title="Weber AI"
            >
              <WeberLogo className="h-5 w-auto text-foreground" />
            </Link>
          </div>

          <Button
            variant="outline"
            onClick={handleNewChat}
            className="w-full justify-start gap-2 h-9 text-xs font-medium border-border/80 bg-background/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4 text-white" />
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
                                ? "text-white"
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
            <div className="w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="relative"
              >
                <div
                  className={cn(
                    "flex gap-2 px-3.5 py-2 rounded-2xl bg-card/90 border border-border/80 focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-500/30 backdrop-blur-xl transition-all shadow-xl",
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
                    className="flex-1 bg-transparent border-0 outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 py-1.5 px-1 min-h-[24px] max-h-[180px] leading-6"
                  />

                  <Button
                    type="submit"
                    disabled={!input.trim()}
                    size="icon"
                    className="h-8 w-8 rounded-full shrink-0 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer p-0 shadow-xs flex items-center justify-center"
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
                  <MessageScrollerContent className="w-full max-w-3xl mx-auto space-y-6">
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
                              >
                                <BubbleContent
                                  className={cn(
                                    "rounded-2xl px-4 py-3 text-sm shadow-xs",
                                    isUser
                                      ? "bg-foreground text-background font-sans max-w-[85%] sm:max-w-[78%]"
                                      : "bg-muted/40 border border-border/60 text-foreground max-w-full"
                                  )}
                                >
                                  {isUser ? (
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                      {msg.content}
                                    </p>
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
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-6 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="relative"
              >
                <div
                  className={cn(
                    "flex gap-2 px-3.5 py-2 rounded-2xl bg-card/90 border border-border/80 focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-500/30 backdrop-blur-xl transition-all shadow-lg",
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
                    className="flex-1 bg-transparent border-0 outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 py-1.5 px-1 min-h-[24px] max-h-[160px] leading-6"
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
                      className="h-8 w-8 rounded-full shrink-0 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer p-0 shadow-xs flex items-center justify-center"
                      title="Send message (Enter)"
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
