import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const quantity = Number(body.quantity);
    const variantId = body.variantId ?? null;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return Response.json(
        {
          error: "Quantity must be greater than zero.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return Response.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (product.category === "FASHION") {
        if (!variantId) {
          throw new Error("Please select a size.");
        }

        const variant = product.variants.find(
          (item) => item.id === variantId
        );

        if (!variant) {
          throw new Error("Variant not found.");
        }

        await tx.productVariant.update({
          where: {
            id: variantId,
          },
          data: {
            stock: {
              increment: quantity,
            },
          },
        });
      }

      const updatedProduct = await tx.product.update({
        where: {
          id,
        },
        data: {
          stock: {
            increment: quantity,
          },
        },
        include: {
          variants: true,
        },
      });

      await tx.scanLog.create({
        data: {
          productId: id,
          barcode: product.barcode,
          action: "ADD_STOCK",
          quantity,
        },
      });

      return updatedProduct;
    });

    return Response.json(updated);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not add stock.",
      },
      { status: 500 }
    );
  }
}