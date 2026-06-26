"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
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
      imageUrl: null,
    };

    const response = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsSaving(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Could not create product");
      return;
    }

    router.push("/products");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-emerald-400">Inventory</p>
        <h1 className="text-3xl font-black">Add product</h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-5"
      >
        <Input name="name" label="Product name" required />
        <Input name="barcode" label="Barcode" required />
        <Input name="sku" label="SKU" />
        <Input name="description" label="Description" />
        <Input name="price" label="Price" type="number" step="0.01" required />
        <Input name="stock" label="Initial stock" type="number" required />

        {error && (
          <p className="rounded-2xl bg-red-500/10 p-3 text-sm font-bold text-red-400">
            {error}
          </p>
        )}

        <button
          disabled={isSaving}
          className="w-full rounded-2xl bg-emerald-400 py-4 font-black text-slate-950 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save product"}
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  required = false,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
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
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 outline-none focus:border-emerald-400"
      />
    </label>
  );
}