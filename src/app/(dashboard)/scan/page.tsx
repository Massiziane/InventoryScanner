// src/app/scan/page.tsx
import Link from "next/link";
import { ArrowRight, PackagePlus, Search } from "lucide-react";

export default function ScanPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
          Scanner
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
          Choose Action
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
          Scan an existing product or register a new one. Fast, reliable and
          optimized for mobile devices.
        </p>
      </header>

      <div className="space-y-4">
        <Link
          href="/scan/look-up"
          className="group relative block overflow-hidden rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_45%)] opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <Search size={28} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-white">
                Look for Product
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Scan a barcode to instantly check stock, location and product
                information.
              </p>
            </div>

            <ArrowRight className="mt-2 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
          </div>
        </Link>

        <Link
          href="/scan/add-product"
          className="group relative block overflow-hidden rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_45%)] opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <PackagePlus size={28} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-white">
                Add Product
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Scan a barcode to update an existing product or create a brand
                new inventory item.
              </p>
            </div>

            <ArrowRight className="mt-2 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
          </div>
        </Link>
      </div>
    </div>
  );
}