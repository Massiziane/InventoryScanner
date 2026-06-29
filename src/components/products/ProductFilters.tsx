"use client";

import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type ProductItem = {
  id: string;
  name: string;
  barcode: string;
  sku: string | null;
  price: string;
  stock: number;
  location: string | null;
};

type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";

type ProductFiltersProps = {
  products: ProductItem[];
};

export default function ProductFilters({ products }: ProductFiltersProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StockFilter>("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.barcode.toLowerCase().includes(searchValue) ||
        product.sku?.toLowerCase().includes(searchValue) ||
        product.location?.toLowerCase().includes(searchValue);

      const matchesFilter =
        filter === "all" ||
        (filter === "in-stock" && product.stock > 5) ||
        (filter === "low-stock" && product.stock > 0 && product.stock <= 5) ||
        (filter === "out-of-stock" && product.stock === 0);

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/10 bg-slate-950 px-4 py-4 shadow-[0_0_20px_rgba(34,211,238,.03)]">
          <Search size={18} className="text-cyan-300" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product..."
            className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-600"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            ["all", "All"],
            ["in-stock", "In Stock"],
            ["low-stock", "Low Stock"],
            ["out-of-stock", "Out of Stock"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value as StockFilter)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wide transition ${
                filter === value
                  ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                  : "border-cyan-400/10 bg-slate-950 text-slate-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-3">
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try changing your search or selected filter."
          />
        ) : (
          filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <GlassCard className="block p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/25">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black text-white">
                      {product.name}
                    </h2>

                    <p className="mt-1 break-words text-xs text-slate-500">
                      {product.barcode}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {product.sku ?? "No SKU"}
                    </p>

                    <span className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-300">
                      {product.location ?? "No Location"}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xl font-black text-white">
                      ${product.price}
                    </p>

                    <p
                      className={`mt-2 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
                        product.stock === 0
                          ? "border-red-400/20 bg-red-500/10 text-red-300"
                          : product.stock <= 5
                          ? "border-yellow-400/20 bg-yellow-500/10 text-yellow-300"
                          : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                      }`}
                    >
                      {product.stock} in stock
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))
        )}
      </section>
    </>
  );
}