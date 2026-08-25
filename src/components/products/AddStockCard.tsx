"use client";

import { useState } from "react";
import type { Product } from "@/types";

type Props = {
  product: Product;
  onUpdated: (product: Product) => void;
  onCancel: () => void;
};

export default function AddStockCard({
  product,
  onUpdated,
  onCancel,
}: Props) {
  const [quantity, setQuantity] = useState("1");
  const [variantId, setVariantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFashion = product.category === "FASHION";

  async function handleSubmit() {
    setError("");

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    if (isFashion && !variantId) {
      setError("Select a size.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/products/${product.id}/add-stock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: qty,
            variantId: isFashion ? variantId : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not add stock.");
        return;
      }

      onUpdated(data);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-3xl border border-cyan-400/20 bg-[var(--app-bg)] p-5 shadow-[0_0_30px_rgba(34,211,238,.08)]">
      <div>
        <p className="text-lg font-black text-cyan-300">
          Add Stock
        </p>

        <p className="text-sm text-[var(--app-muted)]">
          {product.name}
        </p>
      </div>

      {isFashion ? (
        <div className="space-y-2">
          <p className="font-bold text-sm text-slate-300">
            Select size
          </p>

          {product.variants?.map((variant) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setVariantId(variant.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                variantId === variant.id
                  ? "border-cyan-300 bg-cyan-400/10"
                  : "border-cyan-400/10 bg-[var(--app-panel)]"
              }`}
            >
              <span className="font-black">
                {variant.size}
              </span>

              <span className="text-cyan-300">
                {variant.stock} in stock
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--app-panel)] p-4">
          <p className="text-sm text-[var(--app-muted)]">
            Current stock
          </p>

          <p className="text-2xl font-black text-cyan-300">
            {product.stock}
          </p>
        </div>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-300">
          Quantity to add
        </span>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(event) =>
            setQuantity(event.target.value)
          }
          className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 text-[var(--app-text)] outline-none focus:border-cyan-300"
        />
      </label>

      {error && (
        <div className="rounded-2xl bg-red-500/10 p-3 text-sm font-bold text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-cyan-400/20 py-4 font-bold text-slate-300"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="rounded-2xl bg-cyan-300 py-4 font-black text-slate-950 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Stock"}
        </button>
      </div>
    </section>
  );
}