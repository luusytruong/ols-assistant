import express from "express";
import { run } from "@openai/agents";
import { createProductAgent } from "./agents/product.agent.js";
import {
  customerService,
  productService,
  orderService,
} from "./services/index.js";
import { PrismaSession } from "./lib/session.js";
import { z } from "zod";
import { formatZodError, getInfoFromSession } from "./lib/utils.js";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Yêu cầu nhập tin nhắn" });
  }

  const id: string = sessionId || "default";

  try {
    // 1. Get/Create Customer Session (Working Memory)
    let customerSession = await customerService.getSession(id);
    if (!customerSession) {
      customerSession = await customerService.updateSession(id, {});
    }

    // 2. Initialize Prisma Session (Handles history & persistence automatically)
    const session = new PrismaSession(id);

    // 3. Inject Context (Working Memory) into the message
    let contextMessage = message;
    if (customerSession.customerName || customerSession.customerPhone) {
      const context = `[Context: Khách hàng ${customerSession.customerName || "Chưa biết"}, SĐT: ${customerSession.customerPhone || "Chưa biết"}, Địa chỉ: ${customerSession.customerAddress || "Chưa biết"}]`;
      contextMessage = `${context}\n${message}`;
    }

    // 4. Run Agent with sessionId
    const productAgent = createProductAgent(id);
    const result = await run(productAgent, contextMessage, {
      session,
      maxTurns: 10,
    });

    // 5. Get tool result from session
    const { toolResult, type } = await getInfoFromSession(session);

    res.json({
      reply: result.finalOutput,
      type,
      toolResult,
      sessionId: id,
    });
  } catch (error) {
    console.error("❌ Lỗi khi xử lý tin nhắn:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Lỗi máy chủ",
    });
  }
});

// --- REST API ---

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
app.get("/orders", async (req, res) => {
  try {
    const orders = await orderService.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: formatZodError(error) });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params["id"]!);
    if (!order) return res.status(404).json({ error: "Không có đơn hàng" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/orders/code/:code", async (req, res) => {
  try {
    const order = await orderService.getOrderByCode(req.params["code"]!);
    if (!order) return res.status(404).json({ error: "Không có đơn hàng" });
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
