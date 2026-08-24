"use client";

import { CheckCircle2 } from "lucide-react";

type Props = {
  message: string;
};

export default function ScanNotification({ message }: Props) {
  if (!message) return null;

  return (
    <div className="fixed left-1/2 top-20 z-[200] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-[var(--app-bg)]/95 p-4 shadow-[0_0_35px_rgba(34,211,238,.2)] backdrop-blur">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
          <CheckCircle2 size={22} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Scan successful
          </p>

          <p className="mt-1 truncate text-sm font-bold text-[var(--app-text)]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}