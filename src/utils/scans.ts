import type { Product, ScanAction } from "@/types";

type ApplyScanResponse = {
  product: Product;
  error?: string;
};

export async function applyProductScan(
  barcode: string,
  action: ScanAction,
  quantity = 1
): Promise<ApplyScanResponse> {
  const response = await fetch("/api/scans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      barcode,
      action,
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Scan failed");
  }

  return data as ApplyScanResponse;
}