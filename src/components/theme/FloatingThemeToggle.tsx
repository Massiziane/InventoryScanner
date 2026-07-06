"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") ?? "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed left-20 top-4 z-50 rounded-2xl border border-[var(--app-border)] bg-[var(--app-panel)] p-3 text-[var(--app-text)] shadow-lg transition hover:bg-[var(--app-panel-soft)]"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}