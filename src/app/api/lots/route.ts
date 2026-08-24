import { prisma } from "@/lib/prisma";

type LotRequestItem = {
  productId: string;
  quantity: number;
};

export async function GET() {
  const lots = await prisma.lot.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(lots);
}

export async function POST(request: Request) {
  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const location = String(body.location ?? "").trim();

  const items: LotRequestItem[] = Array.isArray(body.items)
    ? body.items
    : [];

  if (!name) {
    return Response.json(
      { error: "Lot name is required" },
      { status: 400 }
    );
  }

  if (!items.length) {
    return Response.json(
      { error: "The lot must contain at least one product" },
      { status: 400 }
    );
  }

  const lot = await prisma.lot.create({
    data: {
      name,
      location: location || null,

      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: Math.max(1, Number(item.quantity) || 1),
        })),
      },
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return Response.json(lot, {
    status: 201,
  });
}