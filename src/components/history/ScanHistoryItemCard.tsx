"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";

import GlassCard from "@/components/ui/GlassCard";
import ProductForm from "@/components/products/ProductForm";

import type {
  Product,
  ScanAction,
  ScanLog,
} from "@/types";

type Props = {
  scan: ScanLog;
};

function actionLabel(action: ScanAction) {
  if (action === "ADD_STOCK") return "Added stock";
  if (action === "REMOVE_STOCK") return "Removed stock";
  if (action === "SALE") return "Sale";
  return "Checked";
}

export default function ScanHistoryItemCard({
  scan: initialScan,
}: Props) {
  const [scan, setScan] = useState(initialScan);
  const [expanded, setExpanded] = useState(false);
  const [editingScan, setEditingScan] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [action, setAction] = useState<ScanAction>(
    scan.action
  );

  const [quantity, setQuantity] = useState(
    scan.quantity.toString()
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (deleted) {
    return null;
  }

  async function handleSaveScan() {
    setIsSaving(true);

    const response = await fetch(
      `/api/scans/${scan.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          quantity: Number(quantity),
        }),
      }
    );

    setIsSaving(false);

    if (!response.ok) {
      return;
    }

    const updated = await response.json();

    setScan({
      ...updated,
      createdAt: new Date(
        updated.createdAt
      ).toISOString(),

      product: updated.product
        ? {
            ...updated.product,
            price: String(updated.product.price),
            createdAt: new Date(
              updated.product.createdAt
            ).toISOString(),
            updatedAt: new Date(
              updated.product.updatedAt
            ).toISOString(),
          }
        : null,
    });

    setEditingScan(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this scan history entry?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    const response = await fetch(
      `/api/scans/${scan.id}`,
      {
        method: "DELETE",
      }
    );

    setIsDeleting(false);

    if (response.ok) {
      setDeleted(true);
    }
  }

  function handleProductSaved(product: Product) {
    setScan((current) => ({
      ...current,
      barcode: product.barcode,
      productId: product.id,
      product,
    }));
  }

  return (
    <GlassCard className="overflow-hidden">
      <button
        type="button"
        onClick={() =>
          setExpanded((value) => !value)
        }
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
      >
        <div className="min-w-0">
          <h2 className="break-words font-black text-[var(--app-text)]">
            {scan.product?.name ?? "Unknown product"}
          </h2>

          <p className="mt-1 break-words text-xs text-slate-500">
            {scan.barcode}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {new Date(
              scan.createdAt
            ).toLocaleString()}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-3">
          <div className="text-right">
            <p
              className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
                scan.action === "SALE" ||
                scan.action === "REMOVE_STOCK"
                  ? "border-red-400/20 bg-red-500/10 text-red-300"
                  : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
              }`}
            >
              {actionLabel(scan.action)}
            </p>

            <p className="mt-2 text-xs font-bold text-slate-500">
              Qty: {scan.quantity}
            </p>
          </div>

          <div className="mt-1 text-cyan-300">
            {expanded ? (
              <ChevronUp size={19} />
            ) : (
              <ChevronDown size={19} />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-cyan-400/10 p-4">
          {!editingScan ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditingScan(true)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 py-3 font-bold text-cyan-300"
              >
                <Pencil size={17} />
                Edit Scan
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 font-bold text-red-300 disabled:opacity-60"
              >
                <Trash2 size={17} />
                {isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">
                  Action
                </span>

                <select
                  value={action}
                  onChange={(event) =>
                    setAction(
                      event.target
                        .value as ScanAction
                    )
                  }
                  className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 text-[var(--app-text)] outline-none focus:border-cyan-300"
                >
                  <option value="CHECK">
                    Check
                  </option>

                  <option value="ADD_STOCK">
                    Add stock
                  </option>

                  <option value="REMOVE_STOCK">
                    Remove stock
                  </option>

                  <option value="SALE">
                    Sale
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">
                  Quantity
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

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveScan}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-3 font-black text-slate-950 disabled:opacity-60"
                >
                  <Save size={17} />

                  {isSaving
                    ? "Saving..."
                    : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAction(scan.action);
                    setQuantity(
                      scan.quantity.toString()
                    );
                    setEditingScan(false);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/10 py-3 font-bold text-slate-400"
                >
                  <X size={17} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {scan.product && (
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Product information
              </p>

              <ProductForm
                mode="update"
                barcode={scan.product.barcode}
                product={scan.product}
                onSaved={handleProductSaved}
              />
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}