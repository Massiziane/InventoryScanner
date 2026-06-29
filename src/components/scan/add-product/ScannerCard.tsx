"use client";

import { Camera, ScanLine } from "lucide-react";
import type { RefObject } from "react";

type ScannerCardProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  isCameraStarted: boolean;
  cameraError: string;
  onStart: () => void;
  onStop: () => void;
};

export default function ScannerCard({
  videoRef,
  isCameraStarted,
  cameraError,
  onStart,
  onStop,
}: ScannerCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
      <div className="relative aspect-[4/5] bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-64 rounded-2xl border-4 border-emerald-400/80" />
        </div>

        <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
          <ScanLine size={14} className="mr-1 inline" />
          {isCameraStarted ? "Scanning..." : "Camera stopped"}
        </div>
      </div>

      <div className="p-4">
        {!isCameraStarted ? (
          <button
            onClick={onStart}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 py-4 font-black text-slate-950"
          >
            <Camera size={20} />
            Start camera
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full rounded-2xl border border-slate-700 py-4 font-black text-slate-300"
          >
            Stop camera
          </button>
        )}
      </div>

      {cameraError && (
        <p className="px-4 pb-4 text-sm font-bold text-red-400">
          {cameraError}
        </p>
      )}
    </section>
  );
}