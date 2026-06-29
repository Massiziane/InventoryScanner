import Link from "next/link";
import { ArrowRight, Barcode, Clock3 } from "lucide-react";
import type { ScanLog } from "@/types";

type RecentScansProps = {
  scans: ScanLog[];
};

export default function RecentScans({ scans }: RecentScansProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
            Activity
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Recent Scans
          </h2>
        </div>

        <Link
          href="/history"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-3">
        {scans.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
            <Barcode className="mx-auto mb-3 text-slate-600" size={32} />
            <p className="font-semibold text-slate-300">
              No scans yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Start scanning products to see activity here.
            </p>
          </div>
        ) : (
          scans.map((scan) => (
            <div
              key={scan.id}
              className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-cyan-400/30 hover:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10 text-cyan-300">
                  <Barcode size={22} />
                </div>

                <div>
                  <p className="font-bold text-white">
                    {scan.product?.name ?? "Unknown product"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {scan.barcode}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-300">
                  {scan.action} × {scan.quantity}
                </span>

                <div className="mt-2 flex items-center justify-end gap-1 text-xs text-slate-500">
                  <Clock3 size={13} />
                  {new Date(scan.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}