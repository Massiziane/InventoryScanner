type UpcItemDbProduct = {
  title?: string;
  description?: string;
  brand?: string;
  category?: string;
  images?: string[];
};

export async function lookupProductFromUpcItemDb(barcode: string) {
  const response = await fetch(
    `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(
      barcode
    )}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const item: UpcItemDbProduct | undefined = data.items?.[0];

  if (!item) return null;

  return {
    name: item.title ?? "",
    description: item.description ?? "",
    imageUrl: item.images?.[0] ?? "",
    brand: item.brand ?? "",
    category: item.category ?? "",
  };
}