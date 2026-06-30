import { prisma } from "@/lib/prisma";
import { lookupProductFromUpcItemDb } from "@/utils/upcitemdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get("barcode")?.trim();

  if (!barcode) {
    return Response.json({ error: "Barcode is required" }, { status: 400 });
  }

  const product = await prisma.product.findFirst({
    where: { barcode },
  });

  if (product) {
    return Response.json({
      found: true,
      source: "local",
      product,
      externalProduct: null,
    });
  }

  const externalProduct = await lookupProductFromUpcItemDb(barcode);

  return Response.json({
    found: false,
    source: externalProduct ? "upcitemdb" : null,
    product: null,
    externalProduct,
  });
}