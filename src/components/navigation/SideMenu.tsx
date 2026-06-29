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
  { href: "/", label: "Home", icon: Home },
  { href: "/scan", label: "Scanner", icon: ScanLine },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/history", label: "Scan history", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function SideMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-2xl border border-slate-800 bg-slate-900 p-3 text-white shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu overlay"
          />

          <aside className="absolute left-0 top-0 h-full w-72 border-r border-slate-800 bg-slate-950 p-5 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-400">ScanApp</p>
                <h2 className="text-xl font-black text-white">Menu</h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-800 p-2 text-slate-300"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-4 font-bold text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}