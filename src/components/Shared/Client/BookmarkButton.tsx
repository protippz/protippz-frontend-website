"use client";

import React, { useState, useEffect } from "react";
import {
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
} from "@/redux/features/bookmark/bookmarkApi";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getAuthToken } from "@/lib/auth/token";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Star, Loader2 } from "lucide-react";

export interface BookmarkButtonProps {
  isBookmark: boolean;
  type: string; // "team" | "player"
  _id: string;
  className?: string;
  children?: React.ReactNode | ((bookmarked: boolean) => React.ReactNode);
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmark,
  type,
  _id,
  className,
  children,
  onBookmarkChange,
}) => {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState<boolean>(Boolean(isBookmark));
  const [loading, setLoading] = useState(false);
  const [createBookmark] = useCreateBookmarkMutation();
  const [deleteBookmark] = useDeleteBookmarkMutation();
  const bookmarkType = type === "team" ? "team" : "player";

  // Sync internal state when prop changes
  useEffect(() => {
    setBookmarked(Boolean(isBookmark));
  }, [isBookmark]);

  // Synchronize state across other cards or detail views that display the same entity
  useEffect(() => {
    const handleBookmarkUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{
        type: string;
        _id: string;
        action: "added" | "removed";
      }>;
      if (
        customEvent.detail &&
        customEvent.detail._id === _id &&
        customEvent.detail.type === type
      ) {
        const nextState = customEvent.detail.action === "added";
        setBookmarked(nextState);
        onBookmarkChange?.(nextState);
      }
    };

    window.addEventListener("bookmark-updated", handleBookmarkUpdated);
    return () => {
      window.removeEventListener("bookmark-updated", handleBookmarkUpdated);
    };
  }, [_id, type, onBookmarkChange]);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const token = getAuthToken();
    if (!token) {
      toast.error("Please sign in to save favorites");
      return;
    }

    if (loading) return;

    // Optimistic UI state update
    const previousState = bookmarked;
    const nextState = !previousState;

    setBookmarked(nextState);
    onBookmarkChange?.(nextState);
    setLoading(true);

    try {
      if (previousState) {
        // DELETE bookmark
        const res = await deleteBookmark({ type: bookmarkType, id: _id }).unwrap();

        setLoading(false);
        if (res?.success) {
          toast.success(res?.message || "Removed from favorites");
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("bookmark-updated", {
                detail: { type, _id, action: "removed" },
              })
            );
          }
          router.refresh();
        } else {
          // Rollback on failure
          setBookmarked(previousState);
          onBookmarkChange?.(previousState);
          toast.error(res?.message || "Failed to remove from favorites");
        }
      } else {
        // CREATE bookmark
        const data = type === "team" ? { teamId: _id } : { playerId: _id };
        const res = await createBookmark({ type: bookmarkType, body: data }).unwrap();

        setLoading(false);
        if (res?.success) {
          toast.success(res?.message || "Added to favorites");
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("bookmark-updated", {
                detail: { type, _id, action: "added" },
              })
            );
          }
          router.refresh();
        } else {
          // Rollback on failure
          setBookmarked(previousState);
          onBookmarkChange?.(previousState);
          toast.error(res?.message || "Failed to add to favorites");
        }
      }
    } catch (err) {
      setLoading(false);
      setBookmarked(previousState);
      onBookmarkChange?.(previousState);
      toast.error(
        getApiErrorMessage(
          err,
          previousState
            ? "Failed to remove from favorites"
            : "Failed to add to favorites",
        ),
      );
    }
  };

  // Determine what to render inside the button
  let renderedContent: React.ReactNode;

  if (typeof children === "function") {
    renderedContent = children(bookmarked);
  } else if (React.isValidElement(children)) {
    // If a static element was provided (e.g. <Star ...>), dynamically reflect bookmarked classes
    const childEl = children as React.ReactElement<any>;
    const origClass = childEl.props.className || "";

    const updatedClass = bookmarked
      ? origClass
          .replace("text-slate-600", "fill-amber-400 text-amber-400")
          .replace("text-white", "fill-amber-400 text-amber-400")
          .includes("fill-amber-400")
        ? origClass
        : `${origClass} fill-amber-400 text-amber-400`
      : origClass
          .replace("fill-amber-400 text-amber-400", "text-slate-600")
          .replace("fill-amber-400", "")
          .replace("text-amber-400", "text-slate-600")
          .trim();

    renderedContent = React.cloneElement(childEl, {
      className: updatedClass,
      "data-bookmarked": bookmarked ? "true" : "false",
    });
  } else if (children !== undefined) {
    renderedContent = children;
  } else {
    renderedContent = (
      <Star
        className={`w-3.5 h-3.5 transition-colors duration-200 ${
          bookmarked
            ? "fill-amber-400 text-amber-400"
            : "text-slate-600 hover:text-amber-500"
        }`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleBookmarkToggle}
      disabled={loading}
      aria-label={bookmarked ? "Remove from favorites" : "Add to favorites"}
      className={
        className ||
        "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer select-none transition-all active:scale-95"
      }
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
      ) : (
        renderedContent
      )}
    </button>
  );
};

export default BookmarkButton;
