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
    <div className="space-y-6">
      <header className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
          Activity
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
          Scan History
        </h1>
      </header>

      <section className="space-y-3">
        {history.length === 0 ? (
          <p className="rounded-2xl border border-cyan-400/10 bg-slate-950 p-4 text-sm text-slate-400">
            No scan history yet.
          </p>
        ) : (
          history.map((scan) => (
            <div
              key={scan.id}
              className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-4 shadow-[0_0_25px_rgba(34,211,238,0.04)]"
            >
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
            </div>
          ))
        )}
      </section>
    </div>
  );
}