import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import {
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";

export function createBarcodeScanner() {
  const hints = new Map();

  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.QR_CODE,
  ]);

  hints.set(DecodeHintType.TRY_HARDER, true);

  return new BrowserMultiFormatReader(hints);
}

type StartScannerParams = {
  videoElement: HTMLVideoElement;
  onBarcodeDetected: (barcode: string) => Promise<void> | void;
  onError?: (error: unknown) => void;
};

export async function startBarcodeScanner({
  videoElement,
  onBarcodeDetected,
  onError,
}: StartScannerParams): Promise<IScannerControls> {
  const scanner = createBarcodeScanner();

  return scanner.decodeFromConstraints(
    {
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    },
    videoElement,
    async (result, error) => {
      if (error && !(error instanceof NotFoundException)) {
        onError?.(error);
      }

      if (!result) return;

      await onBarcodeDetected(result.getText());
    }
  );
}