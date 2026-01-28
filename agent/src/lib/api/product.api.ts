import type { ProductSearch } from "../../types/product.schema.js";
import api from "./api.js";

export const productApi = {
  getProducts: async () => {
    const res = await api.get("/products");
    return res.data;
  },
  getProductById: async (id: string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  searchProducts: async (params: ProductSearch) => {
    const res = await api.post("/products/search", params);
    return res.data;
  },
};
