import { Agent } from "@openai/agents";
import productAgent from "./product.agent.js";
import orderAgent from "./order.agent.js";
import { AgentResponseSchema } from "../types/agent.response.js";

// router agent
const routerAgent = new Agent({
  name: "Router Agent",
  instructions: `Lễ tân "Chè Thái".
LUÔN CHUYỂN:
- sản phẩm/trà/giá → Product Agent
- đơn hàng/giao hàng → Order Agent
- Không tự trả lời. Ngoài phạm vi Trà → xin lỗi → hỏi sản phẩm, đơn hàng.`,
  model: "gpt-4o-mini",
  handoffs: [productAgent, orderAgent],
  outputType: AgentResponseSchema,
});

export default routerAgent;
