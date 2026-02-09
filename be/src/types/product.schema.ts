import z from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.preprocess((val) => Number(val), z.number()),
  description: z.string().nullable(),
  stock: z.number().nullable(),
  image: z.string().nullable(),
  weight: z.string().nullable(),
  discount: z.string().nullable(),
});

export const ProductListSchema = z.array(ProductSchema);

export const ProductSearchSchema = z.object({
  keyword: z
    .string()
    .nullable()
    .describe("Từ khóa tìm kiếm không chứa từ 'trà'"),
  minPrice: z
    .union([z.number(), z.string()])
    .nullable()
    .describe("Giá thấp nhất >= sản phẩm"),
  maxPrice: z
    .union([z.number(), z.string()])
    .nullable()
    .describe("Giá cao nhất <= sản phẩm"),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductSearch = z.infer<typeof ProductSearchSchema>;
