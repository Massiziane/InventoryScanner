import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import LotHistoryCard from "@/components/history/LotHistoryCard";
import ScanHistoryItemCard from "@/components/history/ScanHistoryItemCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ScanAction = "ADD_STOCK" | "REMOVE_STOCK" | "SALE" | "CHECK";

function actionLabel(action: ScanAction) {
  if (action === "ADD_STOCK") return "Added stock";
  if (action === "REMOVE_STOCK") return "Removed stock";
  if (action === "SALE") return "Sale";
  return "Checked";
}

export default async function HistoryPage() {
  const [history, lots] = await Promise.all([
    prisma.scanLog.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          include: {
            variants: true,
          },
        },
      },
    }),

    prisma.lot.findMany({
      take: 50,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const timeline = [
    ...history.map((scan) => ({
      type: "scan" as const,
      createdAt: scan.createdAt,
      data: scan,
    })),

    ...lots.map((lot) => ({
      type: "lot" as const,
      createdAt: lot.createdAt,
      data: lot,
    })),
  ].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Activity"
        title="Scan History"
      />

      <section className="space-y-3">
        {timeline.length === 0 ? (
          <EmptyState title="No scan history yet." />
        ) : (
          timeline.map((entry) => {
            if (entry.type === "lot") {
              const lot = entry.data;

              return (
                <LotHistoryCard
                  key={`lot-${lot.id}`}
                  lot={{
                    id: lot.id,
                    name: lot.name,
                    location: lot.location,
                    createdAt: lot.createdAt.toISOString(),
                    updatedAt: lot.updatedAt.toISOString(),

                    items: lot.items.map((item) => ({
                      id: item.id,
                      lotId: item.lotId,
                      productId: item.productId,
                      quantity: item.quantity,
                      createdAt: item.createdAt.toISOString(),
                      updatedAt: item.updatedAt.toISOString(),

                      product: {
                        id: item.product.id,
                        name: item.product.name,
                        barcode: item.product.barcode,
                        sku: item.product.sku,
                        description: item.product.description,
                        price: item.product.price.toString(),
                        stock: item.product.stock,
                        location: item.product.location,
                        imageUrl: item.product.imageUrl,

                        category: item.product.category,

                        variants: item.product.variants.map((variant) => ({
                          id: variant.id,
                          productId: variant.productId,
                          size: variant.size,
                          stock: variant.stock,
                          createdAt: variant.createdAt.toISOString(),
                          updatedAt: variant.updatedAt.toISOString(),
                        })),

                        createdAt: item.product.createdAt.toISOString(),
                        updatedAt: item.product.updatedAt.toISOString(),
                      },
                    })),
                  }}
                />
              );
            }

            const scan = entry.data;

            return (
              <ScanHistoryItemCard
                key={`scan-${scan.id}`}
                scan={{
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

                        category: scan.product.category,

                        variants: scan.product.variants.map((variant) => ({
                          id: variant.id,
                          productId: variant.productId,
                          size: variant.size,
                          stock: variant.stock,
                          createdAt: variant.createdAt.toISOString(),
                          updatedAt: variant.updatedAt.toISOString(),
                        })),

                        createdAt: scan.product.createdAt.toISOString(),
                        updatedAt: scan.product.updatedAt.toISOString(),
                      }
                    : null,
                }}
              />
            );
          })
        )}
      </section>
    </PageShell>
  );
}