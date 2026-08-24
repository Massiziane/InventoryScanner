"use client";

import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";

import ScannerCard from "@/components/scan/add-product/ScannerCard";
import BarcodeSearchCard from "@/components/scan/add-product/BarcodeSearchCard";
import ScanMessage from "@/components/scan/add-product/ScanMessage";
import ScanNotification from "@/components/scan/ScanNotification";

import LotHeaderForm from "@/components/scan/lot/LotHeaderForm";
import LotList from "@/components/scan/lot/LotList";

import ProductForm from "@/components/products/ProductForm";

import { useLotScanner } from "@/hooks/useLotScanner";

export default function LotScanPage() {
  const {
    videoRef,

    barcode,
    lotName,
    lotLocation,

    items,

    product,
    draft,

    message,
    scanNotice,
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
  } = useLotScanner();

  return (
    <PageShell>
      <ScanNotification message={scanNotice} />

      <PageHeader
        eyebrow="Inventory"
        title="Scan Lot"
        description="Create a group, assign its location and continuously scan products into it."
      />

      <div className="space-y-5">
        <LotHeaderForm
          name={lotName}
          location={lotLocation}
          onNameChange={setLotName}
          onLocationChange={setLotLocation}
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

        {showProductForm && (
          <section className="space-y-3">
            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
              <p className="text-sm font-bold text-cyan-300">
                New product
              </p>

              <p className="mt-1 text-sm text-[var(--app-muted)]">
                This barcode is not currently saved in your inventory. Complete
                the product information below and it will automatically be
                added to this lot.
              </p>
            </div>

            <ProductForm
              mode="create"
              barcode={barcode}
              product={product}
              draft={draft}
              onSaved={handleProductCreated}
            />
          </section>
        )}

        <LotList
          items={items}
          onQuantityChange={handleQuantityChange}
          onProductUpdated={handleProductUpdated}
          onRemove={handleRemoveItem}
        />

        {items.length > 0 && (
          <section className="rounded-3xl border border-cyan-400/10 bg-[var(--app-bg)] p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-black text-[var(--app-text)]">
                  Lot ready
                </p>

                <p className="text-sm text-[var(--app-muted)]">
                  {items.length} unique{" "}
                  {items.length === 1 ? "product" : "products"} scanned
                </p>
              </div>

              <div className="rounded-2xl bg-cyan-400/10 px-4 py-2 font-black text-cyan-300">
                {items.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}{" "}
                units
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveLot}
              disabled={isSavingLot}
              className="w-full rounded-2xl bg-cyan-300 py-4 font-black text-slate-950 shadow-[0_0_25px_rgba(34,211,238,.2)] transition hover:bg-cyan-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingLot
                ? "Saving Lot..."
                : `Save Lot (${items.length} ${
                    items.length === 1 ? "product" : "products"
                  })`}
            </button>
          </section>
        )}
      </div>
    </PageShell>
  );
}