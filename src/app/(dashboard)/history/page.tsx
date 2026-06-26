import type { ScanLog } from "@/types";

async function getHistory() {
  const response = await fetch("http://localhost:3000/api/history", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load history");
  }

  return response.json() as Promise<ScanLog[]>;
}

function actionLabel(action: ScanLog["action"]) {
  if (action === "ADD_STOCK") return "Added stock";
  if (action === "REMOVE_STOCK") return "Removed stock";
  if (action === "SALE") return "Sale";
  return "Checked";
}

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-emerald-400">Activity</p>
        <h1 className="text-3xl font-black">Scan history</h1>
      </header>

      <section className="space-y-3">
        {history.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
            No scan history yet.
          </p>
        ) : (
          history.map((scan) => (
            <div
              key={scan.id}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-black">
                    {scan.product?.name ?? "Unknown product"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {scan.barcode}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(scan.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-black ${
                      scan.action === "SALE" ||
                      scan.action === "REMOVE_STOCK"
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {actionLabel(scan.action)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
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