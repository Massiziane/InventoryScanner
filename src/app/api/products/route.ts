import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/schemas/product";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      variants: true,
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

  const lastNumber = Number(lastProduct?.sku?.replace("PRD-", "")) || 0;

  return `PRD-${String(lastNumber + 1).padStart(6, "0")}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = createProductSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ errors: result.error.flatten() }, { status: 400 });
  }

  const sku = await generateSku();

const { variants = [], ...productData } = result.data;

const totalVariantStock =
  productData.category === "FASHION"
    ? variants.reduce(
        (total, variant) => total + variant.stock,
        0
      )
    : productData.stock;

  const product = await prisma.product.create({
    data: {
      ...productData,

      sku,

      stock: totalVariantStock,

      variants:
        productData.category === "FASHION" &&
        variants.length > 0
          ? {
              create: variants.map((variant) => ({
                size: variant.size,
                stock: variant.stock,
              })),
            }
          : undefined,
    },

    include: {
      variants: true,
    },
  });

  return Response.json(product, {
    status: 201,
  });
}