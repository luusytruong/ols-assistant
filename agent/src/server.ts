import express from "express";
import { config } from "dotenv";
config();
import { run, OpenAIConversationsSession } from "@openai/agents";
import productAgent from "./agents/product.agent.js";

const app = express();
const port = 3001;
const sessions = new Map<string, OpenAIConversationsSession>();

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const id = sessionId || "default";
  if (!sessions.has(id)) {
    sessions.set(id, new OpenAIConversationsSession());
  }
  const session = sessions.get(id)!;

  try {
    const result = await run(productAgent, message, {
      session,
      maxTurns: 10,
    });

    const finalOutput = result.finalOutput as any;
    let parsedData = finalOutput.toolResult;

    if (typeof finalOutput.toolResult === "string") {
      try {
        parsedData = JSON.parse(finalOutput.toolResult);
      } catch (e) {
        console.error("Failed to parse data JSON:", e);
      }
    }

    res.json({
      ...finalOutput,
      toolResult: parsedData,
      sessionId: id,
    });
  } catch (error) {
    console.error("❌ Error processing chat:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

app.listen(port, () => {
  console.log(`\n🚀 Agent server is running at http://localhost:${port}`);
  console.log(`💬 API Endpoint: POST http://localhost:${port}/chat`);
});
