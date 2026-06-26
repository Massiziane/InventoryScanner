import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalProducts,
    totalStockResult,
    lowStock,
    outOfStock,
    todayScans,
    recentScans,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.product.aggregate({
      _sum: {
        stock: true,
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          gt: 0,
          lte: 5,
        },
      },
    }),

    prisma.product.count({
      where: {
        stock: 0,
      },
    }),

    prisma.scanLog.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    }),

    prisma.scanLog.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: true,
      },
    }),
  ]);

  return Response.json({
    totalProducts,
    totalStock: totalStockResult._sum.stock ?? 0,
    lowStock,
    outOfStock,
    todayScans,
    recentScans,
  });
}