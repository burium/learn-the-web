"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

import {
  CornerDownLeftIcon,
  Loader2Icon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";

export default function AssistantDialog({ api }: { api: string }) {
  const [open, setOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api,
    experimental_throttle: 50,
  });
  const isLoading = status === "submitted" || status === "streaming";

  const viewportRef = useRef<HTMLDivElement>(null);

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Add keyboard shortcut to open dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open dialog on Ctrl+/ or Cmd+/ (common shortcut for search/help)
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="fixed bottom-5 right-5 focus-visible:outline-none">
        <div className="bg-fd-accent p-2 rounded-full">
          <SparklesIcon className="size-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-sm bg-fd-popover rounded-xl">
        <DialogHeader className="pb-4">
          <DialogTitle>Learn The Web Assistant</DialogTitle>
          <DialogDescription>
            Answers from AI may be inaccurate, please verify the information.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea
          viewportRef={viewportRef}
          className="flex-1 overflow-y-auto h-[512px] mt-4"
        >
          {messages.length === 0 ? (
            <div className="flex items-start justify-center p-4">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">
                  Welcome to the Learn The Web Assistant
                </h3>
                <p className="text-fd-muted-foreground text-balance">
                  Ask me anything about HTML, CSS, JavaScript or any other web
                  development topic.<br></br> Your chat history is not saved
                  between sessions.
                </p>
                <p className="text-xs text-fd-muted-foreground">
                  Tip: Press{" "}
                  <kbd className="px-1 py-0.5 bg-fd-muted rounded">Ctrl+/</kbd>{" "}
                  anytime to open this assistant
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const timestamp = message.createdAt || new Date();
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="bg-fd-accent p-2 rounded-full h-min">
                        <SparklesIcon className="size-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "flex flex-col max-w-[calc(100%-3.75rem)]",
                        message.role === "user" ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "block w-full rounded-lg px-4 py-2 text-sm",
                          message.role === "user"
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
                        {message.role === "user" ? (
                          <span>· User</span>
                        ) : (
                          <span>· Assistant</span>
                        )}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="bg-fd-accent p-2 rounded-full h-min">
                        <UserIcon className="size-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
