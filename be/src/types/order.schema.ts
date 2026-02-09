import z from "zod";

export const OrderItemBaseSchema = z.object({
  productId: z.number().describe("ID sản phẩm"),
  quantity: z.number().describe("Số lượng sản phẩm"),
});

export const OrderProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  // image: z.string(),
  // price: z.preprocess((val) => Number(val), z.number()),
  // description: z.string().nullable(),
});

export const OrderItemResponseSchema = z
  .object({
    id: z.number(),
    orderId: z.number(),
    productId: z.number(),
    quantity: z.number(),
    price: z.preprocess((val) => Number(val), z.number()),
    product: OrderProductSchema,
  })
  .transform((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    productName: item.product.name,
  }));

export const OrderCustomerSchema = z.object({
  customerName: z
    .string()
    .min(1, "Tên khách hàng không được để trống")
    .describe("Tên khách hàng"),
  customerPhone: z
    .string()
    .min(10, "Số điện thoại không hợp lệ")
    .describe("Số điện thoại khách hàng"),
  customerAddress: z
    .string()
    .min(1, "Địa chỉ không được để trống")
    .describe("Địa chỉ khách hàng"),
  customerEmail: z
    .string()
    .nullable()
    .or(z.literal(""))
    .describe("Email khách hàng"),
});

export const OrderBaseSchema = z.object({
  id: z.number(),
  code: z.string(),
  status: z.string(),
  totalPrice: z.preprocess((val) => Number(val), z.number()),
});

export const OrderSchema = OrderBaseSchema.merge(OrderCustomerSchema).extend({
  items: z.array(OrderItemResponseSchema),
  note: z.string().nullable(),
});

export const OrderRequestSchema = OrderCustomerSchema.extend({
  items: z
    .array(OrderItemBaseSchema)
    .min(1, "Đơn hàng phải có ít nhất một sản phẩm")
    .describe("Danh sách sản phẩm"),
  note: z.string().nullable(),
});

export const OrderUpdateSchema = z.object({
  id: z.string(),
  customerName: z.string().min(1).nullable(),
  customerPhone: z.string().min(10).nullable(),
  customerAddress: z.string().min(1).nullable(),
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
