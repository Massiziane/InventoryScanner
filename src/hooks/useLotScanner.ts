"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import type { PendingLotItem, Product, ProductDraft } from "@/types";

import { startBarcodeScanner } from "@/utils/scanner";
import { searchProductByBarcode } from "@/utils/products";

export function useLotScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef("");

  const [barcode, setBarcode] = useState("");
  const [lotName, setLotName] = useState("");
  const [lotLocation, setLotLocation] = useState("");

  const [items, setItems] = useState<PendingLotItem[]>([]);

  const [product, setProduct] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft | null>(null);

  const [message, setMessage] = useState("");
  const [cameraError, setCameraError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingLot, setIsSavingLot] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);

  const [showProductForm, setShowProductForm] = useState(false);

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

    if (!normalizedCode) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    setProduct(null);
    setDraft(null);
    setShowProductForm(false);

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
          "Product lookup failed. Fill in the product information to add it to this lot."
        );

        setShowProductForm(true);

        return;
      }

      if (data.source === "local" && data.product) {
        addProductToLot(data.product);

        setBarcode("");

        return;
      }

      if (data.source === "upcitemdb" && data.externalProduct) {
        setDraft({
          barcode: normalizedCode,
          name: data.externalProduct.name,
          description: data.externalProduct.description,
          imageUrl: data.externalProduct.imageUrl,
        });

        setMessage(
          "Product found online. Review the information before adding it to the lot."
        );

        setShowProductForm(true);

        return;
      }

      setDraft({
        barcode: normalizedCode,
        name: "",
        description: "",
        imageUrl: "",
      });

      setMessage(
        "Product not found. Create it and it will be added to this lot."
      );

      setShowProductForm(true);
    } catch (error) {
      console.error(error);

      setMessage("Something went wrong while searching for the product.");
    } finally {
      setIsLoading(false);
    }
  }

  function addProductToLot(foundProduct: Product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === foundProduct.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === foundProduct.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product: foundProduct,
          quantity: 1,
        },
      ];
    });

    setMessage(`${foundProduct.name} added to lot.`);
  }

  function handleProductCreated(savedProduct: Product) {
    addProductToLot(savedProduct);

    setProduct(null);
    setDraft(null);
    setBarcode("");
    setShowProductForm(false);

    setMessage(`${savedProduct.name} created and added to lot.`);
  }

  function handleQuantityChange(productId: string, quantity: number) {
    const safeQuantity = Math.max(1, quantity || 1);

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item
      )
    );
  }

  async function handleProductUpdated(productId: string) {
    try {
      const response = await fetch(`/api/products/${productId}`);

      if (!response.ok) {
        setMessage("Product was saved, but the lot view could not refresh.");
        return;
      }

      const updatedProduct: Product = await response.json();

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                product: updatedProduct,
              }
            : item
        )
      );

      setMessage(`${updatedProduct.name} updated.`);
    } catch (error) {
      console.error(error);

      setMessage("Product was saved, but the lot view could not refresh.");
    }
  }

  function handleRemoveItem(productId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );

    setMessage("Product removed from lot.");
  }

  async function handleSaveLot() {
    const normalizedName = lotName.trim();
    const normalizedLocation = lotLocation.trim();

    if (!normalizedName) {
      setMessage("Give the lot a name before saving.");
      return;
    }

    if (items.length === 0) {
      setMessage("Scan at least one product before saving the lot.");
      return;
    }

    try {
      setIsSavingLot(true);
      setMessage("");

      const response = await fetch("/api/lots", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: normalizedName,
          location: normalizedLocation || null,

          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);

        setMessage(
          data?.error
            ? String(data.error)
            : "The lot could not be saved."
        );

        return;
      }

      setMessage(`Lot "${data.name}" saved successfully.`);

      setLotName("");
      setLotLocation("");
      setItems([]);
      setBarcode("");

      setProduct(null);
      setDraft(null);
      setShowProductForm(false);
    } catch (error) {
      console.error(error);

      setMessage("The lot could not be saved.");
    } finally {
      setIsSavingLot(false);
    }
  }

  return {
    videoRef,

    barcode,
    lotName,
    lotLocation,

    items,

    product,
    draft,

    message,
    cameraError,

    isLoading,
    isSavingLot,
    isCameraStarted,
    showProductForm,

    setBarcode,
    setLotName,
    setLotLocation,

    handleStartScanner,
    handleStopScanner,

    handleSearchProduct,

    handleProductCreated,
    handleProductUpdated,

    handleQuantityChange,
    handleRemoveItem,

    handleSaveLot,
  };
}