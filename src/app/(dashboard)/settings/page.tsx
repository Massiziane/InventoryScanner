export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
          Settings
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
          App Settings
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Customize your ScanApp experience and manage future application
          preferences.
        </p>
      </header>

      <section className="rounded-3xl border border-cyan-400/10 bg-slate-950 p-6 shadow-[0_0_35px_rgba(34,211,238,0.04)]">
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            Coming Soon
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Settings will be available in a future update. This page is included
            in the MVP to establish the application's navigation and overall
            structure.
          </p>
        </div>
      </section>
    </div>
  );
}