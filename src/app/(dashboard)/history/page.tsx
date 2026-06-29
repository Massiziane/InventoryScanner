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
  const history = await prisma.scanLog.findMany({
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: true,
    },
  });

  return (
    <PageShell>
      <PageHeader eyebrow="Activity" title="Scan History" />

      <section className="space-y-3">
        {history.length === 0 ? (
          <EmptyState title="No scan history yet." />
        ) : (
          history.map((scan) => (
            <GlassCard key={scan.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="break-words font-black text-white">
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
          ))
        )}
      </section>
    </PageShell>
  );
}