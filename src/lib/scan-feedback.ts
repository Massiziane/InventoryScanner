export function playScanFeedback() {
  if (typeof window === "undefined") return;

  navigator.vibrate?.(120);

  try {
    const audio = new Audio("/sounds/scan.mp3");
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch {}
}