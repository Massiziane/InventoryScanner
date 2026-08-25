import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/schemas/product";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    include: {
      scans: true,
      variants: true,
      promotions: true,
    },
  });

  if (!product) {
    return Response.json(
      {
        error: "Product not found",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(product);
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  const { id } = await params;

  const body = await request.json();

  const result =
    updateProductSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        errors: result.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  const {
    variants,
    promotions,
    ...productData
  } = result.data;

  /*
   * For fashion products:
   * Product.stock = total stock from all sizes.
   *
   * For regular products:
   * Keep using the supplied stock.
   */
  const totalVariantStock =
    productData.category === "FASHION" &&
    variants !== undefined
      ? variants.reduce(
          (total, variant) =>
            total + variant.stock,
          0
        )
      : productData.stock;

  try {
    const product = await prisma.$transaction(
      async (tx) => {
        /*
         * Replace variants whenever the client
         * explicitly sends the variants property.
         */
        if (variants !== undefined) {
          await tx.productVariant.deleteMany({
            where: {
              productId: id,
            },
          });
        }

        /*
         * Same approach for promotions:
         *
         * promotions omitted:
         *   preserve existing promotions
         *
         * promotions: []
         *   remove all promotions
         *
         * promotions: [...]
         *   replace with supplied promotions
         */
        if (promotions !== undefined) {
          await tx.productPromotion.deleteMany({
            where: {
              productId: id,
            },
          });
        }

        return tx.product.update({
          where: {
            id,
          },

          data: {
            ...productData,

            /*
             * Update stock when supplied.
             * Fashion uses summed variant stock.
             */
            ...(totalVariantStock !== undefined
              ? {
                  stock: totalVariantStock,
                }
              : {}),

            /*
             * Recreate Fashion variants.
             */
            ...(variants !== undefined &&
            productData.category === "FASHION"
              ? {
                  variants: {
                    create: variants.map(
                      (variant) => ({
                        size: variant.size,
                        stock: variant.stock,
                      })
                    ),
                  },
                }
              : {}),

            /*
             * Recreate promotions.
             */
            ...(promotions !== undefined &&
            promotions.length > 0
              ? {
                  promotions: {
                    create: promotions.map(
                      (promotion) => ({
                        quantity:
                          promotion.quantity,

                        price:
                          promotion.price,

                        active:
                          promotion.active ??
                          true,
                      })
                    ),
                  },
                }
              : {}),
          },

          include: {
            variants: true,
            promotions: true,
          },
        });
      }
    );

    return Response.json(product);
  } catch (error) {
    console.error(
      "PRODUCT UPDATE ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Product could not be updated.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: RouteParams
) {
  const { id } = await params;

  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "PRODUCT DELETE ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Product could not be deleted.",
      },
      {
        status: 500,
      }
    );
  }
}