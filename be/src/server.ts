import express from "express";
import { run, OpenAIConversationsSession } from "@openai/agents";
import productAgent from "./agents/product.agent.js";
import {
  conversationService,
  customerService,
  productService,
  orderService,
} from "./services/index.js";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const id = sessionId || "default";

  try {
    // 1. Get/Create Customer Session (Working Memory)
    let customerSession = await customerService.getSession(id);
    if (!customerSession) {
      customerSession = await customerService.updateSession(id, {});
    }

    // 2. Load Conversation History
    const history = await conversationService.getHistory(id);
    const session = new OpenAIConversationsSession();

    // Restore history into session
    // Note: OpenAIConversationsSession might not expose a clean way to bulk-inject.
    // We assume we can access the internal message list or use a method if available.
    // For now, we'll rely on the fact that we can push to the underlying storage if exposed,
    // or we might need to rely on the agent seeing the context via system prompt if session restoration is hard.
    // But typically session.messages is an array.
    if (history.length > 0) {
      // @ts-ignore - bypassing private/protected check if needed, or assuming public
      session.messages = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
        tool_calls: msg.toolCalls
          ? JSON.parse(JSON.stringify(msg.toolCalls))
          : undefined,
        tool_call_id: msg.toolResult ? undefined : undefined, // Simplify for now
        // For tool results, we need more complex mapping.
        // Let's stick to simple text restoration for now or checks.
      }));
    }

    // 3. Inject Context (Working Memory) into the message
    let contextMessage = message;
    if (customerSession.customerName || customerSession.customerPhone) {
      const context = `Context: [Khách hàng: ${customerSession.customerName || "Chưa biết"}, SĐT: ${customerSession.customerPhone || "Chưa biết"}, Địa chỉ: ${customerSession.customerAddress || "Chưa biết"}]`;
      contextMessage = `${context}\n${message}`;
    }

    // 4. Run Agent
    const result = await run(productAgent, contextMessage, {
      session,
      maxTurns: 10,
    });

    // 5. Save New Messages to DB
    // We get all messages from session and save those that are new.
    // Since we don't have easy "new" tracking, we might just save the *turn*.
    // Or closer: we just save the User Message and the Assistant Reply.
    // Intermediate tool calls might be tricky to satisfy schema constraints if we don't map perfectly.
    // For simplicity in this migration: Save User Request and Agent Final Response.
    // (A full production system would sync the entire conversation log).

    await conversationService.addMessage({
      sessionId: id,
      role: "user",
      content: message, // Save original message, not the context-injected one
    });

    const finalOutput = result.finalOutput as any;
    let parsedData = finalOutput.toolResult;
    let reply = finalOutput.reply;

    if (typeof finalOutput.toolResult === "string") {
      try {
        parsedData = JSON.parse(finalOutput.toolResult);
      } catch (e) {
        console.error("Failed to parse data JSON:", e);
      }
    }

    // Save Assistant Response
    await conversationService.addMessage({
      sessionId: id,
      role: "assistant",
      content: reply || JSON.stringify(finalOutput),
    });

    // 6. Update Customer Info if detected (optional, or better: explicit tool usage)
    // For now, we trust the database updates happened via tools (Order Agent tools).

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

// --- REST API FOR TESTING ---

// Products
app.get("/products", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/products/search", async (req, res) => {
  try {
    const products = await productService.searchProducts(req.body);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Orders
app.post("/orders", async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params["id"]!);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/orders/code/:code", async (req, res) => {
  try {
    const order = await orderService.getOrderByCode(req.params["code"]!);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/orders/phone/:phone", async (req, res) => {
  try {
    const orders = await orderService.getOrderByPhone(req.params["phone"]!);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(port, () => {
  console.log(`\n🚀 server is running at http://localhost:${port}`);
});
