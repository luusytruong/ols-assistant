import type { OrderRequest, OrderUpdate } from "../../types/order.schema.js";
import api from "./api.js";

export const orderApi = {
  createOrder: async (order: OrderRequest) => {
    const res = await api.post("/orders", order);
    return res.data;
  },
  getOrderByPhone: async (phone: string) => {
    const res = await api.get(`/orders/phone/${phone}`);
    return res.data;
  },
  getOrderById: async (id: string) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  getOrderByCode: async (code: string) => {
    const res = await api.get(`/orders/code/${code}`);
    return res.data;
  },
  updateOrder: async (id: string, order: OrderUpdate) => {
    const res = await api.patch(`/orders/${id}`, order);
    return res.data;
  },
};
