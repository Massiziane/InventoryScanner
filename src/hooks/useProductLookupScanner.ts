"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import type { Product, ScanAction } from "@/types";

import { prepareScanFeedback } from "@/lib/scan-feedback";
import { searchProductByBarcode } from "@/utils/products";
import { applyProductScan } from "@/utils/scans";
import { startBarcodeScanner } from "@/utils/scanner";

export function useProductLookupScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef("");
  const scanNoticeTimeoutRef = useRef<number | null>(null);

  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);

  const [message, setMessage] = useState("");
  const [scanNotice, setScanNotice] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isCameraStarted, setIsCameraStarted] = useState(false);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;

      if (scanNoticeTimeoutRef.current !== null) {
        window.clearTimeout(scanNoticeTimeoutRef.current);
      }
    };
  }, []);

  function showScanNotice(text: string) {
    setScanNotice(text);

    if (scanNoticeTimeoutRef.current !== null) {
      window.clearTimeout(scanNoticeTimeoutRef.current);
    }

    scanNoticeTimeoutRef.current = window.setTimeout(() => {
      setScanNotice("");
      scanNoticeTimeoutRef.current = null;
    }, 1800);
  }

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
          if (detectedBarcode === lastScannedRef.current) {
            return;
          }

          lastScannedRef.current = detectedBarcode;

          setBarcode(detectedBarcode);

          showScanNotice(`Barcode ${detectedBarcode} scanned`);

          if (navigator.vibrate) {
            navigator.vibrate(100);
          }

          await handleSearchProduct(detectedBarcode);

          window.setTimeout(() => {
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
    const normalizedCode = code.trim();

    if (!normalizedCode) return;

    setIsLoading(true);
    setMessage("");
    setProduct(null);

    try {
      const data = await searchProductByBarcode(normalizedCode);

      if (!data?.product) {
        showScanNotice(`Barcode ${normalizedCode} scanned`);

        setMessage(
          `Scanned ${normalizedCode}, but no product was found.`
        );

        return;
      }

      setProduct(data.product);

      showScanNotice(`${data.product.name} scanned`);

      setMessage("Product found.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Product lookup failed."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApplyScan(action: ScanAction) {
    if (!barcode.trim()) return;

    try {
      setIsLoading(true);
      setMessage("");

      const data = await applyProductScan(
        barcode,
        action
      );

      setProduct(data.product);

      if (data.product) {
        const actionLabel =
          action === "ADD_STOCK"
            ? "stock added"
            : action === "REMOVE_STOCK"
              ? "stock removed"
              : action === "SALE"
                ? "sale recorded"
                : "checked";

        showScanNotice(
          `${data.product.name}: ${actionLabel}`
        );
      }

      setMessage("Stock updated successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Scan failed."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return {
    videoRef,

    barcode,
    product,

    message,
    scanNotice,

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