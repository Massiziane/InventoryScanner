import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageShell from "@/components/ui/PageShell";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageShell>
      <GlassCard className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
            Inventory
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            Products
          </h1>
        </div>

        <Link
          href="/scan/add-product"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,.25)] transition hover:bg-cyan-200"
        >
          <Plus size={22} />
        </Link>
      </GlassCard>

      <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/10 bg-slate-950 px-4 py-4 shadow-[0_0_20px_rgba(34,211,238,.03)]">
        <Search size={18} className="text-cyan-300" />

        <input
          placeholder="Search product..."
          className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-600"
        />
      </div>

      <section className="space-y-3">
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Start by scanning your first product."
          />
        ) : (
          products.map((product) => (
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
                      ${product.price.toString()}
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
    </PageShell>
  );
}