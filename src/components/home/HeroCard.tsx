import Link from "next/link";
import { ArrowRight, Boxes, ScanLine } from "lucide-react";

export default function HeroCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-slate-950 p-6 shadow-[0_0_45px_rgba(34,211,238,0.08)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.4),rgba(2,6,23,0.95))]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="relative">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.15)]">
          <Boxes size={28} />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
          ScanApp
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
          Inventory scanner
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
          Manage products, scan barcodes, and update stock from your phone.
        </p>

        <Link
          href="/scan"
          className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black uppercase tracking-wide text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.25)] transition hover:bg-cyan-200"
        >
          Start scanning
          <ArrowRight size={19} />
        </Link>
      </div>

      <ScanLine className="absolute -bottom-8 -right-6 h-40 w-40 text-cyan-400/10" />
    </section>
  );
}