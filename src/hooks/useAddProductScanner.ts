"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import type { Product, ProductDraft } from "@/types";

import { startBarcodeScanner } from "@/utils/scanner";
import { searchProductByBarcode } from "@/utils/products";

import {
  prepareTorch,
  setTorch,
  clearTorch,
} from "@/utils/torch";

export function useAddProductScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef("");

  const scanNoticeTimeoutRef = useRef<number | null>(null);

  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft | null>(null);

  const [message, setMessage] = useState("");
  const [scanNotice, setScanNotice] = useState("");
  const [cameraError, setCameraError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isTorchSupported, setIsTorchSupported] = useState(false);

  useEffect(() => {
    return () => {
      clearTorch();

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

  async function setupTorch() {
    if (!videoRef.current) {
      setIsTorchSupported(false);
      return;
    }

    const supported = prepareTorch(videoRef.current);

    console.log("Torch supported:", supported);

    setIsTorchSupported(supported);
    setIsTorchOn(false);
  }

  async function handleToggleTorch() {
    if (!isTorchSupported) {
      setMessage(
        "Flashlight is not available for the active camera."
      );

      return;
    }

    const nextValue = !isTorchOn;

    try {
      await setTorch(nextValue);

      setIsTorchOn(nextValue);

      setMessage(
        nextValue
          ? "Flashlight turned on."
          : "Flashlight turned off."
      );
    } catch (error) {
      console.error("Torch toggle failed:", error);

      setIsTorchOn(false);

      setMessage(
        "The browser could not control the camera flashlight."
      );
    }
  }

  async function handleStartScanner() {
    if (!videoRef.current) return;

    try {
      setCameraError("");
      setMessage("");

      setIsTorchOn(false);
      setIsTorchSupported(false);

      clearTorch();

      controlsRef.current = await startBarcodeScanner({
        videoElement: videoRef.current,

        onError: console.error,

        onBarcodeDetected: async (detectedBarcode) => {
          if (
            detectedBarcode === lastScannedRef.current
          ) {
            return;
          }

          lastScannedRef.current = detectedBarcode;

          setBarcode(detectedBarcode);

          showScanNotice(
            `Barcode ${detectedBarcode}`
          );

          if (navigator.vibrate) {
            navigator.vibrate(100);
          }

          await handleSearchProduct(
            detectedBarcode
          );

          window.setTimeout(() => {
            lastScannedRef.current = "";
          }, 2500);
        },
      });

      setIsCameraStarted(true);

      const video = videoRef.current;

      if (!video) {
        return;
      }

      if (video.readyState >= 2 && video.srcObject) {
        await setupTorch();
      } else {
        const handleLoadedMetadata = async () => {
          await setupTorch();
        };

        video.addEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
          {
            once: true,
          }
        );
      }
    } catch (error) {
      console.error(error);

      clearTorch();

      setIsCameraStarted(false);
      setIsTorchOn(false);
      setIsTorchSupported(false);

      setCameraError(
        "Camera access failed. Allow camera permission or use manual input."
      );
    }
  }

  async function handleStopScanner() {
    if (isTorchOn) {
      try {
        await setTorch(false);
      } catch (error) {
        console.error(
          "Could not disable torch before stopping camera:",
          error
        );
      }
    }

    clearTorch();

    controlsRef.current?.stop();
    controlsRef.current = null;

    setIsCameraStarted(false);
    setIsTorchOn(false);
    setIsTorchSupported(false);
  }

  async function handleSearchProduct(
    code = barcode
  ) {
    const normalizedCode = code.trim();

    if (!normalizedCode) return;

    setIsLoading(true);

    setMessage("");
    setProduct(null);
    setDraft(null);
    setShowForm(false);

    try {
      const data =
        await searchProductByBarcode(
          normalizedCode
        );

      if (!data) {
        setDraft({
          barcode: normalizedCode,
          name: "",
          description: "",
          imageUrl: "",
        });

        setMessage(
          "Product search failed. You can create it manually."
        );

        setShowForm(true);

        return;
      }

      if (
        data.source === "local" &&
        data.product
      ) {
        setProduct(data.product);
        setDraft(null);
        setShowForm(true);

        showScanNotice(
          `${data.product.name} scanned`
        );

        setMessage(
          `Product already exists: ${data.product.stock} in stock${
            data.product.location
              ? ` at ${data.product.location}`
              : ""
          }.`
        );

        return;
      }

      if (
        data.source === "upcitemdb" &&
        data.externalProduct
      ) {
        setProduct(null);

        setDraft({
          barcode: normalizedCode,
          name: data.externalProduct.name,
          description:
            data.externalProduct.description,
          imageUrl:
            data.externalProduct.imageUrl,
        });

        showScanNotice(
          `${data.externalProduct.name} scanned`
        );

        setShowForm(true);

        setMessage(
          "Product found online. Review and save it."
        );

        return;
      }

      setProduct(null);

      setDraft({
        barcode: normalizedCode,
        name: "",
        description: "",
        imageUrl: "",
      });

      showScanNotice(
        `Barcode ${normalizedCode} scanned`
      );

      setShowForm(true);

      setMessage(
        "Product not found. You can create it manually."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while searching for the product."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function resetPage() {
    setBarcode("");
    setProduct(null);
    setDraft(null);
    setMessage("");
    setShowForm(false);
  }

  function handleProductSaved() {
    setMessage(
      product
        ? "Product modified."
        : "Product created."
    );

    resetPage();
  }

  return {
    videoRef,

    barcode,
    product,
    draft,

    message,
    scanNotice,
    cameraError,

    isLoading,
    isCameraStarted,
    showForm,

    isTorchOn,
    isTorchSupported,

    setBarcode,

    handleStartScanner,
    handleStopScanner,
    handleToggleTorch,

    handleSearchProduct,
    handleProductSaved,
  };
}