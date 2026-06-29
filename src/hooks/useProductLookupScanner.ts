"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import type { Product, ScanAction } from "@/types";
import { playScanFeedback, prepareScanFeedback } from "@/lib/scan-feedback";
import { searchProductByBarcode } from "@/utils/products";
import { applyProductScan } from "@/utils/scans";
import { startBarcodeScanner } from "@/utils/scanner";

export function useProductLookupScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef("");

  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isCameraStarted, setIsCameraStarted] = useState(false);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  async function handleStartScanner() {
    if (!videoRef.current) return;

    try {
      prepareScanFeedback();

      setCameraError("");
      setMessage("");

      controlsRef.current = await startBarcodeScanner({
        videoElement: videoRef.current,
        onError: console.error,
        onBarcodeDetected: async (detectedBarcode) => {
          if (detectedBarcode === lastScannedRef.current) return;

          lastScannedRef.current = detectedBarcode;
          setBarcode(detectedBarcode);
          setMessage(`Scanned: ${detectedBarcode}`);

          playScanFeedback();

          await handleSearchProduct(detectedBarcode);

          setTimeout(() => {
            lastScannedRef.current = "";
          }, 2500);
        },
      });

      setIsCameraStarted(true);
    } catch (error) {
      console.error(error);
      setIsCameraStarted(false);
      setCameraError(
        "Camera access failed. Allow camera permission or use manual input."
      );
    }
  }

  function handleStopScanner() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsCameraStarted(false);
  }

  async function handleSearchProduct(code = barcode) {
    if (!code.trim()) return;

    setIsLoading(true);
    setMessage("");
    setProduct(null);

    const data = await searchProductByBarcode(code);

    setIsLoading(false);

    if (!data?.product) {
      setMessage(`Scanned ${code}, but no product was found.`);
      return;
    }

    setProduct(data.product);
    setMessage("Product found.");
  }

  async function handleApplyScan(action: ScanAction) {
    if (!barcode.trim()) return;

    try {
      setIsLoading(true);
      setMessage("");

      const data = await applyProductScan(barcode, action);

      setProduct(data.product);
      setMessage("Stock updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Scan failed");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    videoRef,
    barcode,
    product,
    message,
    isLoading,
    cameraError,
    isCameraStarted,
    setBarcode,
    handleStartScanner,
    handleStopScanner,
    handleSearchProduct,
    handleApplyScan,
  };
}