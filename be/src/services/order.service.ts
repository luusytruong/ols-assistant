import prisma from "../lib/prisma.js";
import {
  type OrderRequest,
  type OrderUpdate,
  OrderRequestSchema,
  OrderSchema,
  OrderUpdateSchema,
} from "../types/order.schema.js";

export const orderService = {
  async createOrder(data: OrderRequest) {
    const validatedData = OrderRequestSchema.parse(data);
    const { items, ...customerInfo } = validatedData;

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalPrice = 0;

    const orderItemsData = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
      }
      const price = Number(product.price);
      totalPrice += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: price,
      };
    });

    const code = `CT${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        code,
        ...customerInfo,
        totalPrice,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return OrderSchema.parse(order);
  },

  async getOrders() {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return OrderSchema.array().parse(orders);
  },

  async getOrderById(id: number | string) {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return order ? OrderSchema.parse(order) : null;
  },

  async getOrderByCode(code: string) {
    const order = await prisma.order.findUnique({
      where: { code },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return order ? OrderSchema.parse(order) : null;
  },

  async getOrderByPhone(phone: string) {
    const orders = await prisma.order.findMany({
      where: { customerPhone: { contains: phone } },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return OrderSchema.array().parse(orders);
  },

  async updateOrder(id: number | string, data: OrderUpdate) {
    const validatedData = OrderUpdateSchema.parse({ ...data, id: String(id) });
    const { id: _, ...updateData } = validatedData;

    // Lọc bỏ các trường null hoặc rỗng vì Prisma model yêu cầu string
    const finalUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== null && v !== ""),
    );

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: finalUpdateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return OrderSchema.parse(order);
  },
};
