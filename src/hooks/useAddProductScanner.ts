"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import type { Product, ProductDraft } from "@/types";
import { startBarcodeScanner } from "@/utils/scanner";
import { searchProductByBarcode } from "@/utils/products";

export function useAddProductScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef("");

  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft | null>(null);
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
    const normalizedCode = code.trim();

    if (!normalizedCode) return;

    setIsLoading(true);
    setMessage("");
    setProduct(null);
    setDraft(null);
    setShowForm(false);

    const data = await searchProductByBarcode(normalizedCode);

    setIsLoading(false);

    if (!data) {
      setDraft({
        barcode: normalizedCode,
        name: "",
        description: "",
        imageUrl: "",
      });
      setMessage("Product search failed. You can create it manually.");
      setShowForm(true);
      return;
    }

    if (data.source === "local" && data.product) {
      setProduct(data.product);
      setDraft(null);
      setShowForm(true);

      setMessage(
        `Product already exists: ${data.product.stock} in stock${
          data.product.location ? ` at ${data.product.location}` : ""
        }.`
      );

      return;
    }

    if (data.source === "upcitemdb" && data.externalProduct) {
      setProduct(null);
      setDraft({
        barcode: normalizedCode,
        name: data.externalProduct.name,
        description: data.externalProduct.description,
        imageUrl: data.externalProduct.imageUrl,
      });
      setShowForm(true);
      setMessage("Product found online. Review and save it.");

      return;
    }

    setProduct(null);
    setDraft({
      barcode: normalizedCode,
      name: "",
      description: "",
      imageUrl: "",
    });
    setShowForm(true);
    setMessage("Product not found. You can create it manually.");
  }

  function resetPage() {
    setBarcode("");
    setProduct(null);
    setDraft(null);
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
    draft,
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