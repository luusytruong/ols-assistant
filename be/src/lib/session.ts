import { type Session, type AgentInputItem } from "@openai/agents";
import prisma from "./prisma.js";

/**
 * Prisma-backed Session implementation for OpenAI Agents.
 */
export class PrismaSession implements Session {
  private readonly sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async getSessionId(): Promise<string> {
    return this.sessionId;
  }

  async getItems(limit?: number): Promise<AgentInputItem[]> {
    const messages = await prisma.conversation.findMany({
      where: { sessionId: this.sessionId },
      orderBy: { id: "asc" },
      ...(limit ? { take: -limit } : {}),
    });

    return messages.map((msg) => JSON.parse(msg.content));
  }

  async addItems(items: AgentInputItem[]): Promise<void> {
    if (items.length === 0) return;

    await prisma.conversation.createMany({
      data: items.map((item) => ({
        sessionId: this.sessionId,
        role: (item as any).role || (item as any).type || "system",
        content: JSON.stringify(item),
      })),
    });
  }

  async popItem(): Promise<AgentInputItem | undefined> {
    const lastMsg = await prisma.conversation.findFirst({
      where: { sessionId: this.sessionId },
      orderBy: { id: "desc" },
    });

    if (!lastMsg) return undefined;

    await prisma.conversation.delete({
      where: { id: lastMsg.id },
    });

    return JSON.parse(lastMsg.content);
  }

  async clearSession(): Promise<void> {
    await prisma.conversation.deleteMany({
      where: { sessionId: this.sessionId },
    });
  }
}
