"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { mockPosts, mockUsers } from "@/components/community/data/mockData";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import FeedCard from "@/components/community/FeedCard";
import MediaSidebar from "@/components/community/MediaSidebar";
import PostModal from "@/components/community/PostModal";
import { Post, Comment, ContentCategory } from "@/types/community";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ContentCategory>("All");
  const [selectedPostForModal, setSelectedPostForModal] = useState<Post | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        post.content.toLowerCase().includes(q) ||
        post.user.name.toLowerCase().includes(q) ||
        (post.title && post.title.toLowerCase().includes(q)) ||
        (post.summary && post.summary.toLowerCase().includes(q)) ||
        (post.taggedPlayer && post.taggedPlayer.toLowerCase().includes(q)) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Handle Likes
  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedPost = {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
          if (selectedPostForModal?.id === postId) {
            setSelectedPostForModal(updatedPost);
          }
          return updatedPost;
        }
        return post;
      }),
    );
  };

  // Handle Add Comment or Reply inside Modal
  const handleAddComment = (
    postId: string,
    content: string,
    parentId?: string,
  ) => {
    const newCommentOrReply: Comment = {
      id: Date.now().toString(),
      user: mockUsers[0],
      content,
      timestamp: "Just now",
      likes: 0,
      parentId,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentComments = post.commentsList || [];
          let updatedComments: Comment[];

          if (parentId) {
            // Append as nested reply under target parent comment
            updatedComments = currentComments.map((cmt) => {
              if (cmt.id === parentId) {
                return {
                  ...cmt,
                  replies: [...(cmt.replies || []), newCommentOrReply],
                };
              }
              return cmt;
            });
          } else {
            // Append as top-level comment
            updatedComments = [newCommentOrReply, ...currentComments];
          }

          const updatedPost = {
            ...post,
            comments: post.comments + 1,
            commentsList: updatedComments,
          };

          if (selectedPostForModal?.id === postId) {
            setSelectedPostForModal(updatedPost);
          }

          return updatedPost;
        }
        return post;
      }),
    );
  };

  // Handle Comment Emoji Reaction
  const handleCommentReaction = (
    postId: string,
    commentId: string,
    emoji: string,
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedComments = (post.commentsList || []).map((cmt) => {
            if (cmt.id === commentId) {
              const currentReactions = cmt.reactions || [];
              const existingIdx = currentReactions.findIndex(
                (r) => r.emoji === emoji,
              );

              let newReactions = [...currentReactions];

              if (existingIdx >= 0) {
                const item = newReactions[existingIdx];
                if (item.isReacted) {
                  if (item.count <= 1) {
                    newReactions = newReactions.filter(
                      (_, idx) => idx !== existingIdx,
                    );
                  } else {
                    newReactions[existingIdx] = {
                      ...item,
                      count: item.count - 1,
                      isReacted: false,
                    };
                  }
                } else {
                  newReactions[existingIdx] = {
                    ...item,
                    count: item.count + 1,
                    isReacted: true,
                  };
                }
              } else {
                newReactions.push({
                  emoji,
                  count: 1,
                  isReacted: true,
                });
              }

              return {
                ...cmt,
                reactions: newReactions,
              };
            }
            return cmt;
          });

          const updatedPost = {
            ...post,
            commentsList: updatedComments,
          };

          if (selectedPostForModal?.id === postId) {
            setSelectedPostForModal(updatedPost);
          }

          return updatedPost;
        }
        return post;
      }),
    );
  };

  // Modal Handlers
  const handleOpenModal = (post: Post) => {
    setSelectedPostForModal(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPostForModal(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFB]">
      {/* Header Section */}
      <CommunityHeader />

      {/* Search & Category Filter Navigation Bar */}
      <CommunitySearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Layout */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onCommentClick={handleOpenModal}
                  />
                ))
              ) : (
                <div className="p-10 text-center rounded-2xl bg-white border border-[#233A6C1A] shadow-sm">
                  <p className="text-base font-bold text-[#233A6C]">
                    No content found
                  </p>
                  <p className="text-xs text-[#233A6C70] mt-1">
                    No articles, releases, or posts match your current search
                    &amp; category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-sm"
                    style={{ backgroundColor: "#308D6F" }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dedicated Media & Publishing Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1">
            <MediaSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Post Details & Discussion Modal */}
      <PostModal
        post={selectedPostForModal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLike={handleLike}
        onAddComment={handleAddComment}
        onCommentReaction={handleCommentReaction}
      />

      {/* Mobile Floating Scroll to Top Button */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl z-40 transition-transform active:scale-95"
        style={{ backgroundColor: "#308D6F" }}
        title="Scroll to Top"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
