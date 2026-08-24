"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Save } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import LotHistoryItemCard from "@/components/history/LotHistoryItemCard";
import type { Lot } from "@/types";

type Props = {
  lot: Lot;
};

export default function LotHistoryCard({ lot: initialLot }: Props) {
  const [lot, setLot] = useState(initialLot);
  const [editing, setEditing] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [name, setName] = useState(lot.name);
  const [location, setLocation] = useState(lot.location ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (deleted) {
    return null;
  }

  const totalUnits = lot.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  async function handleSave() {
    setIsSaving(true);

    const response = await fetch(`/api/lots/${lot.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        location,
      }),
    });

    setIsSaving(false);

    if (!response.ok) {
      return;
    }

    const updatedLot: Lot = await response.json();

    setLot(updatedLot);
    setEditing(false);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete lot "${lot.name}"?`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    const response = await fetch(`/api/lots/${lot.id}`, {
      method: "DELETE",
    });

    setIsDeleting(false);

    if (response.ok) {
      setDeleted(true);
    }
  }

  return (
    <details className="group">
      <summary className="list-none cursor-pointer">
        <GlassCard className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-300">
                Lot
              </span>

              <h2 className="mt-3 break-words font-black text-[var(--app-text)]">
                {lot.name}
              </h2>

              {lot.location && (
                <p className="mt-1 text-xs text-cyan-300">
                  {lot.location}
                </p>
              )}

              <p className="mt-1 text-xs text-slate-600">
                {new Date(lot.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-black text-[var(--app-text)]">
                {lot.items.length} products
              </p>

              <p className="mt-1 text-xs font-bold text-slate-500">
                {totalUnits} units
              </p>

              <p className="mt-2 text-xs font-bold text-cyan-300">
                View lot
              </p>
            </div>
          </div>
        </GlassCard>
      </summary>

      <div className="mt-2 space-y-3 pl-4">
        <GlassCard className="p-4">
          {!editing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 py-3 font-bold text-cyan-300"
              >
                <Pencil size={17} />
                Edit Lot
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 font-bold text-red-300 disabled:opacity-60"
              >
                <Trash2 size={17} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Lot name"
                className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 outline-none focus:border-cyan-300"
              />

              <input
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Lot location"
                className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 outline-none focus:border-cyan-300"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-300 py-3 font-black text-slate-950 disabled:opacity-60"
                >
                  <Save size={17} />
                  {isSaving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName(lot.name);
                    setLocation(lot.location ?? "");
                    setEditing(false);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/10 py-3 font-bold text-slate-400"
                >
                  <X size={17} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </GlassCard>

        {lot.items.map((item) => (
            <LotHistoryItemCard
                key={item.id}
                lotId={lot.id}
                item={item}
                onUpdated={(updatedItem) => {
                setLot((current) => ({
                    ...current,
                    items: current.items.map((existing) =>
                    existing.id === updatedItem.id
                        ? updatedItem
                        : existing
                    ),
                }));
                }}
                onDeleted={(itemId) => {
                setLot((current) => ({
                    ...current,
                    items: current.items.filter(
                    (existing) => existing.id !== itemId
                    ),
                }));
                }}
            />
            ))}
      </div>
    </details>
  );
}