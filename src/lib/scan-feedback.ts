let scanAudio: HTMLAudioElement | null = null;

export function prepareScanFeedback() {
  if (typeof window === "undefined") return;

  scanAudio = new Audio("/sound/scan.mp3");
  scanAudio.volume = 0.6;
  scanAudio.preload = "auto";

  // Unlock audio on iPhone after user interaction
  scanAudio.play().then(() => {
    scanAudio?.pause();
    if (scanAudio) scanAudio.currentTime = 0;
  }).catch(() => {});
}

export function playScanFeedback() {
  if (typeof window === "undefined") return;

  navigator.vibrate?.(120);

  if (!scanAudio) {
    scanAudio = new Audio("/sound/scan.mp3");
    scanAudio.volume = 0.6;
  }

  scanAudio.currentTime = 0;
  scanAudio.play().catch(() => {});
  console.log("Playing scan sound");
}