import type { DashboardData } from "@/types";
import { prisma } from "@/lib/prisma";

export async function getHomeDashboardData(): Promise<DashboardData> {
  const [
    totalProducts,
    totalStockResult,
    lowStock,
    outOfStock,
    recentScans,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.product.aggregate({
      _sum: { stock: true },
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

  return {
    totalProducts,
    totalStock: totalStockResult._sum.stock ?? 0,
    lowStock,
    outOfStock,
    todayScans: 0,
    recentScans: recentScans.map((scan) => ({
      id: scan.id,
      productId: scan.productId,
      barcode: scan.barcode,
      action: scan.action,
      quantity: scan.quantity,
      createdAt: scan.createdAt.toISOString(),
      product: scan.product
        ? {
            id: scan.product.id,
            name: scan.product.name,
            barcode: scan.product.barcode,
            sku: scan.product.sku,
            description: scan.product.description,
            price: scan.product.price.toString(),
            stock: scan.product.stock,
            location: scan.product.location,
            imageUrl: scan.product.imageUrl,
            createdAt: scan.product.createdAt.toISOString(),
            updatedAt: scan.product.updatedAt.toISOString(),
          }
        : null,
    })),
  };
}