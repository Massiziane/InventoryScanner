"use client";

import { Keyboard, Search } from "lucide-react";

type BarcodeSearchCardProps = {
  barcode: string;
  isLoading: boolean;
  onBarcodeChange: (value: string) => void;
  onSearch: () => void;
};

export default function BarcodeSearchCard({
  barcode,
  isLoading,
  onBarcodeChange,
  onSearch,
}: BarcodeSearchCardProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-4 shadow-[0_0_30px_rgba(34,211,238,0.04)]">
      <label className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
        <Keyboard size={17} />
        Barcode
      </label>

      <div className="flex gap-2">
        <input
          value={barcode}
          onChange={(event) => onBarcodeChange(event.target.value)}
          placeholder="Enter or scan barcode"
          className="min-w-0 flex-1 rounded-2xl border border-cyan-400/10 bg-slate-900/80 px-4 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/10"
        />

        <button
          onClick={onSearch}
          disabled={isLoading}
          className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl bg-cyan-300 font-black text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.22)] transition hover:bg-cyan-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search size={21} />
        </button>
      </div>
    </section>
  );
}