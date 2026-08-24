import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import LotHistoryCard from "@/components/history/LotHistoryCard";
import LotHistoryItemCard from "@/components/history/LotHistoryItemCard";
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
        product: true,
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
            product: true,
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
                        createdAt:
                          item.product.createdAt.toISOString(),
                        updatedAt:
                          item.product.updatedAt.toISOString(),
                      },
                    })),
                  }}
                />
              );
            }

            const scan = entry.data;

            return (
              <GlassCard
                key={`scan-${scan.id}`}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="break-words font-black text-[var(--app-text)]">
                      {scan.product?.name ?? "Unknown product"}
                    </h2>

                    <p className="mt-1 break-words text-xs text-slate-500">
                      {scan.barcode}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {scan.createdAt.toLocaleString()}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
                        scan.action === "SALE" ||
                        scan.action === "REMOVE_STOCK"
                          ? "border-red-400/20 bg-red-500/10 text-red-300"
                          : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                      }`}
                    >
                      {actionLabel(scan.action)}
                    </p>

                    <p className="mt-2 text-xs font-bold text-slate-500">
                      Qty: {scan.quantity}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </section>
    </PageShell>
  );
}