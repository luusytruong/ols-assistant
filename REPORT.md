# BÁO CÁO TÌM HIỂU CÔNG NGHỆ: OPENAI AGENTS SDK

## 1. Giới thiệu chung

OpenAI Agents SDK (dành cho TypeScript/JavaScript) là một thư viện mã nguồn mở được thiết kế để đơn giản hóa quy trình xây dựng các ứng dụng AI Agent. Qua quá trình tìm hiểu tài liệu từ trang chủ, chúng ta có thể thấy SDK này tập trung vào việc giảm thiểu sự phức tạp, cung cấp những thành phần cơ bản nhất (primitives) nhưng đủ mạnh mẽ để tạo ra các hệ thống Agent thông minh.

Mục tiêu chính của SDK là giúp lập trình viên kết nối các mô hình ngôn ngữ lớn (LLM) với các công cụ (tools) và điều phối luồng công việc giữa nhiều Agent với nhau một cách tự nhiên.

## 2. Các khái niệm cốt lõi & Ví dụ thực tế

### 2.1. Agent (Tác nhân)

Agent là thành phần trung tâm, được cấu hình với tính cách (instructions) và khả năng (tools).

**Ví dụ:** `Product Agent` được cấu hình để chuyên trả lời về trà và sản phẩm.

```typescript
// src/agents/product.agent.ts
export const createProductAgent = (sessionId: string) => {
  const orderAgent = createOrderAgent(sessionId);

  return new Agent({
    name: "Product Agent",
    instructions: productAgentInstructions,
    model: "gpt-4o-mini",
    tools: [
      getProducts,
      searchProducts,
      createUpdateCustomerInfoTool(sessionId),
    ],
    handoffs: [orderAgent],
  });
};
```

### 2.2. Tools (Công cụ)

Tools là cách Agent tác động vào thế giới thực. Chúng ta sử dụng `zod` để định nghĩa đầu vào (input), giúp Agent biết chính xác cần gửi dữ liệu gì.

**Ví dụ:** Tool `create_order` dùng để tạo đơn hàng.

```typescript
// src/agents/order.agent.ts
const createOrder = tool({
  name: "create_order",
  description: "Tạo đơn hàng mới cho khách hàng",
  parameters: OrderRequestSchema,
  execute: async (params) => {
    const result = await orderService.createOrder(params);
    return JSON.stringify(result);
  },
});
```

### 2.3. Handoffs (Chuyển giao) & Multi-Agent

Đây là mô hình "Router" đã áp dụng. Product Agent có thể chuyển giao công việc sang Order Agent khi khách hàng muốn đặt hàng.

```typescript
// Product Agent có thể handoff sang Order Agent
const productAgent = new Agent({
  name: "Product Agent",
  handoffs: [orderAgent], // Có thể chuyển việc sang Order Agent
});
```

## 3. Working Memory - Bộ nhớ làm việc

### 3.1. Khái niệm

**Working Memory** là cơ chế lưu trữ thông tin tạm thời về khách hàng trong suốt phiên làm việc. Khác với lịch sử hội thoại (History Context), Working Memory tập trung vào **dữ liệu có cấu trúc** như tên, số điện thoại, địa chỉ - những thông tin cần thiết để hoàn thành giao dịch.

### 3.2. Kiến trúc triển khai

Chúng ta sử dụng bảng `customer_sessions` trong PostgreSQL:

```prisma
model CustomerSession {
  id              Int      @id @default(autoincrement())
  sessionId       String   @unique
  customerName    String?
  customerPhone   String?
  customerAddress String?
  customerEmail   String?
}
```

### 3.3. Cách hoạt động

#### Bước 1: Tool để cập nhật thông tin

Agent được trang bị tool `save_info` để chủ động lưu thông tin:

```typescript
// src/agents/shared.tools.ts
export const createUpdateCustomerInfoTool = (sessionId: string) =>
  tool({
    name: "save_info",
    description:
      "BẮT BUỘC GỌI NGAY LẬP TỨC tool này khi phát hiện khách hàng cung cấp bất kỳ thông tin cá nhân nào như Tên, Số điện thoại, Email hoặc Địa chỉ để lưu vào hệ thống.",
    parameters: CustomerInfoSchema,
    execute: async (info) => {
      const data = {
        customerName: info.customerName ?? null,
        customerPhone: info.customerPhone ?? null,
        customerAddress: info.customerAddress ?? null,
        customerEmail: info.customerEmail ?? null,
      };
      await customerService.updateSession(sessionId, data);
      return "Đã lưu thông tin khách hàng";
    },
  });
```

#### Bước 2: Context Injection

Server tự động "nhắc nhở" AI về thông tin khách hàng ở mỗi request:

