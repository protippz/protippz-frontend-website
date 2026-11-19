export type DevicePlatform = "ios" | "android" | "web";

/** Best-effort platform detection sent to the backend at login / sign-up. */
export function getPlatform(): DevicePlatform {
  if (typeof navigator === "undefined") return "web";
  const ua = navigator.userAgent || "";
  // iPadOS 13+ reports itself as "Macintosh" but has touch support.
  const isIPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPad|iPhone|iPod/.test(ua) || isIPadOS) return "ios";
  if (/android/i.test(ua)) return "android";
  return "web";
}
