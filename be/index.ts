import { PrismaSession } from "./src/lib/session.js";

const sessionId = "session_1769438416996";

async function main() {
  const session = new PrismaSession(sessionId);

  const items = await session.getItems(4);

  const recentItem = items.find((item) => item.type === "function_call_result");

  console.log((recentItem?.output as any).text);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
