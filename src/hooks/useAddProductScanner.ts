"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import type { Product } from "@/types";
import { startBarcodeScanner } from "@/utils/scanner";
import { searchProductByBarcode } from "@/utils/products";

export function useAddProductScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef("");

  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  async function handleStartScanner() {
    if (!videoRef.current) return;

    try {
      setCameraError("");
      setMessage("");

      controlsRef.current = await startBarcodeScanner({
        videoElement: videoRef.current,
        onError: console.error,
        onBarcodeDetected: async (detectedBarcode) => {
          if (detectedBarcode === lastScannedRef.current) return;

          lastScannedRef.current = detectedBarcode;
          setBarcode(detectedBarcode);

          if (navigator.vibrate) {
            navigator.vibrate(100);
          }

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
    setShowForm(false);

    const data = await searchProductByBarcode(code);

    setIsLoading(false);

    if (!data?.product) {
      setMessage("Product not found. You can create it with this barcode.");
      setShowForm(true);
      return;
    }

    setProduct(data.product);
    setShowForm(true);

    setMessage(
      `Product already exists: ${data.product.stock} in stock${
        data.product.location ? ` at ${data.product.location}` : ""
      }.`
    );
  }

  function resetPage() {
    setBarcode("");
    setProduct(null);
    setMessage("");
    setShowForm(false);
  }

  function handleProductSaved() {
    setMessage(product ? "Product modified." : "Product created.");
    resetPage();
  }

  return {
    videoRef,
    barcode,
    product,
    message,
    cameraError,
    isLoading,
    isCameraStarted,
    showForm,
    setBarcode,
    handleStartScanner,
    handleStopScanner,
    handleSearchProduct,
    handleProductSaved,
  };
}