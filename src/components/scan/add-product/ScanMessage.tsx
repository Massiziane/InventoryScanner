import { CheckCircle2 } from "lucide-react";

type ScanMessageProps = {
  message: string;
};

export default function ScanMessage({ message }: ScanMessageProps) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-cyan-400/10 bg-slate-950 p-4 shadow-[0_0_25px_rgba(34,211,238,0.04)]">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
        <CheckCircle2 size={16} className="text-cyan-300" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">
          Status
        </p>

        <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-300">
          {message}
        </p>
      </div>
    </div>
  );
}