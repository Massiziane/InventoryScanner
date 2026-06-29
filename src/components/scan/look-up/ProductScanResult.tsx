"use client";

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
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm font-bold text-emerald-400">Product found</p>

      <h2 className="mt-2 text-2xl font-black">{product.name}</h2>

      <p className="mt-1 text-sm text-slate-400">
        {product.sku ?? "No SKU"} · {product.barcode}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-950 p-4">
          <p className="text-xs text-slate-400">Price</p>
          <p className="text-xl font-black">${product.price}</p>
        </div>

        <div className="rounded-2xl bg-slate-950 p-4">
          <p className="text-xs text-slate-400">Stock</p>
          <p className="text-xl font-black">{product.stock}</p>
        </div>

        <div className="col-span-2 rounded-2xl bg-slate-950 p-4">
          <p className="text-xs text-slate-400">Location</p>
          <p className="text-xl font-black">
            {product.location ?? "No location set"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => onApplyScan("ADD_STOCK")}
          disabled={isLoading}
          className="rounded-2xl bg-emerald-400 py-4 font-black text-slate-950 disabled:opacity-60"
        >
          + Add 1
        </button>

        <button
          onClick={() => onApplyScan("SALE")}
          disabled={isLoading}
          className="rounded-2xl bg-red-500 py-4 font-black text-white disabled:opacity-60"
        >
          - Sell 1
        </button>
      </div>
    </section>
  );
}