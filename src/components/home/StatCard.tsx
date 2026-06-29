import type { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  danger?: boolean;
};

export default function StatCard({
  icon,
  label,
  value,
  danger = false,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className={danger ? "text-red-400" : "text-emerald-400"}>
        {icon}
      </div>

      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}