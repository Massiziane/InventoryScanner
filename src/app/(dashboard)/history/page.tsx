import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
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
    (a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
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

              const totalUnits = lot.items.reduce(
                (total, item) => total + item.quantity,
                0
              );

              return (
                <details
                  key={`lot-${lot.id}`}
                  className="group"
                >
                  <summary className="list-none cursor-pointer">
                    <GlassCard className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-300">
                              Lot
                            </span>
                          </div>

                          <h2 className="break-words font-black text-[var(--app-text)]">
                            {lot.name}
                          </h2>

                          {lot.location && (
                            <p className="mt-1 text-xs text-cyan-300">
                              {lot.location}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-slate-600">
                            {lot.createdAt.toLocaleString()}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-black text-[var(--app-text)]">
                            {lot.items.length}{" "}
                            {lot.items.length === 1
                              ? "product"
                              : "products"}
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-500">
                            {totalUnits} units
                          </p>

                          <p className="mt-2 text-xs font-bold text-cyan-300">
                            View lot
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </summary>

                  <div className="mt-2 space-y-2 pl-4">
                    {lot.items.map((item) => (
                      <GlassCard
                        key={item.id}
                        className="p-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate font-bold text-[var(--app-text)]">
                              {item.product.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {item.product.barcode}
                            </p>

                            {item.product.location && (
                              <p className="mt-1 text-xs text-slate-600">
                                {item.product.location}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 rounded-xl bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-300">
                            ×{item.quantity}
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </details>
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