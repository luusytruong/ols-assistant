import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { MessageCircleMore } from "lucide-react";

export function ChatWindow() {
  const { messages, isLoading, sendMessage } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex h-svh w-full items-center justify-center bg-muted/40">
      <div className="flex h-full w-full flex-col overflow-hidden backdrop-blur-md">
        <ChatHeader />

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground p-8">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <MessageCircleMore className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Xin chào!</h3>
              <p className="mt-1 max-w-md text-sm">
                Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} {...msg} sendMessage={sendMessage} />
              ))}
              {isLoading && (
                <div className="h-10 flex w-full mb-4 justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="relative max-w-[85%] rounded-2xl px-3 py-3 text-sm leading-relaxed bg-muted text-foreground border border-border/50 rounded-bl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
