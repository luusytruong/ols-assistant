import prisma from "../lib/prisma.js";
import {
  ProductListSchema,
  type ProductSearch,
} from "../types/product.schema.js";
import { Prisma } from "@prisma/client";

export const productService = {
  async getProducts() {
    return ProductListSchema.parse(
      await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),
    );
  },

  async searchProducts(params: ProductSearch) {
    const { keyword, minPrice, maxPrice } = params;
    const where: Prisma.ProductWhereInput = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const priceFilter: Prisma.DecimalFilter = {};
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      priceFilter.gte = minPrice;
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      priceFilter.lte = maxPrice;
    }
    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter;
    }

    return ProductListSchema.parse(
      await prisma.product.findMany({
        where,
        orderBy: {
          price: "asc",
        },
      }),
    );
  },
};
