import Link from "next/link";
import type { ScanLog } from "@/types";

type RecentScansProps = {
  scans: ScanLog[];
};

export default function RecentScans({ scans }: RecentScansProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black">Recent scans</h2>

        <Link href="/history" className="text-sm font-bold text-emerald-400">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {scans.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
            No scans yet.
          </p>
        ) : (
          scans.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <div>
                <p className="font-bold">
                  {scan.product?.name ?? "Unknown product"}
                </p>

                <p className="text-xs text-slate-400">{scan.barcode}</p>
              </div>

              <div className="text-right">
                <p className="font-black text-emerald-400">
                  {scan.action} x{scan.quantity}
                </p>

                <p className="text-xs text-slate-500">
                  {new Date(scan.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}