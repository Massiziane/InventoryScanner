import { prisma } from "@/lib/prisma";
import { createScanLogSchema } from "@/schemas/scan-log";

export async function GET() {
  const scans = await prisma.scanLog.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
    take: 50,
  });

  return Response.json(scans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = createScanLogSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ errors: result.error.flatten() }, { status: 400 });
  }

  const { barcode, productId, action, quantity } = result.data;

  const product =
    productId
      ? await prisma.product.findUnique({ where: { id: productId } })
      : await prisma.product.findUnique({ where: { barcode } });

  if (!product) {
    const scan = await prisma.scanLog.create({
      data: {
        barcode,
        action,
        quantity,
      },
    });

    return Response.json(
      {
        found: false,
        scan,
        message: "Product not found, scan saved only.",
      },
      { status: 404 }
    );
  }

  const stockChange =
    action === "ADD_STOCK"
      ? quantity
      : action === "REMOVE_STOCK" || action === "SALE"
        ? -quantity
        : 0;

  if (product.stock + stockChange < 0) {
    return Response.json(
      { error: "Not enough stock for this action." },
      { status: 400 }
    );
  }

  const [updatedProduct, scan] = await prisma.$transaction([
    prisma.product.update({
      where: { id: product.id },
      data: {
        stock: {
          increment: stockChange,
        },
      },
    }),
    prisma.scanLog.create({
      data: {
        productId: product.id,
        barcode,
        action,
        quantity,
      },
    }),
  ]);

  return Response.json({
    found: true,
    product: updatedProduct,
    scan,
  });
}