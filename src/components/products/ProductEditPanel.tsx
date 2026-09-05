"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";

import ProductForm from "@/components/products/ProductForm";

type ProductEditPanelProps = {
  product: any;
};

export default function ProductEditPanel({
  product,
}: ProductEditPanelProps) {
  const [isEditing, setIsEditing] =
    useState(false);

  const router = useRouter();

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() =>
          setIsEditing(
            (current) => !current
          )
        }
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4 font-black text-cyan-300 transition hover:bg-cyan-400/20"
      >
        {isEditing ? (
          <>
            <X size={18} />
            Cancel editing
          </>
        ) : (
          <>
            <Pencil size={18} />
            Modify product
          </>
        )}
      </button>

      {isEditing && (
        <ProductForm
          mode="update"
          barcode={product.barcode}
          product={product}
          onSaved={() => {
            setIsEditing(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}