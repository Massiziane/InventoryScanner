"use client";

import { useEffect, useState } from "react";
import type { Product, ProductDraft } from "@/types/index";

type ProductFormProps = {
  mode: "create" | "update";
  barcode: string;
  product?: Product | null;
  draft?: ProductDraft | null;
  onSaved?: () => void;
};

export default function ProductForm({
  mode,
  barcode,
  product,
  draft,
  onSaved,
}: ProductFormProps) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(product?.name ?? draft?.name ?? "");
  const [productBarcode, setProductBarcode] = useState(
    product?.barcode ?? draft?.barcode ?? barcode
  );
  const [sku, setSku] = useState(product?.sku ?? "");
  const [description, setDescription] = useState(
    product?.description ?? draft?.description ?? ""
  );
  const [price, setPrice] = useState(product?.price?.toString() ?? "0");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [location, setLocation] = useState(product?.location ?? "");
  const [imageUrl, setImageUrl] = useState(
    product?.imageUrl ?? draft?.imageUrl ?? ""
  );

  useEffect(() => {
    setName(product?.name ?? draft?.name ?? "");
    setProductBarcode(product?.barcode ?? draft?.barcode ?? barcode);
    setSku(product?.sku ?? "");
    setDescription(product?.description ?? draft?.description ?? "");
    setPrice(product?.price?.toString() ?? "0");
    setStock(product?.stock?.toString() ?? "0");
    setLocation(product?.location ?? "");
    setImageUrl(product?.imageUrl ?? draft?.imageUrl ?? "");
  }, [product, draft, barcode]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    const payload = {
      name,
      barcode: productBarcode,
      sku: sku || null,
      description: description || null,
      price: Number(price || 0),
      stock: Number(stock || 0),
      location: location || null,
      imageUrl: imageUrl || null,
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

  console.error(data);

  setError(JSON.stringify(data));

  return;
}

    onSaved?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)]"
    >
      {imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-cyan-400/10 bg-slate-900">
          <img
            src={imageUrl}
            alt={name || "Product image"}
            className="h-48 w-full object-contain p-4"
          />
        </div>
      )}

      <Input
        name="name"
        label="Product name"
        value={name}
        onChange={setName}
        required
      />

      <Input
        name="barcode"
        label="Barcode"
        value={productBarcode}
        onChange={setProductBarcode}
        required
      />

      <Input name="sku" label="SKU" value={sku} onChange={setSku} />

      <Input
        name="description"
        label="Description"
        value={description}
        onChange={setDescription}
      />

      <Input
        name="price"
        label="Price"
        type="number"
        step="0.01"
        value={price}
        onChange={setPrice}
        required
      />

      <Input
        name="stock"
        label="Stock"
        type="number"
        value={stock}
        onChange={setStock}
        required
      />

      <Input
        name="location"
        label="Location / placement"
        value={location}
        onChange={setLocation}
      />

      <Input
        name="imageUrl"
        label="Image URL"
        value={imageUrl}
        onChange={setImageUrl}
      />

      {error && (
        <p className="rounded-2xl bg-red-500/10 p-3 text-sm font-bold text-red-400">
          {error}
        </p>
      )}

      <button
        disabled={isSaving}
        className="w-full rounded-2xl bg-cyan-300 py-4 font-black text-slate-950 disabled:opacity-60"
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
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
  value: string;
  onChange: (value: string) => void;
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-cyan-400/10 bg-slate-900 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
      />
    </label>
  );
}