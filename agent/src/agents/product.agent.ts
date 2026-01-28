import { Agent, tool } from "@openai/agents";
import z from "zod";
import { productApi } from "../lib/index.js";
import { ProductSearchSchema } from "../types/product.schema.js";
import { AgentResponseSchema } from "../types/agent.response.js";
import orderAgent from "./order.agent.js";
import { productAgentInstructions } from "./instructions.js";

// product tools
const getProducts = tool({
  name: "get_products",
  description: "Lấy danh sách trà ngon, hiển thị tên và giá",
  parameters: z.object({}),
  execute: async () => {
    console.log("calling get products");

    try {
      const result = await productApi.getProducts();
      return result;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error;
    }
  },
});

const searchProducts = tool({
  name: "search_products",
  description: `Tìm trà ngon theo khoảng giá hoặc từ khoá không chứa từ 'trà'`,
  parameters: ProductSearchSchema,
  execute: async (params) => {
    console.log("calling search products", params);

    try {
      const result = await productApi.searchProducts(params);
      return result;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      throw error;
    }
  },
});

// product agent
const productAgent = new Agent({
  name: "Product Agent",
  instructions: productAgentInstructions,
  model: "gpt-4o-mini",
  tools: [getProducts, searchProducts],
  handoffs: [orderAgent],
  outputType: AgentResponseSchema,
});

export default productAgent;
