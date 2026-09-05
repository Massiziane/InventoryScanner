"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { ScanLine, X } from "lucide-react";

type Props = {
  size: string;
  currentBarcode?: string;
  onClose: () => void;
  onConfirm: (barcode: string) => void;
};

export default function VariantBarcodeModal({
  size,
  currentBarcode = "",
  onClose,
  onConfirm,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [barcode, setBarcode] = useState(currentBarcode);
  const [cameraError, setCameraError] = useState("");
  const [hasDetected, setHasDetected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      try {
        setCameraError("");

        const reader = new BrowserMultiFormatReader();

        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current ?? undefined,
          (result) => {
            if (!result || cancelled) return;

            const value = result.getText().trim();

            if (!value) return;

            setBarcode(value);
            setHasDetected(true);

            controlsRef.current?.stop();
            controlsRef.current = null;
          }
        );

        if (cancelled) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
      } catch (error) {
        console.error(error);

        setCameraError(
          "Could not start the camera. You can enter the barcode manually."
        );
      }
    }

    startScanner();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, []);

  function handleClose() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    onClose();
  }

  function handleConfirm() {
    const cleaned = barcode.trim();

    if (!cleaned) return;

    controlsRef.current?.stop();
    controlsRef.current = null;

    onConfirm(cleaned);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-cyan-400/20 bg-[var(--app-bg)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-cyan-400/10 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Variant barcode
            </p>

            <h2 className="mt-1 text-xl font-black text-[var(--app-text)]">
              Scan size {size || "—"}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-[var(--app-panel)] text-[var(--app-muted)] transition hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {!hasDetected && (
            <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-black">
              <video
                ref={videoRef}
                muted
                playsInline
                className="aspect-[4/3] w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-[80%] rounded-xl border-2 border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,.25)]" />
              </div>
            </div>
          )}

          {cameraError && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-bold text-red-300">
              {cameraError}
            </p>
          )}

          {hasDetected && (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="flex items-center gap-3">
                <ScanLine className="text-cyan-300" />

                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--app-muted)]">
                    Barcode detected
                  </p>

                  <p className="break-all font-black text-cyan-300">
                    {barcode}
                  </p>
                </div>
              </div>
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-300">
              Barcode
            </span>

            <input
              value={barcode}
              onChange={(event) => {
                setBarcode(event.target.value);
                setHasDetected(false);
              }}
              placeholder="Scan or enter barcode"
              className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 text-[var(--app-text)] outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
            />
          </label>

          <button
            type="button"
            disabled={!barcode.trim()}
            onClick={handleConfirm}
            className="w-full rounded-2xl bg-cyan-300 py-4 font-black text-slate-950 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Assign barcode to size {size || "variant"}
          </button>
        </div>
      </div>
    </div>
  );
}