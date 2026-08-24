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

  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isTorchSupported, setIsTorchSupported] = useState(false);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  function getVideoTrack() {
    const stream = videoRef.current?.srcObject as MediaStream | null;

    return stream?.getVideoTracks()?.[0] ?? null;
  }

  function checkTorchSupport() {
    const track = getVideoTrack();

    if (!track) {
      console.log("No active video track");
      setIsTorchSupported(false);
      return;
    }

    const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & {
      torch?: boolean;
    };

    console.log("Camera capabilities:", capabilities);

    const supported =
      "torch" in capabilities && capabilities.torch === true;

    console.log("Torch supported:", supported);

    setIsTorchSupported(supported);
  }

  async function handleToggleTorch() {
    const track = getVideoTrack();

    if (!track) {
      setMessage("No active camera found.");
      return;
    }

    const nextValue = !isTorchOn;

    try {
      await track.applyConstraints({
        advanced: [
          {
            torch: nextValue,
          } as MediaTrackConstraintSet & {
            torch: boolean;
          },
        ],
      });

      setIsTorchOn(nextValue);
      setMessage(
        nextValue
          ? "Flashlight turned on."
          : "Flashlight turned off."
      );
    } catch (error) {
      console.error("Torch error:", error);

      setMessage(
        "Your current camera/browser does not allow flashlight control."
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

      controlsRef.current = await startBarcodeScanner({
        videoElement: videoRef.current,

        onError: console.error,

        onBarcodeDetected: async (detectedBarcode) => {
          if (detectedBarcode === lastScannedRef.current) {
            return;
          }

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

      if (videoRef.current) {
        if (videoRef.current.readyState >= 2) {
          checkTorchSupport();
        } else {
          videoRef.current.onloadedmetadata = () => {
            checkTorchSupport();
          };
        }
      }
    } catch (error) {
      console.error(error);

      setIsCameraStarted(false);
      setIsTorchOn(false);
      setIsTorchSupported(false);

      setCameraError(
        "Camera access failed. Allow camera permission or use manual input."
      );
    }
  }

  function handleStopScanner() {
    controlsRef.current?.stop();
    controlsRef.current = null;

    setIsCameraStarted(false);
    setIsTorchOn(false);
    setIsTorchSupported(false);
  }

  async function handleSearchProduct(code = barcode) {
    const normalizedCode = code.trim();

    if (!normalizedCode) return;

    setIsLoading(true);
    setMessage("");
    setProduct(null);
    setDraft(null);
    setShowForm(false);

    try {
      const data = await searchProductByBarcode(normalizedCode);

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

      if (data.source === "local" && data.product) {
        setProduct(data.product);
        setDraft(null);
        setShowForm(true);

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
          description: data.externalProduct.description,
          imageUrl: data.externalProduct.imageUrl,
        });

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
      product ? "Product modified." : "Product created."
    );

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