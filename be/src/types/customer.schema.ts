import z from "zod";

export const CustomerInfoSchema = z.object({
  customerName: z.string().nullable().describe("Tên khách hàng"),
  customerPhone: z.string().nullable().describe("Số điện thoại khách hàng"),
  customerAddress: z.string().nullable().describe("Địa chỉ khách hàng"),
  customerEmail: z.string().nullable().describe("Email khách hàng"),
});
