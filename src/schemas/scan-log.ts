import { z } from "zod";

export const scanActionSchema = z.enum([
  "ADD_STOCK",
  "REMOVE_STOCK",
  "SALE",
  "CHECK",
]);

export const createScanLogSchema = z.object({
  productId: z.string().optional().nullable(),
  barcode: z.string().min(1, "Barcode is required").max(100),
  action: scanActionSchema,
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").default(1),
});

export type ScanAction = z.infer<typeof scanActionSchema>;
export type CreateScanLogInput = z.infer<typeof createScanLogSchema>;