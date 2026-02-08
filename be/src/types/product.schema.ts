import z from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.preprocess((val) => Number(val), z.number()),
  description: z.string().nullable().optional(),
  stock: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  discount: z.string().nullable().optional(),
});

export const ProductListSchema = z.array(ProductSchema);

export const ProductSearchSchema = z.object({
  keyword: z
    .string()
    .nullable()
    .optional()
    .describe("Từ khóa tìm kiếm không chứa từ 'trà'"),
  minPrice: z
    .union([z.number(), z.string()])
    .nullable()
    .optional()
    .describe("Giá thấp nhất >= sản phẩm"),
  maxPrice: z
    .union([z.number(), z.string()])
    .nullable()
    .optional()
    .describe("Giá cao nhất <= sản phẩm"),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductSearch = z.infer<typeof ProductSearchSchema>;
