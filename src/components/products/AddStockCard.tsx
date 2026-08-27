"use client";

import { useState } from "react";
import type { Product } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  ImageIcon,
  MapPin,
  Tag,
} from "lucide-react";

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
  const [showInfo, setShowInfo] = useState(false);

  const isFashion = product.category === "FASHION";

  const activePromotions =
    product.promotions?.filter(
      (promotion) => promotion.active
    ) ?? [];

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
            variantId: isFashion
              ? variantId
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Could not add stock."
        );

        return;
      }

      onUpdated(data);
    } catch {
      setError(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-3xl border border-cyan-400/20 bg-[var(--app-bg)] p-5 shadow-[0_0_30px_rgba(34,211,238,.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-black text-cyan-300">
            Add Stock
          </p>

          <p className="truncate text-sm font-bold text-[var(--app-text)]">
            {product.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowInfo(
              (current) => !current
            )
          }
          className="flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/15"
        >
          {showInfo ? (
            <>
              Hide Info
              <ChevronUp size={15} />
            </>
          ) : (
            <>
              Show Info
              <ChevronDown size={15} />
            </>
          )}
        </button>
      </div>

      {showInfo && (
        <div className="space-y-4 rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)]/50 p-4">
          {product.imageUrl && (
            <div className="overflow-hidden rounded-2xl border border-cyan-400/10 bg-[var(--app-bg)]">
              <div className="flex items-center gap-2 border-b border-cyan-400/10 px-3 py-2">
                <ImageIcon
                  size={14}
                  className="text-cyan-300"
                />

                <p className="text-xs font-black uppercase tracking-wide text-cyan-300">
                  Product Photo
                </p>
              </div>

              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-44 w-full object-contain p-4"
              />
            </div>
          )}

          <div>
            <p className="text-xl font-black text-[var(--app-text)]">
              {product.name}
            </p>

            <div className="mt-3 space-y-2 text-sm text-[var(--app-muted)]">
              <div className="flex items-start gap-2">
                <Tag
                  size={15}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <span className="break-all">
                  Barcode: {product.barcode}
                </span>
              </div>

              <p>
                SKU:{" "}
                {product.sku ?? "No SKU"}
              </p>

              <div className="flex items-start gap-2">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <span>
                  {product.location ??
                    "No location"}
                </span>
              </div>

              <p>
                Category:{" "}
                {product.category ??
                  "Uncategorized"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-cyan-400/10 bg-[var(--app-bg)] p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Price
              </p>

              <p className="mt-1 text-lg font-black text-[var(--app-text)]">
                $
                {Number(
                  product.price
                ).toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-400/10 bg-[var(--app-bg)] p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Stock
              </p>

              <p className="mt-1 text-lg font-black text-cyan-300">
                {product.stock}
              </p>
            </div>
          </div>

          {activePromotions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                Promotions
              </p>

              <div className="flex flex-wrap gap-2">
                {activePromotions.map(
                  (promotion) => (
                    <span
                      key={promotion.id}
                      className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-300"
                    >
                      {promotion.quantity} for $
                      {Number(
                        promotion.price
                      ).toFixed(2)}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {isFashion &&
            product.variants &&
            product.variants.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                  Sizes
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map(
                    (variant) => (
                      <span
                        key={variant.id}
                        className={`rounded-xl border px-3 py-2 text-xs font-black ${
                          variant.stock === 0
                            ? "border-red-400/20 bg-red-500/10 text-red-300"
                            : variant.stock <= 5
                              ? "border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
                              : "border-cyan-400/10 bg-[var(--app-bg)] text-[var(--app-text)]"
                        }`}
                      >
                        {variant.size}:{" "}
                        {variant.stock}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      )}

      {isFashion ? (
        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-300">
            Select size
          </p>

          {product.variants?.map(
            (variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() =>
                  setVariantId(
                    variant.id
                  )
                }
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                  variantId ===
                  variant.id
                    ? "border-cyan-300 bg-cyan-400/10"
                    : "border-cyan-400/10 bg-[var(--app-panel)]"
                }`}
              >
                <span className="font-black text-[var(--app-text)]">
                  {variant.size}
                </span>

                <span className="text-cyan-300">
                  {variant.stock} in stock
                </span>
              </button>
            )
          )}
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
            setQuantity(
              event.target.value
            )
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
          onClick={
            handleSubmit
          }
          className="rounded-2xl bg-cyan-300 py-4 font-black text-slate-950 disabled:opacity-50"
        >
          {loading
            ? "Adding..."
            : "Add Stock"}
        </button>
      </div>
    </section>
  );
}