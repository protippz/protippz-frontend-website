import React from 'react'
import {
  Trophy,
  Star,
  Medal,
  Crown as CrownIcon,
} from 'lucide-react'

export const getLevelIcon = (level: string) => {
  switch (level) {
    case 'Diamond':
      return <CrownIcon className="w-3 h-3" />
    case 'Platinum':
      return <Star className="w-3 h-3" />
    case 'Gold':
      return <Medal className="w-3 h-3" />
    case 'Silver':
      return <Trophy className="w-3 h-3" />
    default:
      return <Star className="w-3 h-3" />
  }
}

export const getEmbedVideoUrl = (videoInput?: string, videoEmbedCode?: string): string | null => {
  const target = videoEmbedCode || videoInput;
  if (!target) return null;

  // If raw iframe string was provided by admin (<iframe ... src="..."></iframe>)
  if (target.includes('<iframe')) {
    const srcMatch = target.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // If standard youtube watch URL was provided
  if (target.includes('youtube.com/watch?v=')) {
    const videoId = target.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // If short youtube URL (youtu.be/xxx)
  if (target.includes('youtu.be/')) {
    const videoId = target.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Otherwise assume target is already an embed URL
  return target;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  // 1. Try Clipboard API (HTTPS / modern browsers)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard.writeText failed, using fallback:", err);
    }
  }

  // 2. Fallback to hidden textarea + execCommand for HTTP / older browsers / mobile edge cases
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
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
};

export interface ShareOptions {
  slug?: string;
  postId?: string;
  title?: string;
  seoTitle?: string;
  summary?: string;
  metaDescription?: string;
  ogImage?: string;
  content?: string;
}

export const sharePostLink = async (options: ShareOptions): Promise<void> => {
  const postSlug = options.slug || options.postId || "";
  if (!postSlug) return;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/community/post/${encodeURIComponent(postSlug)}`
      : "";

  if (!shareUrl) return;

  // Attempt Web Share API first if supported
  if (typeof navigator !== "undefined" && navigator.share) {
    const shareData = {
      title: options.seoTitle || options.title || "ProTippz Post",
      text:
        options.metaDescription ||
        options.summary ||
        (options.content ? options.content.slice(0, 100) : "Check out this post on ProTippz!"),
      url: shareUrl,
    };

    try {
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (err) {
      const errorName = (err as Error)?.name;
      const errorMessage = (err as Error)?.message || "";
      if (
        errorName === "AbortError" ||
        errorMessage.toLowerCase().includes("cancel") ||
        errorMessage.toLowerCase().includes("abort")
      ) {
        return; // User cancelled share sheet
      }
      console.warn("navigator.share failed, falling back to clipboard:", err);
    }
  }

  // Fallback to Clipboard copy
  const copied = await copyToClipboard(shareUrl);
  if (copied) {
    const { toast } = await import("react-hot-toast");
    toast.success("Link copied to clipboard!");
  } else {
    const { toast } = await import("react-hot-toast");
    toast.error("Failed to copy link. Please copy manually.");
  }
};


