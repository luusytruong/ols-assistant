import prisma from "../lib/prisma.js";

export const conversationService = {
  async addMessage(data: {
    sessionId: string;
    role: string;
    content: string;
    toolCalls?: any;
    toolResult?: string;
  }) {
    return prisma.conversation.create({
      data: {
        sessionId: data.sessionId,
        role: data.role,
        content: data.content,
        toolCalls: data.toolCalls ?? undefined,
        toolResult: data.toolResult ?? null,
      },
    });
  },

  async getHistory(sessionId: string) {
    return prisma.conversation.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });
  },
};
