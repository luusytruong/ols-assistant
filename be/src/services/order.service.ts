import prisma from "../lib/prisma.js";
import type { OrderRequest, OrderUpdate } from "../types/order.schema.js";

export const orderService = {
  async createOrder(data: OrderRequest) {
    const { items, ...customerInfo } = data;

    // Fetch products to get prices
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalPrice = 0;

    const orderItemsData = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
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

    return prisma.order.create({
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
  },

  async getOrderById(id: number | string) {
    return prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  async getOrderByCode(code: string) {
    return prisma.order.findUnique({
      where: { code },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  async getOrderByPhone(phone: string) {
    return prisma.order.findMany({
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
  },

  async updateOrder(id: number | string, data: OrderUpdate) {
    // Exclude id from data update to avoid "Unknown arg `id` in data" error if it leaks in
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = data;

    return prisma.order.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },
};
