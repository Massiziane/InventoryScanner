"use client";

import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";

import ProductForm from "@/components/products/ProductForm";
import AddStockCard from "@/components/products/AddStockCard";

import ScannerCard from "@/components/scan/add-product/ScannerCard";
import BarcodeSearchCard from "@/components/scan/add-product/BarcodeSearchCard";
import ScanMessage from "@/components/scan/add-product/ScanMessage";

import { useAddProductScanner } from "@/hooks/useAddProductScanner";

export default function AddProductScanPage() {
  const {
    videoRef,

    barcode,
    product,
    draft,

    message,
    cameraError,

    isLoading,
    isCameraStarted,

    showForm,
    showAddStock,

    isTorchOn,
    isTorchSupported,

    setBarcode,

    handleStartScanner,
    handleStopScanner,
    handleToggleTorch,

    handleSearchProduct,

    handleProductSaved,
    handleStockUpdated,

    resetPage,
  } = useAddProductScanner();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Inventory"
        title="Add Product"
        description="Scan a barcode to add stock to an existing product or create a new inventory item."
      />

      <div className="space-y-5">
        <ScannerCard
          videoRef={videoRef}
          isCameraStarted={isCameraStarted}
          cameraError={cameraError}
          isTorchOn={isTorchOn}
          isTorchSupported={isTorchSupported}
          onStart={handleStartScanner}
          onStop={handleStopScanner}
          onToggleTorch={handleToggleTorch}
        />

        <BarcodeSearchCard
          barcode={barcode}
          isLoading={isLoading}
          onBarcodeChange={setBarcode}
          onSearch={() => handleSearchProduct()}
        />

        <ScanMessage message={message} />

        {/* Existing product */}
        {showAddStock && product && (
          <AddStockCard
            product={product}
            onUpdated={handleStockUpdated}
            onCancel={resetPage}
          />
        )}

        {/* New product */}
        {showForm && (
          <ProductForm
            mode="create"
            barcode={barcode}
            product={null}
            draft={draft}
            onSaved={handleProductSaved}
          />
        )}
      </div>
    </PageShell>
  );
}