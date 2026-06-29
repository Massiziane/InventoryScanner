"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Boxes,
  History,
  Home,
  Menu,
  ScanLine,
  Settings,
  X,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/scan", label: "Scanner", icon: ScanLine },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function SideMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-2xl border border-cyan-400/10 bg-slate-950/90 p-3 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,.08)] backdrop-blur transition hover:border-cyan-400/30"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close menu overlay"
          />

          <aside className="absolute left-0 top-0 flex h-screen w-72 flex-col overflow-y-auto border-r border-cyan-400/10 bg-slate-950 shadow-[20px_0_60px_rgba(0,0,0,.6)]">
            <div className="border-b border-cyan-400/10 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                    ScanApp
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-white">
                    Dashboard
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Inventory Management
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-cyan-400/10 p-2 text-slate-400 transition hover:border-cyan-400/30 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-4 text-slate-400 transition hover:border-cyan-400/10 hover:bg-slate-900 hover:text-cyan-300"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/15">
                      <Icon size={20} />
                    </div>

                    <span className="font-bold">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-cyan-400/10 p-5">
              <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Scanner Ready
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Your inventory system is ready to scan products.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}