import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  type?: "text" | "product" | "order";
  toolResult?: any;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionId: string;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
  sendMessage: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      sessionId: `session_${Date.now()}`,

      addMessage: (message) => {
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: Math.random().toString(36).substring(7),
              timestamp: Date.now(),
            },
          ],
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),

      clearChat: () => set({ messages: [] }),

      sendMessage: async (content: string) => {
        const { addMessage, setLoading, sessionId } = get();

        addMessage({ role: "user", content });
        setLoading(true);

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content, sessionId }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch response");
          }

          const data = await response.json();

          addMessage({
            role: "bot",
            content: data.reply,
            type: data.type,
            toolResult: data.toolResult,
          });
        } catch (error) {
          console.error("Chat error:", error);
          addMessage({
            role: "bot",
            content:
              "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.",
          });
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
