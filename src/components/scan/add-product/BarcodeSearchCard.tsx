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
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-300">
        <Keyboard size={18} />
        Barcode
      </label>

      <div className="flex gap-2">
        <input
          value={barcode}
          onChange={(event) => onBarcodeChange(event.target.value)}
          placeholder="Enter or scan barcode"
          className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-emerald-400"
        />

        <button
          onClick={onSearch}
          disabled={isLoading}
          className="rounded-2xl bg-emerald-400 px-4 font-black text-slate-950 disabled:opacity-60"
        >
          <Search size={20} />
        </button>
      </div>
    </section>
  );
}