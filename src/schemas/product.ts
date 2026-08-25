import { z } from "zod";

const categorySchema = z.enum([
  "FASHION",
  "FOOD",
  "ELECTRONICS",
  "BEAUTY",
  "HOME",
  "OTHER",
]);

const variantSchema = z.object({
  size: z.string().trim().min(1),
  stock: z.number().int().min(0),
});

const promotionSchema = z.object({
  quantity: z.number().int().min(2),
  price: z.number().min(0),
  active: z.boolean().optional().default(true),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1),

  barcode: z.string().trim().min(1),

  description: z.string().nullable().optional(),

  price: z.number().min(0),

  stock: z.number().int().min(0),

  location: z.string().nullable().optional(),

  imageUrl: z.string().nullable().optional(),

  category: categorySchema.nullable().optional(),

  variants: z.array(variantSchema).optional(),

  promotions: z.array(promotionSchema).optional(),
});

export const updateProductSchema = createProductSchema
  .extend({
    sku: z.string().nullable().optional(),
  })
  .partial();