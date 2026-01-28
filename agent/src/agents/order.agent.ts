import { Agent, tool } from "@openai/agents";
import { orderApi } from "../lib/index.js";
import z from "zod";
import {
  OrderRequestSchema,
  OrderUpdateSchema,
} from "../types/order.schema.js";
import { AgentResponseSchema } from "../types/agent.response.js";
import { orderAgentInstructions } from "./instructions.js";

// order tools
const createOrder = tool({
  name: "create_order",
  description: "Tạo đơn hàng mới, các thông tin phải chính xác",
  parameters: OrderRequestSchema,
  execute: async (params) => {
    console.log("calling create order", params);

    try {
      const result = await orderApi.createOrder(params);
      return result;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      throw error;
    }
  },
});

const getOrder = tool({
  name: "get_order",
  description: "Tra cứu đơn hàng theo ID, mã đơn, hoặc SĐT",
  parameters: z.object({
    searchType: z.enum(["id", "code", "phone"]).describe("Loại tìm kiếm"),
    searchValue: z.string().describe("Giá trị tìm kiếm"),
  }),
  execute: async ({ searchType, searchValue }) => {
    console.log("calling get order", { searchType, searchValue });

    try {
      switch (searchType) {
        case "id":
          return await orderApi.getOrderById(searchValue);
        case "code":
          return await orderApi.getOrderByCode(searchValue);
        case "phone":
          return await orderApi.getOrderByPhone(searchValue);
      }
    } catch (error) {
      console.error("Lỗi khi tra đơn:", error);
      throw error;
    }
  },
});

const updateOrder = tool({
  name: "update_order",
  description: "Cập nhật thông tin đơn hàng",
  parameters: OrderUpdateSchema,
  execute: async (params) => {
    console.log("calling update order", params);

    try {
      const result = await orderApi.updateOrder(params.id, params);
      return result;
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      throw error;
    }
  },
});

// order agent
const orderAgent = new Agent({
  name: "Order Agent",
  instructions: orderAgentInstructions,
  model: "gpt-4o-mini",
  tools: [createOrder, getOrder, updateOrder],
  outputType: AgentResponseSchema,
});

export default orderAgent;
