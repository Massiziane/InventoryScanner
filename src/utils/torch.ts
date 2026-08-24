let activeTorchTrack: MediaStreamTrack | null =
  null;

export function prepareTorch(
  videoElement: HTMLVideoElement
) {
  const stream =
    videoElement.srcObject as MediaStream | null;

  if (!stream) {
    console.log("Torch: no media stream");

    activeTorchTrack = null;

    return false;
  }

  const track =
    stream.getVideoTracks()[0] ?? null;

  if (!track) {
    console.log("Torch: no video track");

    activeTorchTrack = null;

    return false;
  }

  activeTorchTrack = track;

  const capabilities =
    track.getCapabilities?.() as
      | (MediaTrackCapabilities & {
          torch?: boolean;
        })
      | undefined;

  console.log(
    "Active camera:",
    track.label
  );

  console.log(
    "Camera capabilities:",
    capabilities
  );

  return Boolean(
    capabilities &&
      "torch" in capabilities &&
      capabilities.torch === true
  );
}

export async function setTorch(
  enabled: boolean
) {
  if (!activeTorchTrack) {
    throw new Error(
      "No active camera track"
    );
  }

  await activeTorchTrack.applyConstraints({
    advanced: [
      {
        torch: enabled,
      } as MediaTrackConstraintSet & {
        torch: boolean;
      },
    ],
  });
}

export function clearTorch() {
  activeTorchTrack = null;
}