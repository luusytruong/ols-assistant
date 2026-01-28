import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (content.trim() && !isLoading) {
      onSend(content.trim());
      setContent("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div className="px-4 pb-4! md:p-0 bg-transparent w-full max-w-3xl mx-auto">
      <div className="relative flex items-end gap-2 focus-within:ring-1 focus-within:ring-ring rounded-4xl border bg-muted p-1 ps-2 md:p-2">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          className="min-h-[20px] max-h-[200px] w-full resize-none border-0 shadow-none focus-visible:ring-0 text-base! bg-transparent!"
          rows={1}
        />
        <Button
          className="gap-1.5 rounded-full size-10 flex items-center justify-center p-0"
          onClick={handleSend}
          disabled={!content.trim() || isLoading}
        >
          <ArrowUp className="size-5.5" />
          <span className="sr-only">Send</span>
        </Button>
        {/* <div className="flex items-center justify-center h-11 w-11"></div> */}
      </div>
      <p className="hidden md:block mt-4 text-center text-xs text-muted-foreground">
        Bot có thể cung cấp thông tin không chính xác. Hãy kiểm tra lại các
        thông tin quan trọng.
      </p>
    </div>
  );
}
