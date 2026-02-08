import prisma from "../lib/prisma.js";

export const customerService = {
  async getSession(sessionId: string) {
    return prisma.customerSession.findUnique({
      where: { sessionId },
    });
  },

  async updateSession(
    sessionId: string,
    data: {
      customerName?: string;
      customerPhone?: string;
      customerAddress?: string;
      customerEmail?: string;
      metadata?: any;
    },
  ) {
    return prisma.customerSession.upsert({
      where: { sessionId },
      update: data,
      create: {
        sessionId,
        ...data,
      },
    });
  },
};
