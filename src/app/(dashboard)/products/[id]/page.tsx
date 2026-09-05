import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageShell from "@/components/ui/PageShell";

import ProductEditPanel from "@/components/products/ProductEditPanel";

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  MapPin,
  Package,
  Tag,
  ImageIcon,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function categoryLabel(
  category: string | null
) {
  if (!category) {
    return "Uncategorized";
  }

  return category
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function actionLabel(
  action: string
) {
  if (action === "ADD_STOCK") {
    return "Added stock";
  }

  if (action === "REMOVE_STOCK") {
    return "Removed stock";
  }

  if (action === "SALE") {
    return "Sale";
  }

  return "Checked";
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product =
    await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        variants: {
          orderBy: {
            size: "asc",
          },
        },

        promotions: {
          orderBy: {
            createdAt: "desc",
          },
        },

        scans: {
          orderBy: {
            createdAt: "desc",
          },

          take: 10,
        },
      },
    });

  if (!product) {
    notFound();
  }

  const activePromotions =
    product.promotions.filter(
      (promotion) =>
        promotion.active
    );

  /*
   * Only pass the fields ProductForm actually needs
   * into the client-side edit component.
   *
   * Prisma Decimal objects are converted to numbers
   * so they can safely cross the server/client boundary.
   */
  const editableProduct = {
    id: product.id,

    name: product.name,

    barcode:
      product.barcode,

    sku:
      product.sku,

    description:
      product.description,

    price:
      Number(product.price),

    stock:
      product.stock,

    location:
      product.location,

    imageUrl:
      product.imageUrl,

    category:
      product.category,

    variants:
      product.variants.map(
        (variant) => ({
          id:
            variant.id,

          size:
            variant.size,

          stock:
            variant.stock,

          barcode:
            variant.barcode,
        })
      ),

    promotions:
      product.promotions.map(
        (promotion) => ({
          id:
            promotion.id,

          quantity:
            promotion.quantity,

          price:
            Number(
              promotion.price
            ),

          active:
            promotion.active,
        })
      ),
  };

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
        <div className="space-y-6">
          {product.imageUrl && (
            <details className="group">
              <summary
                className="inline-flex cursor-pointer list-none items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300 transition hover:bg-cyan-400/20"
                title="View product photo"
              >
                <ImageIcon
                  size={20}
                />
              </summary>

              <div className="mt-3 overflow-hidden rounded-3xl border border-cyan-400/10 bg-[var(--app-panel)]">
                <img
                  src={
                    product.imageUrl
                  }
                  alt={
                    product.name
                  }
                  className="h-64 w-full object-contain p-5"
                />
              </div>
            </details>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                {product.sku ??
                  "No SKU"}
              </p>

              <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-1 text-xs font-bold text-slate-400">
                {categoryLabel(
                  product.category
                )}
              </span>
            </div>

            <h1 className="mt-3 break-words text-4xl font-black tracking-tight text-[var(--app-text)]">
              {product.name}
            </h1>

            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Tag
                  size={15}
                  className="text-cyan-300"
                />

                <span className="break-all">
                  {product.barcode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin
                  size={15}
                  className="text-cyan-300"
                />

                <span>
                  {product.location ??
                    "No location set"}
                </span>
              </div>
            </div>

            {product.description && (
              <p className="mt-5 text-sm leading-6 text-slate-300">
                {
                  product.description
                }
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)]/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Regular Price
              </p>

              <p className="mt-1 text-2xl font-black text-[var(--app-text)]">
                $
                {Number(
                  product.price
                ).toFixed(2)}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)]/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Stock
              </p>

              <p className="mt-1 text-2xl font-black text-[var(--app-text)]">
                {product.stock}
              </p>
            </div>
          </div>

          {activePromotions.length >
            0 && (
            <section className="space-y-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Special Pricing
                </p>

                <h2 className="mt-1 text-xl font-black text-[var(--app-text)]">
                  Active Promotions
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {activePromotions.map(
                  (promotion) => (
                    <div
                      key={
                        promotion.id
                      }
                      className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3"
                    >
                      <p className="text-lg font-black text-cyan-300">
                        {
                          promotion.quantity
                        }{" "}
                        for $
                        {Number(
                          promotion.price
                        ).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Regular $
                        {Number(
                          product.price
                        ).toFixed(2)}{" "}
                        each
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {product.category ===
            "FASHION" && (
            <section className="space-y-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Variants
                </p>

                <h2 className="mt-1 text-xl font-black text-[var(--app-text)]">
                  Sizes
                </h2>
              </div>

              {product.variants
                .length === 0 ? (
                <EmptyState title="No sizes configured." />
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {product.variants.map(
                    (variant) => (
                      <div
                        key={
                          variant.id
                        }
                        className="rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)]/70 p-4"
                      >
                        <p className="text-lg font-black text-[var(--app-text)]">
                          {
                            variant.size
                          }
                        </p>

                        <p
                          className={`mt-2 text-sm font-bold ${
                            variant.stock ===
                            0
                              ? "text-red-300"
                              : variant.stock <=
                                  5
                                ? "text-amber-300"
                                : "text-cyan-300"
                          }`}
                        >
                          {
                            variant.stock
                          }{" "}
                          in stock
                        </p>

                        {variant.barcode && (
                          <p className="mt-2 break-all text-xs text-slate-500">
                            {
                              variant.barcode
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </GlassCard>

      {/* Product editing */}

      <ProductEditPanel
        product={
          editableProduct
        }
      />

      <GlassCard>
        <div className="flex items-center gap-2">
          <Package
            size={20}
            className="text-cyan-300"
          />

          <h2 className="text-2xl font-black text-[var(--app-text)]">
            Recent Scans
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {product.scans.length ===
          0 ? (
            <EmptyState title="No scans yet." />
          ) : (
            product.scans.map(
              (scan) => (
                <div
                  key={
                    scan.id
                  }
                  className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)]/70 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-black text-[var(--app-text)]">
                      {actionLabel(
                        scan.action
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {scan.createdAt.toLocaleString()}
                    </p>
                  </div>

                  <p
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${
                      scan.action ===
                        "SALE" ||
                      scan.action ===
                        "REMOVE_STOCK"
                        ? "border-red-400/20 bg-red-500/10 text-red-300"
                        : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                    }`}
                  >
                    Qty:{" "}
                    {
                      scan.quantity
                    }
                  </p>
                </div>
              )
            )
          )}
        </div>
      </GlassCard>
    </PageShell>
  );
}

