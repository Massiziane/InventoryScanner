"use client";

import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";

import ScannerCard from "@/components/scan/add-product/ScannerCard";
import BarcodeSearchCard from "@/components/scan/add-product/BarcodeSearchCard";
import ScanMessage from "@/components/scan/add-product/ScanMessage";
import ScanNotification from "@/components/scan/ScanNotification";

import ProductScanResult from "@/components/scan/look-up/ProductScanResult";

import { useProductLookupScanner } from "@/hooks/useProductLookupScanner";

export default function ScanPage() {
  const {
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
  } = useProductLookupScanner();

  return (
    <PageShell>
      <ScanNotification message={scanNotice} />

      <PageHeader
        eyebrow="Scanner"
        title="Scan Product"
        description="Point your camera at a barcode or enter it manually below."
      />

      <div className="space-y-5">
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

        <ProductScanResult
          product={product}
          isLoading={isLoading}
          onApplyScan={handleApplyScan}
        />
      </div>
    </PageShell>
  );
}