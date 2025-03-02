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
  LayoutPanelTopIcon,
  Loader2Icon,
  MousePointerClickIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";

// Memoized formatter to avoid recreating on every render
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

export default function AssistantDialog({ api }: { api: string }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { messages, input, handleInputChange, handleSubmit, status, setInput } =
    useChat({
      api,
      experimental_throttle: 50,
    });
  const isLoading = status === "submitted" || status === "streaming";

  const viewportRef = useRef<HTMLDivElement>(null);

  // Format timestamp (memoized)
  const formatTime = useCallback((date: Date) => {
    return timeFormatter.format(date);
  }, []);

  // Add keyboard shortcut to open dialog
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
      requestAnimationFrame(() => {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Handle submitting example questions
  const submitExample = useCallback(
    (text: string) => {
      setInput(text);
      // Use setTimeout to ensure the input is set before submitting
      setTimeout(() => {
        const formEvent = new Event("submit", { bubbles: true });
        const form = document.querySelector("form");
        if (form) form.dispatchEvent(formEvent);
      }, 0);
    },
    [setInput],
  );

  // Memoized components to prevent unnecessary re-renders
  const TriggerButton = useMemo(
    () => (
      <div className="fixed bottom-5 right-5 focus-visible:outline-none">
        <div className="bg-fd-accent p-2 rounded-full">
          <SparklesIcon className="size-4" />
        </div>
      </div>
    ),
    [],
  );

  const EmptyChatState = useMemo(
    () => (
      <div className="flex items-start justify-center p-4">
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
          <div className="absolute bottom-0 right-0 w-full">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
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
        className="flex-1 overflow-y-auto h-[512px] mt-4"
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
          </div>
        )}
      </ScrollArea>
    ),
    [messages, formatTime, EmptyChatState],
  );

  const chatFooter = useMemo(
    () => (
      <form
        onSubmit={handleSubmit}
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
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about web development..."
          className="flex-1 w-0 py-3 text-base focus-visible:ring-0 outline-none border-0 h-11 shadow-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 border hover:bg-fd-accent hover:text-fd-accent-foreground text-xs p-1.5"
          disabled={isLoading || !input.trim()}
        >
          <CornerDownLeftIcon className="size-4" />
        </button>
      </form>
    ),
    [handleSubmit, input, handleInputChange, isLoading],
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-screen-sm bg-fd-popover rounded-xl">
          <DialogHeader>
            <DialogTitle>Learn The Web Assistant</DialogTitle>
            <DialogDescription>
              Answers from AI may be inaccurate, please verify the information.
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
      <DrawerContent className="bg-fd-popover h-[70vh]">
        <DrawerHeader>
          <DrawerTitle>Learn The Web Assistant</DrawerTitle>
          <DrawerDescription>
            Answers from AI may be inaccurate, please verify the information.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 flex-1 flex flex-col overflow-y-auto">
          {ChatUI}
        </div>
        <DrawerFooter className="pt-0">{chatFooter}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
