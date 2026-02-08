import { Agent, tool } from "@openai/agents";
import z from "zod";
import { orderService } from "../services/index.js";
import {
  OrderRequestSchema,
  OrderUpdateSchema,
} from "../types/order.schema.js";
import { orderAgentInstructions } from "./instructions.js";
import { AgentResponseSchema } from "../types/agent.response.js";

const createOrder = tool({
  name: "create_order",
  description: "Tạo đơn hàng mới",
  parameters: OrderRequestSchema,
  execute: async (order) => {
    console.log("calling create order", order);
    try {
      const result = await orderService.createOrder(order);
      return result;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      throw error;
    }
  },
});

const getOrder = tool({
  name: "get_order",
  description: "Tra cứu đơn hàng",
  parameters: z.object({
    id: z.string().optional().describe("Mã đơn hàng hoặc ID"),
    phone: z.string().optional().describe("Số điện thoại khách hàng"),
  }),
  execute: async ({ id, phone }) => {
    console.log("calling get order", { id, phone });
    try {
      if (id) {
        // Try code first, then ID if numeric
        let order = await orderService.getOrderByCode(id);
        if (!order && !isNaN(Number(id))) {
          order = await orderService.getOrderById(id);
        }
        return order;
      }
      if (phone) {
        return await orderService.getOrderByPhone(phone);
      }
      return "Vui lòng cung cấp mã đơn hàng hoặc số điện thoại";
    } catch (error) {
      console.error("Lỗi khi tra cứu đơn hàng:", error);
      throw error;
    }
  },
});

const updateOrder = tool({
  name: "update_order",
  description: "Cập nhật đơn hàng",
  parameters: OrderUpdateSchema,
  execute: async (updateData) => {
    console.log("calling update order", updateData);
    try {
      const result = await orderService.updateOrder(updateData.id, updateData);
      return result;
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      throw error;
    }
  },
});

const orderAgent = new Agent({
  name: "Order Agent",
  instructions: orderAgentInstructions,
  model: "gpt-4o-mini",
  tools: [createOrder, getOrder, updateOrder],
  outputType: AgentResponseSchema,
});

export default orderAgent;
