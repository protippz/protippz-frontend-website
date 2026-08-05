"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { mockPosts, mockUsers } from "@/components/community/data/mockData";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import FeedCard from "@/components/community/FeedCard";
import PostModal from "@/components/community/PostModal";
import TipModal from "@/components/community/TipModal";
import { Post, Comment } from "@/types/community";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostForModal, setSelectedPostForModal] = useState<Post | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostForTip, setSelectedPostForTip] = useState<Post | null>(
    null,
  );
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.taggedPlayer &&
          post.taggedPlayer.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [posts, searchQuery]);

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

      {/* Search Bar Component (Inline at top, Collapses to floating icon on scroll) */}
      <CommunitySearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6 bg-[#FAFBFB]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div className="p-8 text-center rounded-2xl bg-white border border-[#233A6C1A]">
                  <p className="text-sm font-semibold text-[#233A6C80]">
                    No posts found matching &quot;{searchQuery}&quot;
                  </p>
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