```typescript
// src/server.ts
let contextMessage = message;
if (customerSession.customerName || customerSession.customerPhone) {
  const context = `[Context: Khách hàng ${customerSession.customerName || "Chưa biết"}, SĐT: ${customerSession.customerPhone || "Chưa biết"}, Địa chỉ: ${customerSession.customerAddress || "Chưa biết"}]`;
  contextMessage = `${context}\n${message}`;
}
```

### 3.4. Ưu điểm

1. **Thông tin rời rạc**: Khách có thể cung cấp tên trước, SĐT sau, địa chỉ sau nữa - hệ thống vẫn ghi nhớ đầy đủ
2. **Persistent**: Dữ liệu được lưu vào DB, không mất khi restart server
3. **Tự động**: AI tự quyết định khi nào cần lưu thông tin, không cần lập trình viên can thiệp

## 4. History Context - Ngữ cảnh lịch sử

### 4.1. Khái niệm

**History Context** là cơ chế lưu trữ toàn bộ lịch sử hội thoại (user messages, assistant responses, tool calls, tool results) để AI có đủ ngữ cảnh khi trả lời.

### 4.2. Kiến trúc triển khai

Chúng ta implement interface `Session` của OpenAI SDK bằng `PrismaSession`:

```typescript
// src/lib/session.ts
export class PrismaSession implements Session {
  async getItems(limit?: number): Promise<AgentInputItem[]> {
    const messages = await prisma.conversation.findMany({
      where: { sessionId: this.sessionId },
      orderBy: { id: "asc" },
      ...(limit ? { take: -limit } : {}), // Lấy N tin nhắn mới nhất
    });
    return messages.map((msg) => JSON.parse(msg.content));
  }

  async addItems(items: AgentInputItem[]): Promise<void> {
    await prisma.conversation.createMany({
      data: items.map((item) => ({
        sessionId: this.sessionId,
        role: (item as any).role || (item as any).type || "system",
        content: JSON.stringify(item),
      })),
    });
  }
}
```

### 4.3. Cách hoạt động

1. **Tự động lưu**: Mỗi khi `run(agent, message, { session })` được gọi, SDK tự động:
   - Lấy lịch sử cũ qua `session.getItems()`
   - Thêm tin nhắn mới của user
   - Gọi LLM với toàn bộ context
   - Lưu response và tool calls qua `session.addItems()`

2. **Đảm bảo thứ tự**: Sử dụng `id` (autoincrement) thay vì `createdAt` để tránh lỗi thứ tự khi nhiều tin nhắn được tạo cùng lúc

3. **Tối ưu**: Chỉ lấy N tin nhắn gần nhất (thông qua `take: -limit`) để giảm token cost

### 4.4. Ưu điểm

1. **Transparent**: Lập trình viên không cần quản lý lịch sử thủ công
2. **Scalable**: Lưu vào DB, có thể xử lý hàng triệu phiên chat
3. **Debuggable**: Có thể xem lại toàn bộ lịch sử để debug lỗi AI

## 5. Kết luận

OpenAI Agents SDK cung cấp một bộ khung (framework) chuẩn mực. Việc áp dụng các pattern như **Handoffs (Router)**, **Working Memory**, và **History Context** giúp code của chúng ta:

1. **Dễ bảo trì**: Tách nhỏ nghiệp vụ thành từng Agent riêng
2. **Chặt chẽ**: Dữ liệu ra/vào luôn đúng format nhờ Zod
3. **Có trạng thái**: Bot nhớ được thông tin khách hàng và lịch sử chat
4. **Testable**: Có test suite đầy đủ để đảm bảo chất lượng

### 6.1. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
└────────────────────┬────────────────────────────────────┘
                     │ POST /chat
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Express Server                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 1. Load Working Memory (customer_sessions)       │   │
│  │ 2. Inject Context vào message                    │   │
│  │ 3. Load History Context (PrismaSession)          │   │
│  │ 4. Run Agent với session                         │   │
│  │ 5. Extract toolResult từ history                 │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│Product Agent │◄────────►│ Order Agent  │
│              │ handoff  │              │
│ Tools:       │          │ Tools:       │
│ - get_products         │ - create_order│
│ - search_products      │ - get_order   │
│ - save_info │ - update_order│
└──────────────┘          └──────────────┘
        │                         │
        └────────────┬────────────┘
                     ▼
        ┌────────────────────────┐
        │   PostgreSQL Database  │
        │ ┌────────────────────┐ │
        │ │ customer_sessions  │ │ ← Working Memory
        │ │ conversations      │ │ ← History Context
        │ │ products           │ │
        │ │ orders             │ │
        │ └────────────────────┘ │
        └────────────────────────┘
```

## Tài liệu tham khảo

1. [OpenAI Agents SDK Documentation](https://openai.github.io/openai-agents-js/)
2. [Source Code dự án] (thư mục `be/src`)
