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
    <div className="rounded-2xl border border-cyan-400/10 bg-slate-950/90 p-4 shadow-[0_0_25px_rgba(34,211,238,0.04)] transition hover:border-cyan-400/25">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
          danger
            ? "border-red-400/20 bg-red-400/10 text-red-300"
            : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
        }`}
      >
        {icon}
      </div>

      <p className="mt-4 text-2xl font-black tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}