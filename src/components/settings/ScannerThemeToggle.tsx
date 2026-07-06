"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScannerThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") ?? "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  function updateTheme(nextTheme: "dark" | "light") {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-panel)] p-5">
      <h2 className="text-xl font-black text-[var(--app-text)]">Appearance</h2>
      <p className="mt-2 text-sm text-[var(--app-muted)]">
        Choose the display mode that feels most comfortable.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => updateTheme("dark")}
          className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-black ${
            theme === "dark"
              ? "bg-[var(--app-accent)] text-slate-950"
              : "border border-[var(--app-border)] text-[var(--app-text)]"
          }`}
        >
          <Moon size={18} />
          Dark
        </button>

        <button
          onClick={() => updateTheme("light")}
          className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-black ${
            theme === "light"
              ? "bg-[var(--app-accent)] text-slate-950"
              : "border border-[var(--app-border)] text-[var(--app-text)]"
          }`}
        >
          <Sun size={18} />
          Light
        </button>
      </div>
    </div>
  );
}