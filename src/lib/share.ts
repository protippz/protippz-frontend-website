import toast from "react-hot-toast";

export interface ShareOptions {
  title?: string;
  text?: string;
  url: string;
  fallbackSuccessMessage?: string;
}

/**
 * Robust cross-browser clipboard copy with fallback to document.execCommand
 * Works across Linux, macOS, Windows, Android, and iOS even in non-secure or restricted webview contexts.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  // 1. Modern Clipboard API
  if (navigator?.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard.writeText failed, falling back:", err);
    }
  }

  // 2. Fallback for older browsers, Linux environments, or contexts where clipboard API is blocked
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback copy to clipboard failed:", err);
    return false;
  }
};

/**
 * Universal cross-platform share helper.
 *
 * Designed to work seamlessly across:
 * - Mobile: Android & iOS (triggers native OS share sheet via Web Share API)
 * - Desktop: macOS, Windows, and Linux
 *   - Uses Web Share API (navigator.share / window.share) when supported (e.g. macOS Safari, Windows Edge/Chrome).
 *   - Falls back gracefully to clipboard copy with toast feedback on Linux and browsers without native share support (e.g. Firefox).
 *   - Handles user cancellation (AbortError) silently without showing errors.
 */
export const shareUrl = async ({
  title,
  text,
  url,
  fallbackSuccessMessage = "Link copied to clipboard!",
}: ShareOptions): Promise<void> => {
  if (typeof window === "undefined") return;

  const resolvedUrl = url || window.location.href;
  const shareData: ShareData = {
    title: title || (typeof document !== "undefined" ? document.title : "ProTippz"),
    text: text || title || "",
    url: resolvedUrl,
  };

  // Check for Web Share API (navigator.share, window.navigator.share, or custom window.share)
  const nav = typeof navigator !== "undefined" ? navigator : null;
  const win = typeof window !== "undefined" ? (window as any) : null;
  const shareFn =
    nav && typeof nav.share === "function"
      ? nav.share.bind(nav)
      : win && typeof win.share === "function"
      ? win.share.bind(win)
      : null;

  if (shareFn) {
    try {
      // Validate with canShare if available
      if (!nav?.canShare || nav.canShare(shareData)) {
        await shareFn(shareData);
        return;
      }
    } catch (err: any) {
      const errorName = err?.name;
      const errorMessage = (err?.message || "").toLowerCase();

      // User dismissed/cancelled the native share sheet - do not treat as an error
      if (
        errorName === "AbortError" ||
        errorMessage.includes("abort") ||
        errorMessage.includes("cancel") ||
        errorMessage.includes("dismissed")
      ) {
        return;
      }

      console.warn("Native Web Share failed, falling back to clipboard copy:", err);
    }
  }

  // Cross-device fallback (Desktop Linux, Windows Firefox, macOS Firefox, or restricted webviews)
  const copied = await copyToClipboard(resolvedUrl);
  if (copied) {
    toast.success(fallbackSuccessMessage);
  } else {
    toast.error("Unable to copy link to clipboard. Please copy manually.");
  }
};
