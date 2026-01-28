import z from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  stock: z.number(),
  image: z.string(),
  weight: z.string(),
  discount: z.string(),
});

export const ProductResponseSchema = ProductSchema.omit({
  image: true,
});

export const ProductResponseListSchema = z.array(ProductResponseSchema);

export const ProductSearchSchema = z.object({
  keyword: z
    .string()
    .nullable()
    .describe("Từ khóa tìm kiếm không chứa từ 'trà'"),
  minPrice: z.number().nullable().describe("Giá thấp nhất >= sản phẩm"),
  maxPrice: z.number().nullable().describe("Giá cao nhất <= sản phẩm"),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductSearch = z.infer<typeof ProductSearchSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
