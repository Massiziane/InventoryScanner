import ProductFilters from "@/components/products/ProductFilters";
import GlassCard from "@/components/ui/GlassCard";
import PageShell from "@/components/ui/PageShell";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    barcode: product.barcode,
    sku: product.sku,
    price: product.price.toString(),
    stock: product.stock,
    location: product.location,
  }));

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

      <ProductFilters products={serializedProducts} />
    </PageShell>
  );
}