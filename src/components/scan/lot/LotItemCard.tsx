"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import ProductForm from "@/components/products/ProductForm";
import type { Product } from "@/types";

type Props = {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onUpdated: () => void;
  onRemove: () => void;
};

export default function LotItemCard({
  product,
  quantity,
  onQuantityChange,
  onUpdated,
  onRemove,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="overflow-hidden rounded-3xl border border-cyan-400/10 bg-[var(--app-bg)]">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-14 w-14 rounded-xl bg-[var(--app-panel)] object-contain p-1"
          />
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-black text-[var(--app-text)]">
            {product.name}
          </p>

          <p className="text-xs text-[var(--app-muted)]">
            {product.barcode}
          </p>

          {product.location && (
            <p className="mt-1 text-xs text-cyan-300">
              {product.location}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-300">
            ×{quantity}
          </span>

          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-cyan-400/10 p-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-300">
              Quantity in lot
            </span>

            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) =>
                onQuantityChange(Number(event.target.value))
              }
              className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4"
            />
          </label>

          <ProductForm
            mode="update"
            barcode={product.barcode}
            product={product}
            onSaved={onUpdated}
          />

          <button
            onClick={onRemove}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 font-bold text-red-300"
          >
            <Trash2 size={18} />
            Remove from lot
          </button>
        </div>
      )}
    </article>
  );
}