"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Search, ScanLine } from "lucide-react";
import type { Product, ScanAction } from "@/types";

type SearchResponse = {
  found: boolean;
  product: Product | null;
};

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const lastScannedRef = useRef("");

  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    async function startScanner() {
      try {
        const scanner = new BrowserMultiFormatReader();
        scannerRef.current = scanner;

        await scanner.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          async (result) => {
            if (!result) return;

            const detectedBarcode = result.getText();

            if (detectedBarcode === lastScannedRef.current) return;

            lastScannedRef.current = detectedBarcode;
            setBarcode(detectedBarcode);

            if (navigator.vibrate) {
              navigator.vibrate(100);
            }

            await searchProduct(detectedBarcode);

            setTimeout(() => {
              lastScannedRef.current = "";
            }, 2000);
          }
        );
      } catch {
        setCameraError(
          "Camera access failed. You can still enter the barcode manually."
        );
      }
    }

    startScanner();

    return () => {
      scannerRef.current = null;
    };
  }, []);

  async function searchProduct(code = barcode) {
    if (!code.trim()) return;

    setIsLoading(true);
    setMessage("");
    setProduct(null);

    const response = await fetch(
      `/api/products/search?barcode=${encodeURIComponent(code)}`
    );

    setIsLoading(false);

    if (!response.ok) {
      setMessage("No product found for this barcode.");
      return;
    }

    const data = (await response.json()) as SearchResponse;
    setProduct(data.product);
    setMessage("Product found.");
  }

  async function applyScan(action: ScanAction) {
    if (!barcode.trim()) return;

    setIsLoading(true);
    setMessage("");

    const response = await fetch("/api/scans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barcode,
        action,
        quantity: 1,
      }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setMessage(data.error || "Scan failed");
      return;
    }

    setProduct(data.product);
    setMessage("Stock updated successfully.");
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-emerald-400">Scanner</p>
        <h1 className="text-3xl font-black">Scan product</h1>
      </header>

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
            Scanning...
          </div>
        </div>

        {cameraError && (
          <p className="p-4 text-sm font-bold text-red-400">{cameraError}</p>
        )}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-300">
          <Keyboard size={18} />
          Barcode
        </label>

        <div className="flex gap-2">
          <input
            value={barcode}
            onChange={(event) => setBarcode(event.target.value)}
            placeholder="Enter barcode"
            className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-emerald-400"
          />

          <button
            onClick={() => searchProduct()}
            disabled={isLoading}
            className="rounded-2xl bg-emerald-400 px-4 font-black text-slate-950 disabled:opacity-60"
          >
            <Search size={20} />
          </button>
        </div>
      </section>

      {message && (
        <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
          {message}
        </p>
      )}

      {product && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm font-bold text-emerald-400">Product found</p>
          <h2 className="mt-2 text-2xl font-black">{product.name}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {product.sku ?? "No SKU"} · {product.barcode}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-950 p-4">
              <p className="text-xs text-slate-400">Price</p>
              <p className="text-xl font-black">${product.price}</p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4">
              <p className="text-xs text-slate-400">Stock</p>
              <p className="text-xl font-black">{product.stock}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => applyScan("ADD_STOCK")}
              disabled={isLoading}
              className="rounded-2xl bg-emerald-400 py-4 font-black text-slate-950 disabled:opacity-60"
            >
              + Add 1
            </button>

            <button
              onClick={() => applyScan("SALE")}
              disabled={isLoading}
              className="rounded-2xl bg-red-500 py-4 font-black text-white disabled:opacity-60"
            >
              - Sell 1
            </button>
          </div>
        </section>
      )}
    </div>
  );
}