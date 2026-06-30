export async function lookupExternalProduct(barcode: string) {
  const response = await fetch(
    `/api/products/lookup-external?barcode=${encodeURIComponent(barcode)}`
  );

  if (!response.ok) return null;

  const data = await response.json();

  return data.product;
}