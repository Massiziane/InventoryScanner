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
    <section className="overflow-hidden rounded-3xl border border-cyan-400/10 bg-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.06)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(2,6,23,.65)_100%)]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:38px_38px]" />

        {/* Scanner Frame */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-52 w-[80%] max-w-sm">
            <span className="absolute left-0 top-0 h-10 w-10 border-l-4 border-t-4 border-cyan-400" />
            <span className="absolute right-0 top-0 h-10 w-10 border-r-4 border-t-4 border-cyan-400" />
            <span className="absolute bottom-0 left-0 h-10 w-10 border-b-4 border-l-4 border-cyan-400" />
            <span className="absolute bottom-0 right-0 h-10 w-10 border-b-4 border-r-4 border-cyan-400" />

            {isCameraStarted && (
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.9)]" />
            )}
          </div>
        </div>

        {/* Status */}
        <div className="absolute bottom-4 left-4 rounded-full border border-cyan-400/20 bg-slate-950/80 px-3 py-2 backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
            <ScanLine size={14} className="text-cyan-300" />

            <span
              className={
                isCameraStarted ? "text-cyan-300" : "text-slate-400"
              }
            >
              {isCameraStarted ? "Scanning" : "Camera Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-400/10 p-5">
        {!isCameraStarted ? (
          <button
            onClick={onStart}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 py-4 text-base font-black text-slate-950 shadow-[0_0_25px_rgba(34,211,238,.25)] transition hover:bg-cyan-200 active:scale-[0.98]"
          >
            <Camera size={22} />
            Start Camera
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full rounded-2xl border border-cyan-400/20 bg-slate-900 py-4 font-black text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
          >
            Stop Camera
          </button>
        )}

        {cameraError && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-sm font-medium text-red-300">
              {cameraError}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}