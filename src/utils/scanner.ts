import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";

import {
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";

import { playScanFeedback } from "@/lib/scan-feedback";

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

async function getPreferredRearCameraId() {
  /*
   * Camera labels/device IDs are much more useful after
   * camera permission has been granted.
   */
  const permissionStream =
    await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: {
          ideal: "environment",
        },
      },
    });

  /*
   * We only needed this first stream to unlock/enumerate
   * the available cameras.
   */
  permissionStream.getTracks().forEach((track) => {
    track.stop();
  });

  const devices =
    await navigator.mediaDevices.enumerateDevices();

  const cameras = devices.filter(
    (device) => device.kind === "videoinput"
  );

  console.log(
    "Available cameras:",
    cameras.map((camera) => ({
      label: camera.label,
      deviceId: camera.deviceId,
    }))
  );

  /*
   * Try to avoid ultra-wide / telephoto cameras.
   *
   * Camera labels vary by browser/language, so this isn't
   * perfect, but it improves selection considerably.
   */
  const preferredCamera = cameras.find((camera) => {
    const label = camera.label.toLowerCase();

    const looksRear =
      label.includes("back") ||
      label.includes("rear") ||
      label.includes("environment");

    const looksUltraWide =
      label.includes("ultra") ||
      label.includes("0.5") ||
      label.includes("wide angle");

    const looksTelephoto =
      label.includes("telephoto") ||
      label.includes("tele");

    return (
      looksRear &&
      !looksUltraWide &&
      !looksTelephoto
    );
  });

  if (preferredCamera) {
    console.log(
      "Using preferred rear camera:",
      preferredCamera.label
    );

    return preferredCamera.deviceId;
  }

  /*
   * iOS historically exposes front camera first and a
   * normal rear camera shortly afterwards. If labels don't
   * help, prefer the second camera instead of blindly using
   * facingMode.
   */
  if (cameras.length >= 2) {
    console.log(
      "Using second available camera:",
      cameras[1].label
    );

    return cameras[1].deviceId;
  }

  return null;
}

export async function startBarcodeScanner({
  videoElement,
  onBarcodeDetected,
  onError,
}: StartScannerParams): Promise<IScannerControls> {
  const scanner = createBarcodeScanner();

  let deviceId: string | null = null;

  try {
    deviceId = await getPreferredRearCameraId();
  } catch (error) {
    console.warn(
      "Could not enumerate/select rear camera:",
      error
    );
  }

  const videoConstraints: MediaTrackConstraints =
    deviceId
      ? {
          deviceId: {
            exact: deviceId,
          },

          width: {
            ideal: 1280,
          },

          height: {
            ideal: 720,
          },
        }
      : {
          facingMode: {
            ideal: "environment",
          },

          width: {
            ideal: 1280,
          },

          height: {
            ideal: 720,
          },
        };

  return scanner.decodeFromConstraints(
    {
      audio: false,
      video: videoConstraints,
    },

    videoElement,

    async (result, error) => {
      if (
        error &&
        !(error instanceof NotFoundException)
      ) {
        onError?.(error);
      }

      if (!result) {
        return;
      }

      playScanFeedback();

      await onBarcodeDetected(
        result.getText()
      );
    }
  );
}