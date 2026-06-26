import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { Product } from "@/types";
import { getBaseUrl } from "@/lib/base-url";

async function getProducts() {
  const response = await fetch(`${getBaseUrl()}/api/products`, {
  cache: "no-store",
});

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json() as Promise<Product[]>;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-400">Inventory</p>
          <h1 className="text-3xl font-black">Products</h1>
        </div>

        <Link
          href="/products/new"
          className="rounded-2xl bg-emerald-400 p-3 text-slate-950"
        >
          <Plus size={22} />
        </Link>
      </header>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
        <Search size={18} className="text-slate-500" />
        <input
          placeholder="Search product"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </div>

      <section className="space-y-3">
        {products.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
            No products yet.
          </p>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block rounded-3xl border border-slate-800 bg-slate-900 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-black">{product.name}</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {product.barcode}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {product.sku ?? "No SKU"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-black">${product.price}</p>
                  <p
                    className={`mt-1 text-xs font-bold ${
                      product.stock === 0
                        ? "text-red-400"
                        : product.stock <= 5
                          ? "text-yellow-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {product.stock} in stock
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}