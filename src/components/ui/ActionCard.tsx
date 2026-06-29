import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ActionCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function ActionCard({
  href,
  icon: Icon,
  title,
  description,
}: ActionCardProps) {
  return (
    <Link href={href}>
      <section className="group relative block overflow-hidden rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_45%)] opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Icon size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-white">{title}</h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              {description}
            </p>
          </div>

          <ArrowRight className="mt-2 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
        </div>
      </section>
    </Link>
  );
}