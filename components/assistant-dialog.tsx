"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

import {
  CornerDownLeftIcon,
  FileCodeIcon,
  GlobeIcon,
  Loader2Icon,
  MousePointerClickIcon,
  SparklesIcon,
  TrashIcon,
  UserIcon,
  ZapIcon,
  SquareIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Logo } from "@/lib/icons";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

export default function AssistantDialog({ api }: { api: string }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });
  const [tokenUsage, setTokenUsage] = useState(0);

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setInput,
    stop,
    error,
    reload,
  } = useChat({
    api,
    experimental_throttle: 50,
    onFinish: ({}, { usage }) => {
      setTokenUsage(usage.totalTokens);
    },
  });
  const isLoading = status === "submitted" || status === "streaming";
  const isTokenLimitReached = useMemo(() => tokenUsage >= 2560, [tokenUsage]);

  const handleSubmitWithTokenCheck = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (isTokenLimitReached) {
        e.preventDefault();
        return;
      }
      handleSubmit(e);
    },
    [handleSubmit, isTokenLimitReached],
  );

  const viewportRef = useRef<HTMLDivElement>(null);

  const formatTime = useCallback((date: Date) => {
    return timeFormatter.format(date);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      const scrollElement = viewportRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();

      if (status === "streaming") {
        const interval = setInterval(scrollToBottom, 100);
        return () => clearInterval(interval);
      }
    }
  }, [messages, scrollToBottom, status]);

  const submitExample = useCallback(
    (text: string) => {
      if (isTokenLimitReached) return;

      setInput(text);
      setTimeout(() => {
        const formEvent = new Event("submit", { bubbles: true });
        const form = document.querySelector("form");
        if (form) form.dispatchEvent(formEvent);
      }, 0);
    },
    [setInput, isTokenLimitReached],
  );

  const clearChat = useCallback(() => {
    setTokenUsage(0);
    setMessages([]);
  }, [setTokenUsage, setMessages]);

  const TriggerButton = useMemo(
    () => (
      <button className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 focus-visible:outline-none cursor-pointer">
        <div className="bg-fd-accent p-2 rounded-full">
          <SparklesIcon className="size-4" />
        </div>
      </button>
    ),
    [],
  );

  const TokenUsageFooter = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center text-xs text-fd-muted-foreground gap-1">
          <ZapIcon
            className={cn("size-3.5", isTokenLimitReached && "animate-pulse")}
          />
          <span>{tokenUsage} tokens used</span>
          <span className="text-fd-muted-foreground/80">
            / 2560 max {isTokenLimitReached && "(exceeded)"}
          </span>
        </div>
        <button
          onClick={clearChat}
          className="text-xs flex items-center gap-1 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          <TrashIcon className="size-3.5" />
          Clear chat
        </button>
      </div>
    ),
    [tokenUsage, clearChat, isTokenLimitReached],
  );

  const EmptyChatState = useMemo(
    () => (
      <div className="flex items-start justify-center p-4 sm:mt-8">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">
            Welcome to the Learn The Web Assistant
          </h3>
          <p className="text-fd-muted-foreground text-balance">
            Ask me anything about HTML, CSS, JavaScript or any other web
            development topic.
            <br /> Your chat history is not saved between sessions.
          </p>
          <p className="text-xs text-fd-muted-foreground hidden sm:block">
            Tip: Press{" "}
            <kbd className="px-1 py-0.5 bg-fd-muted rounded">Ctrl+/</kbd>{" "}
            anytime to open this assistant
          </p>
          <div className="sm:absolute bottom-0 right-0 w-full">
            <div className="grid sm:grid-cols-3 gap-4 text-sm mt-8">
              <button
                className="flex items-center gap-2 border border-fd-muted p-2 rounded-lg shadow-sm hover:cursor-pointer"
                onClick={() => submitExample("Explain how CSS selectors work")}
              >
                <MousePointerClickIcon className="size-4" />
                Explain CSS selectors
              </button>
              <button
                className="flex items-center gap-2 border border-fd-muted p-2 rounded-lg shadow-sm hover:cursor-pointer"
                onClick={() => submitExample("How Internet works ?")}
              >
                <GlobeIcon className="size-4" />
                How Internet works ?
              </button>
              <button
                className="flex items-center gap-2 border border-fd-muted p-2 rounded-lg shadow-sm hover:cursor-pointer"
                onClick={() => submitExample("Explain the JavaScript basics")}
              >
                <FileCodeIcon className="size-4" />
                JavaScript basics
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    [submitExample],
  );

  const ChatUI = useMemo(
    () => (
      <ScrollArea
        viewportRef={viewportRef}
        className="flex-1 overflow-y-auto h-[512px]"
      >
        {messages.length === 0 ? (
          EmptyChatState
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const timestamp = message.createdAt || new Date();
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    isUser ? "justify-end" : "justify-start",
                  )}
                >
                  {!isUser && (
                    <div className="bg-fd-accent p-2 rounded-full h-min hidden sm:block">
                      <SparklesIcon className="size-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex flex-col max-w-full sm:max-w-[calc(100%-3.75rem)]",
                      isUser ? "items-end" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "block w-full rounded-lg px-4 py-2 text-sm",
                        isUser
                          ? "bg-fd-primary text-fd-primary-foreground"
                          : "bg-fd-muted prose dark:prose-dark prose-code:font-mono prose-code:px-1 prose-code:bg-fd-card prose-code:text-fd-accent-foreground",
                      )}
                    >
                      <MemoizedMarkdown
                        id={message.id}
                        content={message.content}
                      />
                    </div>
                    <div className="text-xs text-fd-muted-foreground mt-1">
                      {formatTime(timestamp)}{" "}
                      <span>· {isUser ? "User" : "Assistant"}</span>
                    </div>
                  </div>
                  {isUser && (
                    <div className="bg-fd-accent p-2 rounded-full h-min hidden sm:block">
                      <UserIcon className="size-4" />
                    </div>
                  )}
                </div>
              );
            })}
            {error && (
              <div className="flex items-start gap-3 justify-start">
                <div className="bg-red-500 p-2 rounded-full h-min hidden sm:block">
                  <AlertTriangleIcon className="size-4 text-white" />
                </div>
                <div className="flex flex-col max-w-full sm:max-w-[calc(100%-3.75rem)] items-start">
                  <div className="block w-full rounded-lg px-4 py-2 text-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
                    <div className="font-medium">Error</div>
                    <p className="mt-1">
                      {error.message ||
                        "Something went wrong with your request."}
                    </p>
                    <button
                      onClick={() => reload()}
                      className="mt-2 inline-flex items-center text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
                    >
                      <RefreshCwIcon className="mr-1 size-3" /> Try again
                    </button>
                  </div>
                  <div className="text-xs text-fd-muted-foreground mt-1">
                    {formatTime(new Date())} <span>· System</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    ),
    [messages, formatTime, EmptyChatState, error],
  );

  const chatFooter = useMemo(
    () => (
      <div className="space-y-2 w-full">
        {messages.length > 0 && TokenUsageFooter}
        <form
          onSubmit={handleSubmitWithTokenCheck}
          className="flex flex-row items-center gap-2 w-full border border-fd-border px-3 rounded-lg shadow-sm"
        >
          <div className="relative size-4">
            {isLoading ? (
              <Loader2Icon className="absolute animate-spin size-full text-fd-muted-foreground" />
            ) : (
              <SparklesIcon className="absolute size-full text-fd-muted-foreground" />
            )}
          </div>
          <Input
            autoFocus
            disabled={isLoading || isTokenLimitReached}
            value={input}
            onChange={handleInputChange}
            maxLength={100}
            placeholder={
              isTokenLimitReached
                ? "Token limit reached..."
                : "Ask about web development..."
            }
            className="flex-1 w-0 py-3 text-base focus-visible:ring-0 outline-none border-0 h-11 shadow-none"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-100 border hover:bg-fd-accent hover:text-fd-accent-foreground text-xs p-1.5 text-fd-destructive hover:text-fd-destructive"
            >
              <SquareIcon className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 border hover:bg-fd-accent hover:text-fd-accent-foreground text-xs p-1.5"
              disabled={isLoading || !input.trim() || isTokenLimitReached}
            >
              <CornerDownLeftIcon className="size-4" />
            </button>
          )}
        </form>
      </div>
    ),
    [
      handleSubmitWithTokenCheck,
      input,
      handleInputChange,
      isLoading,
      messages.length,
      TokenUsageFooter,
      stop,
      isTokenLimitReached,
    ],
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-screen-sm bg-fd-popover rounded-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Logo className="size-5" />
              <DialogTitle>Learn The Web Assistant</DialogTitle>
              <span className="text-xs bg-fd-foreground text-fd-accent px-2 py-0.5 rounded-full">
                Beta
              </span>
            </div>
            <DialogDescription className="leading-relaxed">
              Answers may be inaccurate, please verify information.
            </DialogDescription>
          </DialogHeader>
          {ChatUI}
          <DialogFooter>{chatFooter}</DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent className="bg-fd-popover">
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-5" />
            <DrawerTitle>Learn The Web Assistant</DrawerTitle>
            <span className="text-xs bg-fd-foreground text-fd-accent px-2 py-0.5 rounded-full">
              Beta
            </span>
          </div>
          <DrawerDescription className="leading-relaxed">
            Answers may be inaccurate, please verify information.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 flex-1">{ChatUI}</div>
        <DrawerFooter className="pt-0">{chatFooter}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
