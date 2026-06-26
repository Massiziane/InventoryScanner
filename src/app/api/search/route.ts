import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const barcode = searchParams.get("barcode");
  const query = searchParams.get("q");

  if (!barcode && !query) {
    return Response.json(
      { error: "Barcode or search query is required" },
      { status: 400 }
    );
  }

  if (barcode) {
    const product = await prisma.product.findUnique({
      where: {
        barcode,
      },
    });

    if (!product) {
      return Response.json(
        {
          found: false,
          product: null,
        },
        { status: 404 }
      );
    }

    return Response.json({
      found: true,
      product,
    });
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query ?? "",
            mode: "insensitive",
          },
        },
        {
          barcode: {
            contains: query ?? "",
          },
        },
        {
          sku: {
            contains: query ?? "",
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return Response.json({
    found: products.length > 0,
    products,
  });
}