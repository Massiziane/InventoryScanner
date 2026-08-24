"use client";

import { useState } from "react";
import { Pencil, Save, Trash2, X } from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import ProductForm from "@/components/products/ProductForm";
import type { LotItem, Product } from "@/types";

type Props = {
  lotId: string;
  item: LotItem;
  onUpdated: (item: LotItem) => void;
  onDeleted: (itemId: string) => void;
};

export default function LotHistoryItemCard({
  lotId,
  item,
  onUpdated,
  onDeleted,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(
    item.quantity.toString()
  );

  const [editingQuantity, setEditingQuantity] =
    useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSaveQuantity() {
    setIsSaving(true);

    const response = await fetch(
      `/api/lots/${lotId}/items/${item.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: Number(quantity),
        }),
      }
    );

    setIsSaving(false);

    if (!response.ok) {
      return;
    }

    const updated = await response.json();

    onUpdated({
      ...updated,
      createdAt: new Date(
        updated.createdAt
      ).toISOString(),
      updatedAt: new Date(
        updated.updatedAt
      ).toISOString(),
      product: {
        ...updated.product,
        price: String(updated.product.price),
        createdAt: new Date(
          updated.product.createdAt
        ).toISOString(),
        updatedAt: new Date(
          updated.product.updatedAt
        ).toISOString(),
      },
    });

    setEditingQuantity(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Remove "${item.product.name}" from this lot?`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    const response = await fetch(
      `/api/lots/${lotId}/items/${item.id}`,
      {
        method: "DELETE",
      }
    );

    setIsDeleting(false);

    if (response.ok) {
      onDeleted(item.id);
    }
  }

  function handleProductSaved(product: Product) {
    onUpdated({
      ...item,
      product,
    });
  }

  return (
    <GlassCard className="p-3">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div className="min-w-0">
          <p className="truncate font-bold text-[var(--app-text)]">
            {item.product.name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {item.product.barcode}
          </p>

          {item.product.location && (
            <p className="mt-1 text-xs text-slate-600">
              {item.product.location}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-300">
          ×{item.quantity}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-cyan-400/10 pt-4">
          {!editingQuantity ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditingQuantity(true)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 py-3 font-bold text-cyan-300"
              >
                <Pencil size={17} />
                Edit quantity
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 font-bold text-red-300 disabled:opacity-60"
              >
                <Trash2 size={17} />
                {isDeleting
                  ? "Removing..."
                  : "Remove"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveQuantity}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-3 font-black text-slate-950"
                >
                  <Save size={17} />
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQuantity(
                      item.quantity.toString()
                    );
                    setEditingQuantity(false);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/10 py-3 font-bold text-slate-400"
                >
                  <X size={17} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          <ProductForm
            mode="update"
            barcode={item.product.barcode}
            product={item.product}
            onSaved={handleProductSaved}
          />
        </div>
      )}
    </GlassCard>
  );
}