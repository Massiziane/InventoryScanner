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
    <div className="space-y-5">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm font-bold text-emerald-400">
          {product.sku ?? "No SKU"}
        </p>

        <h1 className="mt-2 text-3xl font-black">{product.name}</h1>

        <p className="mt-2 text-sm text-slate-400">
          Barcode: {product.barcode}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Location: {product.location ?? "No location set"}
        </p>

        {product.description && (
          <p className="mt-4 text-sm text-slate-300">{product.description}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-950 p-4">
            <p className="text-xs text-slate-400">Price</p>
            <p className="text-2xl font-black">${product.price.toString()}</p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4">
            <p className="text-xs text-slate-400">Stock</p>
            <p className="text-2xl font-black">{product.stock}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-lg font-black">Recent scans</h2>

        <div className="mt-4 space-y-3">
          {product.scans.length === 0 ? (
            <p className="text-sm text-slate-400">No scans yet.</p>
          ) : (
            product.scans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between rounded-2xl bg-slate-950 p-4"
              >
                <div>
                  <p className="font-bold">{scan.action}</p>
                  <p className="text-xs text-slate-500">
                    {scan.createdAt.toLocaleString()}
                  </p>
                </div>

                <p className="font-black text-emerald-400">
                  Qty: {scan.quantity}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}