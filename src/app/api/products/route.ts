import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/schemas/product";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      variants: true,
      promotions: true,
    },
  });

  return Response.json(products);
}

async function generateSku() {
  const lastProduct = await prisma.product.findFirst({
    where: {
      sku: {
        startsWith: "PRD-",
      },
    },

    orderBy: {
      sku: "desc",
    },
  });

  const lastNumber =
    Number(
      lastProduct?.sku?.replace("PRD-", "")
    ) || 0;

  return `PRD-${String(lastNumber + 1).padStart(6, "0")}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result =
      createProductSchema.safeParse(body);

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

    const sku = await generateSku();

    const {
      variants = [],
      promotions = [],
      ...productData
    } = result.data;

    const totalVariantStock =
      productData.category === "FASHION"
        ? variants.reduce(
            (total, variant) =>
              total + variant.stock,
            0
          )
        : productData.stock;

    const product =
      await prisma.product.create({
        data: {
          ...productData,

          sku,

          stock: totalVariantStock,

          variants:
            productData.category === "FASHION" &&
            variants.length > 0
              ? {
                  create: variants.map(
                    (variant) => ({
                      size: variant.size,
                      stock: variant.stock,
                    })
                  ),
                }
              : undefined,

          promotions:
            promotions.length > 0
              ? {
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
                }
              : undefined,
        },

        include: {
          variants: true,
          promotions: true,
        },
      });

    return Response.json(
      product,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "PRODUCT CREATE ERROR:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Product could not be created.",
      },
      {
        status: 500,
      }
    );
  }
}