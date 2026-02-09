import { tool } from "@openai/agents";
import { customerService } from "../services/index.js";
import { CustomerInfoSchema } from "../types/customer.schema.js";

export const createUpdateCustomerInfoTool = (sessionId: string) =>
  tool({
    name: "save_info",
    description:
      "BẮT BUỘC GỌI NGAY LẬP TỨC tool này khi phát hiện khách hàng cung cấp bất kỳ thông tin cá nhân nào như Tên, Số điện thoại, Email hoặc Địa chỉ để lưu vào hệ thống.",
    parameters: CustomerInfoSchema,
    execute: async (info) => {
      console.log(`[Session: ${sessionId}] Updating customer info:`, info);
      try {
        const data = {
          customerName: info.customerName ?? null,
          customerPhone: info.customerPhone ?? null,
          customerAddress: info.customerAddress ?? null,
          customerEmail: info.customerEmail ?? null,
        };
        await customerService.updateSession(sessionId, data);
        return "Lưu thông tin khách thành công";
      } catch (error) {
        console.error("Lỗi khi lưu thông tin khách hàng:", error);
        return "Lỗi khi lưu thông tin";
      }
    },
  });
