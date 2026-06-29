import Link from "next/link";
import { ScanLine } from "lucide-react";

export default function HeroCard() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm font-semibold text-emerald-400">ScanApp</p>

      <h1 className="mt-2 text-3xl font-black">Inventory scanner</h1>

      <p className="mt-2 text-sm text-slate-400">
        Manage products, scan barcodes, and update stock from your phone.
      </p>

      <Link
        href="/scan"
        className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-400 px-4 py-4 font-black text-slate-950"
      >
        Start scanning
        <ScanLine size={22} />
      </Link>
    </section>
  );
}