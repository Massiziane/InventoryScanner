/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "barcode" TEXT;

-- AlterTable
ALTER TABLE "ScanLog" ADD COLUMN     "variantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_barcode_key" ON "ProductVariant"("barcode");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ScanLog_productId_idx" ON "ScanLog"("productId");

-- CreateIndex
CREATE INDEX "ScanLog_variantId_idx" ON "ScanLog"("variantId");

-- CreateIndex
CREATE INDEX "ScanLog_barcode_idx" ON "ScanLog"("barcode");

-- AddForeignKey
ALTER TABLE "ScanLog" ADD CONSTRAINT "ScanLog_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
