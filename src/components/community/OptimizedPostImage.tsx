"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageOff, Maximize2, X } from "lucide-react";

interface OptimizedPostImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
  maxHeightClass?: string;
  aspectRatio?: string;
  enableLightbox?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  onClick?: (e: React.MouseEvent) => void;
}

// Generate inline SVG blur placeholder for instant initial rendering
const shimmerSvg = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f1f5f9" offset="20%" />
      <stop stop-color="#e2e8f0" offset="50%" />
      <stop stop-color="#f1f5f9" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f1f5f9" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const OptimizedPostImage: React.FC<OptimizedPostImageProps> = ({
  src,
  alt = "Community post media",
  width = 800,
  height = 450,
  className = "",
  containerClassName = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 750px",
  maxHeightClass = "max-h-[260px] sm:max-h-[440px]",
  aspectRatio,
  enableLightbox = true,
  objectFit = "contain",
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // If source is missing or invalid
  if (!src || hasError) {
    return (
      <div
        className={`w-full p-6 bg-slate-100/80 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center text-center gap-2 text-slate-400 min-h-[140px] ${containerClassName}`}
      >
        <ImageOff className="w-8 h-8 text-slate-300" />
        <span className="text-xs font-semibold text-slate-500">
          Image preview unavailable
        </span>
      </div>
    );
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else if (enableLightbox) {
      e.stopPropagation();
      setIsLightboxOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handleContainerClick}
        className={`relative w-full overflow-hidden bg-slate-100 rounded-xl group ${
          enableLightbox || onClick ? "cursor-pointer" : ""
        } ${containerClassName}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {/* Shimmer Skeleton Placeholder when loading */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse z-10 flex items-center justify-center">
            <div className="w-full h-full bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
          </div>
        )}

        {/* Next.js Optimized Image */}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmerSvg(width, height),
          )}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full ${
            objectFit === "cover"
              ? "h-full object-cover"
              : objectFit === "fill"
              ? "h-full object-fill"
              : "h-auto object-contain"
          } transition-all duration-500 ease-out ${maxHeightClass} ${
            isLoading ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
          } ${enableLightbox ? "group-hover:scale-[1.01]" : ""} ${className}`}
        />

        {/* Hover Lightbox Indicator Badge */}
        {enableLightbox && !isLoading && !hasError && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-xs text-white p-1.5 rounded-lg shadow-md pointer-events-none">
            <Maximize2 className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* High-Resolution Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Close fullscreen image preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1000}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OptimizedPostImage;
