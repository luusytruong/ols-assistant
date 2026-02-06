# BÁO CÁO TÌM HIỂU CÔNG NGHỆ: OPENAI AGENTS SDK

## 1. Giới thiệu chung

OpenAI Agents SDK (dành cho TypeScript/JavaScript) là một thư viện mã nguồn mở được thiết kế để đơn giản hóa quy trình xây dựng các ứng dụng AI Agent. Qua quá trình tìm hiểu tài liệu từ trang chủ, chúng ta có thể thấy SDK này tập trung vào việc giảm thiểu sự phức tạp, cung cấp những thành phần cơ bản nhất (primitives) nhưng đủ mạnh mẽ để tạo ra các hệ thống Agent thông minh.

Mục tiêu chính của SDK là giúp lập trình viên kết nối các mô hình ngôn ngữ lớn (LLM) với các công cụ (tools) và điều phối luồng công việc giữa nhiều Agent với nhau một cách tự nhiên.

## 2. Các khái niệm cốt lõi & Ví dụ thực tế

Trong dự án "Chè Thái" (folder `agent` mà nhóm đã phát triển), chúng ta đã áp dụng triệt để những khái niệm này. Dưới đây là lý thuyết kèm theo code minh họa trực tiếp từ mã nguồn dự án.

### 2.1. Agent (Tác nhân)

Agent là thành phần trung tâm, được cấu hình với tính cách (instructions) và khả năng (tools).

**Ví dụ:** `Product Agent` được cấu hình để chuyên trả lời về trà và sản phẩm.

```typescript
// src/agents/product.agent.ts
const productAgent = new Agent({
  name: "Product Agent",
  instructions:
    "Bạn là chuyên gia về trà. Hãy giúp khách chọn đồ uống phù hợp.",
  model: "gpt-4o-mini",
  // Agent này có các công cụ để tra cứu sản phẩm
  tools: [getProducts, searchProducts],
});
```

### 2.2. Tools (Công cụ)

Tools là cách Agent tác động vào thế giới thực. Chúng ta sử dụng `zod` để định nghĩa đầu vào (input), giúp Agent biết chính xác cần gửi dữ liệu gì.

**Ví dụ:** Tool `create_order` dùng để tạo đơn hàng.

```typescript
// src/agents/order.agent.ts
const createOrder = tool({
  name: "create_order",
  description: "Tạo đơn hàng mới, các thông tin phải chính xác",
  // Định nghĩa Schema rõ ràng để Agent điền đúng format
  parameters: OrderRequestSchema,
  execute: async (params) => {
    // Logic gọi API backend thực sự
    const result = await orderApi.createOrder(params);
    return result;
  },
});
```

### 2.3. Handoffs (Chuyển giao) & Multi-Agent

Đây là mô hình "Router" mà chúng ta đã áp dụng. Một Agent (Lễ tân) sẽ đứng ra hứng request và chuyển việc (handoff) cho Agent con phù hợp.

**Ví dụ:** `Router Agent` điều phối công việc giữa `Product Agent` và `Order Agent`.

```typescript
// src/agents/router.agent.ts
const routerAgent = new Agent({
  name: "Router Agent",
  instructions: `Lễ tân "Chè Thái".
  LUÔN CHUYỂN:
  - sản phẩm/trà/giá → Product Agent
  - đơn hàng/giao hàng → Order Agent`,
  // Danh sách các agent mà Router có thể chuyển việc sang
  handoffs: [productAgent, orderAgent],
});
```

Nhờ cơ chế này, chúng ta tách biệt được nghiệp vụ: Router chỉ lo điều hướng, còn việc xử lý logic trà hay đơn hàng là của Agent con.

## 3. Khái niệm Nâng cao: Structured Outputs (Định dạng đầu ra có cấu trúc)

### 3.1. Lý thuyết

Mặc định LLM trả về văn bản (text). Tuy nhiên, để tích hợp vào ứng dụng (Web/App), chúng ta thường cần dữ liệu dạng JSON. SDK hỗ trợ tham số `outputType` để ép Agent trả về đúng cấu trúc mong muốn.

### 3.2. Ví dụ trong dự án

Chúng ta muốn Bot không chỉ trả lời câu thoại (`reply`) mà còn trả về dữ liệu (`toolResult`) để Frontend hiển thị thẻ sản phẩm hoặc đơn hàng.

**Định nghĩa Schema (`src/types/agent.response.ts`):**

```typescript
export const AgentResponseSchema = z.object({
  reply: z.string().describe("Lời thoại trả lời khách hàng"),

  // Loại dữ liệu đi kèm (nếu có)
  type: z.enum(["text", "product", "order"]).nullable(),

  // Dữ liệu JSON stringify để Frontend parse ra hiển thị
  toolResult: z.string().nullable(),
});
```

**Áp dụng vào Agent:**

```typescript
const routerAgent = new Agent({
  // ... cấu hình khác
  outputType: AgentResponseSchema, // Bắt buộc Agent trả về đúng format này
});
```

Khi chạy, kết quả `result.finalOutput` sẽ luôn đảm bảo có đủ các trường `reply`, `type`, giúp Frontend dễ dàng xử lý logic hiển thị.

## 4. Cài đặt & Triển khai

### 4.1. Cài đặt thư viện

```bash
npm install @openai/agents zod
```

### 4.2. Khởi chạy Server (Tích hợp Express)

Trong thực tế, Agent thường chạy trên Server. Dưới đây là cách chúng ta tích hợp SDK với Express và quản lý phiên (`Session`).

**Quản lý Session (`src/server.ts`):**
Chúng ta dùng `OpenAIConversationsSession` để Bot nhớ được ngữ cảnh.

```typescript
const sessions = new Map<string, OpenAIConversationsSession>();

app.post("/chat", async (req, res) => {
  const { sessionId, message } = req.body;

  // Tạo session mới nếu chưa có
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new OpenAIConversationsSession());
  }

  // Chạy Agent với session đã lưu
  const result = await run(routerAgent, message, {
    session: sessions.get(sessionId),
  });

  // Trả về kết quả cho Client
  res.json(result.finalOutput);
});
```

## 5. Kết luận

OpenAI Agents SDK cung cấp một bộ khung (framework) chuẩn mực. Việc áp dụng các pattern như **Handoffs (Router)** và **Structured Outputs** giúp code của chúng ta:

1.  **Dễ bảo trì**: Tách nhỏ nghiệp vụ thành từng Agent riêng.
2.  **Chặt chẽ**: Dữ liệu ra/vào luôn đúng format nhờ Zod.
3.  **Có trạng thái**: Bot nhớ được lịch sử chat nhờ Session.

Đây là nền tảng vững chắc để phát triển các tính năng phức tạp hơn trong tương lai.

## Tài liệu tham khảo

1.  [OpenAI Agents SDK Documentation](https://openai.github.io/openai-agents-js/)
2.  [Source Code dự án] (thư mục `agent/src`)
