// src/app/scan/page.tsx
import Link from "next/link";
import { PackagePlus, Search } from "lucide-react";

export default function ScanPage() {
  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-emerald-400">Scanner</p>
        <h1 className="text-3xl font-black">Choose action</h1>
      </header>

      <Link
        href="/scan/look-up"
        className="block rounded-3xl border border-slate-800 bg-slate-900 p-5"
      >
        <Search className="text-emerald-400" size={32} />
        <h2 className="mt-4 text-2xl font-black">Look for product</h2>
        <p className="mt-2 text-sm text-slate-400">
          Scan a barcode and check stock, price, and location.
        </p>
      </Link>

      <Link
        href="/scan/add-product"
        className="block rounded-3xl border border-slate-800 bg-slate-900 p-5"
      >
        <PackagePlus className="text-emerald-400" size={32} />
        <h2 className="mt-4 text-2xl font-black">Add product</h2>
        <p className="mt-2 text-sm text-slate-400">
          Scan a barcode. If it exists, modify it. If not, create it.
        </p>
      </Link>
    </div>
  );
}