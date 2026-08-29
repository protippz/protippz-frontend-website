"use client";

import React from "react";
import { X, Send, Users, Smile, CornerDownRight, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import EmojiPicker from "../EmojiPicker";
import { User } from "@/types/community";

interface CommentFormFooterProps {
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  selectedImage: File | null;
  imagePreview: string | null;
  replyingTo: { id: string; userName: string } | null;
  setReplyingTo: React.Dispatch<
    React.SetStateAction<{ id: string; userName: string } | null>
  >;
  isEmojiPickerOpen: boolean;
  setIsEmojiPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  currentUser: User;
  isPostingComment?: boolean;
}

export const CommentFormFooter: React.FC<CommentFormFooterProps> = ({
  commentText,
  setCommentText,
  selectedImage,
  imagePreview,
  replyingTo,
  setReplyingTo,
  isEmojiPickerOpen,
  setIsEmojiPickerOpen,
  onImageSelect,
  onRemoveImage,
  onSubmit,
  inputRef,
  fileInputRef,
  currentUser,
  isPostingComment,
}) => {
  const handleInsertEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative border-t bg-white shrink-0">
      {/* Replying Banner */}
      {replyingTo && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#2FC19112] border-b border-[#2FC19125] text-xs">
          <span className="text-[#2FC191] font-semibold flex items-center gap-1.5">
            <CornerDownRight className="w-3.5 h-3.5" />
            Replying to <span className="font-bold">@{replyingTo.userName}</span>
          </span>
          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            className="p-0.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image Thumbnail Preview */}
      {imagePreview && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Image
              src={imagePreview}
              alt="Attachment Preview"
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded-lg border border-gray-200"
            />
            <span className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
              {selectedImage?.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onRemoveImage}
            className="p-1 text-gray-400 hover:text-red-600 rounded-full cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      <EmojiPicker
        isOpen={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onSelectEmoji={handleInsertEmoji}
        align="right"
      />

      <form
        onSubmit={onSubmit}
        className="p-3 sm:p-4 pb-safe flex items-center gap-2 sm:gap-3"
      >
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>
            <Users className="w-4 h-4 text-[#05369760]" />
          </AvatarFallback>
        </Avatar>

        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder={
              replyingTo
                ? `Reply to @${replyingTo.userName}...`
                : "Write a comment..."
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full pl-3 pr-16 py-2 text-xs sm:text-sm rounded-xl outline-none border transition-colors focus:border-[#2FC191]"
            style={{
              backgroundColor: "#F0F2F5",
              borderColor: "#05369715",
              color: "#053697",
            }}
          />

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Image & Emoji Buttons */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1 text-gray-400 hover:text-[#2FC191] transition-colors cursor-pointer"
              title="Attach an image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                isEmojiPickerOpen
                  ? "text-[#2FC191]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Choose an emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={(!commentText.trim() && !selectedImage) || isPostingComment}
          className="p-2 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5 cursor-pointer"
          style={{ backgroundColor: "#2FC191" }}
        >
          {isPostingComment ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {isPostingComment ? "Posting..." : "Post"}
          </span>
        </button>
      </form>
    </div>
  );
};
