type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)]">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
        {eyebrow}
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      )}
    </header>
  );
}