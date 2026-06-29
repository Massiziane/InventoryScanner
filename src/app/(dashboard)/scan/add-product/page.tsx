"use client";

import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import ProductForm from "@/components/products/ProductForm";
import ScannerCard from "@/components/scan/add-product/ScannerCard";
import BarcodeSearchCard from "@/components/scan/add-product/BarcodeSearchCard";
import ScanMessage from "@/components/scan/add-product/ScanMessage";
import { useAddProductScanner } from "@/hooks/useAddProductScanner";

export default function AddProductScanPage() {
  const {
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
  } = useAddProductScanner();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Inventory"
        title="Add Product"
        description="Scan a barcode to update an existing product or create a new inventory item if it doesn't already exist."
      />

      <ScannerCard
        videoRef={videoRef}
        isCameraStarted={isCameraStarted}
        cameraError={cameraError}
        onStart={handleStartScanner}
        onStop={handleStopScanner}
      />

      <BarcodeSearchCard
        barcode={barcode}
        isLoading={isLoading}
        onBarcodeChange={setBarcode}
        onSearch={() => handleSearchProduct()}
      />

      <ScanMessage message={message} />

      {showForm && (
        <ProductForm
          mode={product ? "update" : "create"}
          barcode={barcode}
          product={product}
          onSaved={handleProductSaved}
        />
      )}
    </PageShell>
  );
}