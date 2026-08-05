"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { mockPosts, mockUsers } from "@/components/community/data/mockData";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import FeedCard from "@/components/community/FeedCard";
import PostModal from "@/components/community/PostModal";
import TipModal from "@/components/community/TipModal";
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
  const [selectedPostForTip, setSelectedPostForTip] = useState<Post | null>(
    null,
  );
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

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

  // Open Tip Modal
  const handleOpenTipModal = (postId: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    if (targetPost) {
      setSelectedPostForTip(targetPost);
      setIsTipModalOpen(true);
    }
  };

  // Handle Confirm Tip Amount
  const handleConfirmTip = (postId: string, amount: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedPost = {
            ...post,
            tips: post.tips + amount,
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

  // Handle Add Comment inside Modal
  const handleAddComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      user: mockUsers[0], // Current logged in user
      content,
      timestamp: "Just now",
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentComments = post.commentsList || [];
          const updatedPost = {
            ...post,
            comments: post.comments + 1,
            commentsList: [newComment, ...currentComments],
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
    <div className="min-h-screen" style={{ backgroundColor: "#F0F2F5" }}>
      {/* Header Section */}
      <CommunityHeader />

      {/* Search & Category Filter Navigation Bar */}
      <CommunitySearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <div className="container mx-auto px-2.5 sm:px-4 py-3 sm:py-6 bg-[#FAFBFB]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Feed Cards List */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onTip={handleOpenTipModal}
                    onCommentClick={handleOpenModal}
                  />
                ))
              ) : (
                <div className="p-10 text-center rounded-2xl bg-white border border-[#233A6C1A] shadow-sm">
                  <p className="text-base font-bold text-[#233A6C]">
                    No content found
                  </p>
                  <p className="text-xs text-[#233A6C70] mt-1">
                    No articles, releases, or posts match your current search &
                    category filter.
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
        </div>
      </div>

      {/* Facebook-style Post & Comment Modal */}
      <PostModal
        post={selectedPostForModal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLike={handleLike}
        onTip={handleOpenTipModal}
        onAddComment={handleAddComment}
        onCommentReaction={handleCommentReaction}
      />

      {/* Interactive Send Tip & Success Modal */}
      <TipModal
        post={selectedPostForTip}
        isOpen={isTipModalOpen}
        onClose={() => {
          setIsTipModalOpen(false);
          setSelectedPostForTip(null);
        }}
        onConfirmTip={handleConfirmTip}
      />

      {/* Mobile Quick Floating Post Button */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl z-40 transition-transform active:scale-95"
        style={{ backgroundColor: "#308D6F" }}
        title="Scroll to Create Post"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
