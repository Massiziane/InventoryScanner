import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get("barcode");

  if (!barcode) {
    return Response.json({ error: "Barcode is required" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { barcode },
  });

  if (!product) {
    return Response.json({ found: false, product: null }, { status: 404 });
  }

  return Response.json({ found: true, product });
}