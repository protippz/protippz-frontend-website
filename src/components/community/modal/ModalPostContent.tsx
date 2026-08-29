"use client";

import React from "react";
import Image from "next/image";
import { getEmbedVideoUrl } from "../helpers";

interface ModalPostContentProps {
  title?: string;
  summary?: string;
  content: string;
  tags?: string[];
  image?: string;
  videoUrl?: string;
  videoEmbedCode?: string;
}

export const ModalPostContent: React.FC<ModalPostContentProps> = ({
  title,
  summary,
  content,
  tags,
  image,
  videoUrl,
  videoEmbedCode,
}) => {
  const videoEmbedSrc = getEmbedVideoUrl(videoUrl, videoEmbedCode);

  return (
    <div className="space-y-4">
      {/* Text & Meta */}
      <div className="space-y-2">
        {title && (
          <h2 className="text-base sm:text-xl font-bold text-[#053697] leading-snug">
            {title}
          </h2>
        )}

        {summary && (
          <p className="text-xs sm:text-sm font-medium text-[#05369775] leading-relaxed">
            {summary}
          </p>
        )}

        <p className="text-xs sm:text-sm leading-relaxed text-[#05369790] whitespace-pre-line">
          {content}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-[#2FC191] hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Attachment */}
      {videoEmbedSrc ? (
        <div className="rounded-xl overflow-hidden bg-black aspect-video relative border border-border shadow-2xs">
          <iframe
            src={videoEmbedSrc}
            title={title || "Embedded Video"}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : image ? (
        <div className="rounded-xl overflow-hidden bg-black/5 border border-border">
          <Image
            src={image}
            alt="Post Attachment"
            width={700}
            height={400}
            className="w-full h-auto max-h-[280px] sm:max-h-[380px] object-cover rounded-xl"
          />
        </div>
      ) : null}
    </div>
  );
};
