import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageShell from "@/components/ui/PageShell";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <PageShell>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-cyan-300"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <GlassCard>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
          {product.sku ?? "No SKU"}
        </p>

        <h1 className="mt-3 break-words text-4xl font-black tracking-tight text-white">
          {product.name}
        </h1>

        <div className="mt-4 space-y-1 text-sm text-slate-500">
          <p className="break-words">Barcode: {product.barcode}</p>
          <p>Location: {product.location ?? "No location set"}</p>
        </div>

        {product.description && (
          <p className="mt-5 text-sm leading-6 text-slate-300">
            {product.description}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Price
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              ${product.price.toString()}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Stock
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {product.stock}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-2xl font-black text-white">Recent Scans</h2>

        <div className="mt-4 space-y-3">
          {product.scans.length === 0 ? (
            <EmptyState title="No scans yet." />
          ) : (
            product.scans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4"
              >
                <div className="min-w-0">
                  <p className="font-black text-white">{scan.action}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {scan.createdAt.toLocaleString()}
                  </p>
                </div>

                <p className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-300">
                  Qty: {scan.quantity}
                </p>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </PageShell>
  );
}