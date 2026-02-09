import { z } from "zod";
import type { PrismaSession } from "./session.js";

export function formatZodError(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return `${path ? `${path}: ` : ""}${issue.message}`;
    })
    .join(", ");
}

export async function getInfoFromSession(session: PrismaSession) {
  let toolResult;
  let type;
  try {
    const items = await session.getItems(3);
    const recentItem = items.find((item) => {
      if (item.type !== "function_call_result") return false;
      const match = item.name.match(/(product|order)/);
      if (!match) return false;
      type = match[1];
      return true;
    });
    toolResult = JSON.parse((recentItem as any)?.output?.text || "null");
  } catch (error) {}
  return { toolResult, type };
}
