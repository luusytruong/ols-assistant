import z from "zod";

export const OrderItemBaseSchema = z.object({
  productId: z.number().describe("ID sản phẩm"),
  quantity: z.number().describe("Số lượng sản phẩm"),
});

export const OrderItemResponseSchema = OrderItemBaseSchema.extend({
  id: z.number().describe("ID item"),
  productName: z.string().describe("Tên sản phẩm"),
  price: z.number().describe("Giá sản phẩm"),
  // productImage: z.string().describe("Ảnh sản phẩm"),
});

export const OrderCustomerSchema = z.object({
  customerName: z.string().describe("Tên khách hàng"),
  customerPhone: z.string().describe("Số điện thoại khách hàng"),
  customerAddress: z.string().describe("Địa chỉ khách hàng"),
  customerEmail: z.string().nullable(),
});

export const OrderBaseSchema = z.object({
  id: z.number(),
  code: z.string(),
  status: z.string(),
  totalPrice: z.number(),
});

export const OrderSchema = OrderBaseSchema.merge(OrderCustomerSchema).extend({
  items: z.array(OrderItemResponseSchema),
  note: z.string().nullable(),
});

export const OrderRequestSchema = OrderCustomerSchema.extend({
  items: z.array(OrderItemBaseSchema).describe("Danh sách sản phẩm"),
  note: z.string().nullable(),
});

export const OrderUpdateSchema = z.object({
  id: z.string(),
  customerName: z.string().nullable(),
  customerPhone: z.string().nullable(),
  customerAddress: z.string().nullable(),
  customerEmail: z.string().nullable(),
  note: z.string().nullable(),
});

export type OrderItemBase = z.infer<typeof OrderItemBaseSchema>;
export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>;

export type OrderCustomer = z.infer<typeof OrderCustomerSchema>;

export type OrderBase = z.infer<typeof OrderBaseSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderRequest = z.infer<typeof OrderRequestSchema>;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
