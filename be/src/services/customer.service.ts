import prisma from "../lib/prisma.js";

export const customerService = {
  async getSession(sessionId: string) {
    return prisma.customerSession.findUnique({
      where: { sessionId },
    });
  },

  async updateSession(sessionId: string, data: any) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    return prisma.customerSession.upsert({
      where: { sessionId },
      update: cleanData,
      create: {
        sessionId,
        ...cleanData,
      },
    });
  },
};
