# OPENAI AGENTS SDK

## 1. GIỚI THIỆU

### 1.1. OpenAI Agents SDK là gì?

OpenAI Agents SDK là thư viện JavaScript/TypeScript do OpenAI phát triển, giúp lập trình viên xây dựng các ứng dụng AI Agent. SDK này đơn giản, dễ học và có thể sử dụng trong các dự án thực tế.

### 1.2. Tại sao nên sử dụng?

- Dễ học, không cần kiến thức phức tạp
- Tự động xử lý các tác vụ lặp đi lặp lại
- Hỗ trợ nhiều agent làm việc cùng nhau
- Có công cụ debug tích hợp sẵn

---

## 2. CÁC KHÁI NIỆM CƠ BẢN

### 2.1. Agent

Agent là một AI được cấu hình với hướng dẫn và công cụ để thực hiện nhiệm vụ.

**Ví dụ:**

```typescript
import { Agent } from "@openai/agents";

const agent = new Agent({
  name: "Assistant",
  instructions: "Bạn là trợ lý hỗ trợ người dùng",
  model: "gpt-4o",
});
```

### 2.2. Tools (Công cụ)

Tools là các chức năng mà agent có thể gọi để thực hiện công việc cụ thể.

**Ví dụ đơn giản:**

```typescript
import { tool } from "@openai/agents";
import { z } from "zod";

const getWeather = tool({
  name: "get_weather",
  description: "Lấy thông tin thời tiết",
  parameters: z.object({
    location: z.string(),
  }),
  execute: async ({ location }) => {
    return `Thời tiết tại ${location}: Nắng, 25°C`;
  },
});
```

### 2.3. Handoffs (Chuyển giao)

Handoffs cho phép một agent chuyển công việc sang agent khác khi cần.

**Ví dụ:**

```typescript
const mathAgent = new Agent({
  name: "Math Expert",
  instructions: "Bạn giải toán",
});

const historyAgent = new Agent({
  name: "History Expert",
  instructions: "Bạn trả lời câu hỏi lịch sử",
});

const mainAgent = new Agent({
  name: "Main Agent",
  instructions: "Phân loại câu hỏi và chuyển đến chuyên gia phù hợp",
  handoffs: [mathAgent, historyAgent],
});
```

### 2.4. Sessions (Phiên làm việc)

Session lưu lại cuộc trò chuyện để agent có thể nhớ ngữ cảnh.

```typescript
import { OpenAIConversationsSession } from "@openai/agents";

const session = new OpenAIConversationsSession();

await run(agent, "Xin chào", { session });
await run(agent, "Tôi vừa nói gì?", { session });
// Agent sẽ nhớ được câu "Xin chào"
```

---

## 3. CÁCH HOẠT ĐỘNG

### 3.1. Agent Loop (Vòng lặp Agent)

```
1. Người dùng đặt câu hỏi
2. Agent xử lý bằng AI
3. AI quyết định:
   - Trả lời trực tiếp → Kết thúc
   - Gọi công cụ → Thực hiện → Quay lại bước 2
   - Chuyển sang agent khác → Quay lại bước 2
4. Trả kết quả
```

### 3.2. Multi-Agent System

**Mô hình 1: Manager và Specialist**

- Agent chính điều phối
- Các agent chuyên môn xử lý từng phần
- Kết quả tập hợp về agent chính

**Mô hình 2: Handoffs**

- Agent phân loại yêu cầu
- Chuyển sang agent chuyên môn
- Agent chuyên môn xử lý trực tiếp

---

## 4. THỰC HÀNH

### 4.1. Cài đặt

```bash
npm install @openai/agents zod
```

Yêu cầu:

- Node.js >= 18
- OpenAI API Key

### 4.2. Chatbot đơn giản

```typescript
import { Agent, run } from "@openai/agents";

const agent = new Agent({
  name: "Assistant",
  instructions: "Bạn là trợ lý thân thiện",
});

const result = await run(agent, "Xin chào!");
console.log(result.finalOutput);
```

### 4.3. Chatbot có công cụ tính toán

```typescript
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const calculateTool = tool({
  name: "calculate",
  description: "Thực hiện phép tính",
  parameters: z.object({
    expression: z.string(),
  }),
  execute: async ({ expression }) => {
    try {
      const result = eval(expression);
      return `Kết quả: ${result}`;
    } catch (error) {
      return "Biểu thức không hợp lệ";
    }
  },
});

const mathAgent = new Agent({
  name: "Math Assistant",
  instructions: "Bạn hỗ trợ tính toán. Sử dụng công cụ calculate khi cần.",
  tools: [calculateTool],
});

const result = await run(mathAgent, "123 nhân 456 bằng bao nhiêu?");
console.log(result.finalOutput);
```

---

## 5. SO SÁNH VỚI FRAMEWORK KHÁC

| Đặc điểm    | OpenAI Agents | LangChain | AutoGen    |
| ----------- | ------------- | --------- | ---------- |
| Độ khó      | Dễ            | Khó       | Trung bình |
| Phức tạp    | Thấp          | Cao       | Trung bình |
| Multi-agent | Có            | Có        | Có         |
| Dễ học      | Cao           | Thấp      | Trung bình |

**Nên dùng OpenAI Agents SDK khi:**

- Mới bắt đầu học về AI agents
- Cần xây dựng ứng dụng đơn giản
- Dùng các model của OpenAI

---

## 6. ƯU ĐIỂM VÀ HẠN CHẾ

### 6.1. Ưu điểm

- Dễ học và dễ sử dụng
- Code đơn giản, dễ hiểu
- Có công cụ debug tốt
- Phù hợp cho người mới bắt đầu

### 6.2. Hạn chế

- Chỉ dùng được với OpenAI models
- Chi phí cao khi dùng nhiều
- Chưa phù hợp cho hệ thống rất phức tạp

---

## 7. KẾT LUẬN

OpenAI Agents SDK là công cụ tốt cho người mới bắt đầu học về AI agents. Framework này đơn giản, dễ hiểu và có đủ tính năng để xây dựng các ứng dụng thực tế.

Qua quá trình tìm hiểu, em nhận thấy:

- SDK này phù hợp để học và thực hành
- Documentation rõ ràng, dễ theo dõi
- Có thể áp dụng vào các dự án nhỏ

Hướng phát triển tiếp theo:

- Thực hành với các ví dụ phức tạp hơn
- Tích hợp vào dự án thực tế
- Học thêm về các pattern nâng cao

---

## 8. TÀI LIỆU THAM KHẢO

1. OpenAI Agents Documentation - https://openai.github.io/openai-agents-js/
2. GitHub Repository - https://github.com/openai/openai-agents-js
