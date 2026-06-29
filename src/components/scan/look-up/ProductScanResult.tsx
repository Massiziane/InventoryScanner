"use client";

import { MapPin, PackageCheck, Plus, Tag, TrendingDown } from "lucide-react";
import type { Product, ScanAction } from "@/types";

type ProductScanResultProps = {
  product: Product | null;
  isLoading: boolean;
  onApplyScan: (action: ScanAction) => void;
};

export default function ProductScanResult({
  product,
  isLoading,
  onApplyScan,
}: ProductScanResultProps) {
  if (!product) return null;

  return (
    <section className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)]">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
        Product Found
      </p>

      <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
        {product.name}
      </h2>

      <p className="mt-1 break-words text-sm text-slate-500">
        {product.sku ?? "No SKU"} · {product.barcode}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Tag size={18} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Price
          </p>
          <p className="mt-1 text-xl font-black text-white">
            ${product.price}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <PackageCheck size={18} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Stock
          </p>
          <p className="mt-1 text-xl font-black text-white">
            {product.stock}
          </p>
        </div>

        <div className="col-span-2 rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <MapPin size={18} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Location
          </p>
          <p className="mt-1 break-words text-xl font-black text-white">
            {product.location ?? "No location set"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => onApplyScan("ADD_STOCK")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-4 font-black text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.22)] transition hover:bg-cyan-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} />
          Add 1
        </button>

        <button
          onClick={() => onApplyScan("SALE")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/15 py-4 font-black text-red-300 transition hover:bg-red-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <TrendingDown size={18} />
          Sell 1
        </button>
      </div>
    </section>
  );
}