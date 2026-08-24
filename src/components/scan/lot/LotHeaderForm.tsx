"use client";

import { MapPin, Boxes } from "lucide-react";

type Props = {
  name: string;
  location: string;
  onNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
};

export default function LotHeaderForm({
  name,
  location,
  onNameChange,
  onLocationChange,
}: Props) {
  return (
    <section className="space-y-4 rounded-3xl border border-cyan-400/10 bg-[var(--app-bg)] p-5">
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-300">
          <Boxes size={17} />
          Lot name
        </span>

        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Example: Delivery August 24"
          className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 outline-none focus:border-cyan-300"
        />
      </label>

      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-300">
          <MapPin size={17} />
          Lot location
        </span>

        <input
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          placeholder="Example: Warehouse B"
          className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 outline-none focus:border-cyan-300"
        />
      </label>
    </section>
  );
}