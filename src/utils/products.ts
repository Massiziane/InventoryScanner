import { SearchResponse } from "@/types";

export async function searchProductByBarcode(
  barcode: string
): Promise<SearchResponse | null> {
  const response = await fetch(
    `/api/products/search-product?barcode=${encodeURIComponent(barcode)}`
  );

  if (!response.ok) {
    return null;
  }

  return response.json() as Promise<SearchResponse>;
}