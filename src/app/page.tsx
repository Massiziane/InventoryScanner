import Link from "next/link";
import { AlertTriangle, Boxes, ScanLine, Activity } from "lucide-react";
import type { DashboardData } from "@/types";
import { getBaseUrl } from "@/lib/base-url";

async function getDashboard() {
  const response = await fetch(`${getBaseUrl()}/api/dashboard`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load dashboard");
  }

  return response.json() as Promise<DashboardData>;
}

export default async function HomePage() {
  const data = await getDashboard();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm font-semibold text-emerald-400">ScanApp</p>
        <h1 className="mt-2 text-3xl font-black">Inventory scanner</h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage products, scan barcodes, and update stock from your phone.
        </p>

        <Link
          href="/scan"
          className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-400 px-4 py-4 font-black text-slate-950"
        >
          Start scanning
          <ScanLine size={22} />
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard icon={<Boxes size={20} />} label="Products" value={data.totalProducts} />
        <StatCard icon={<Activity size={20} />} label="Total stock" value={data.totalStock} />
        <StatCard icon={<AlertTriangle size={20} />} label="Low stock" value={data.lowStock} />
        <StatCard icon={<AlertTriangle size={20} />} label="Out of stock" value={data.outOfStock} danger />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">Recent scans</h2>
          <Link href="/history" className="text-sm font-bold text-emerald-400">
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {data.recentScans.length === 0 ? (
            <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
              No scans yet.
            </p>
          ) : (
            data.recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <div>
                  <p className="font-bold">{scan.product?.name ?? "Unknown product"}</p>
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
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className={danger ? "text-red-400" : "text-emerald-400"}>{icon}</div>
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}