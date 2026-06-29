"use client";

import { useState } from "react";
import type { Product } from "@/types/index";

type ProductFormProps = {
  mode: "create" | "update";
  barcode: string;
  product?: Product | null;
  onSaved?: () => void;
};

export default function ProductForm({
  mode,
  barcode,
  product,
  onSaved,
}: ProductFormProps) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") || ""),
      barcode: String(formData.get("barcode") || ""),
      sku: String(formData.get("sku") || "") || null,
      description: String(formData.get("description") || "") || null,
      price: Number(formData.get("price") || 0),
      stock: Number(formData.get("stock") || 0),
      location: String(formData.get("location") || "") || null,
      imageUrl: null,
    };

    const url =
      mode === "update" && product
        ? `/api/products/${product.id}`
        : "/api/products";

    const method = mode === "update" ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setIsSaving(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Could not save product");
      return;
    }

    onSaved?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-5"
    >
      <Input name="name" label="Product name" defaultValue={product?.name} required />

      <Input
        name="barcode"
        label="Barcode"
        defaultValue={product?.barcode ?? barcode}
        required
      />

      <Input name="sku" label="SKU" defaultValue={product?.sku ?? ""} />

      <Input
        name="description"
        label="Description"
        defaultValue={product?.description ?? ""}
      />

      <Input
        name="price"
        label="Price"
        type="number"
        step="0.01"
        defaultValue={product?.price ?? "0"}
        required
      />

      <Input
        name="stock"
        label="Stock"
        type="number"
        defaultValue={product?.stock ?? 0}
        required
      />

      <Input
        name="location"
        label="Location / placement"
        defaultValue={product?.location ?? ""}
      />

      {error && (
        <p className="rounded-2xl bg-red-500/10 p-3 text-sm font-bold text-red-400">
          {error}
        </p>
      )}

      <button
        disabled={isSaving}
        className="w-full rounded-2xl bg-emerald-400 py-4 font-black text-slate-950 disabled:opacity-60"
      >
        {isSaving
          ? "Saving..."
          : mode === "update"
            ? "Modify product"
            : "Create product"}
      </button>
    </form>
  );
}

function Input({
  label,
  name,
  type = "text",
  required = false,
  step,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
  defaultValue?: string | number | null;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 outline-none focus:border-emerald-400"
      />
    </label>
  );
}