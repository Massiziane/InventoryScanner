import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  barcode: z.string().min(1, "Barcode is required").max(100),
  sku: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
  location: z.string().max(100).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;