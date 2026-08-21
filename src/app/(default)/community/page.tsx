"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Plus, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import FeedCard from "@/components/community/FeedCard";
import MediaSidebar from "@/components/community/MediaSidebar";
import PostModal from "@/components/community/PostModal";
import {
  Post,
  Comment,
  ContentCategory,
  mapBackendItemToPost,
  CommunityPostApiResponse,
} from "@/types/community";
import {
  useGetAllCommunityPostsQuery,
  useLikeCommunityPostMutation,
} from "@/Redux/Apis/communityApis";

// Feed Skeleton Loader component for smooth loading experience
function FeedCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl bg-white border border-border animate-pulse space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gray-200" />
        <div className="h-3 w-28 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="h-3 w-5/6 bg-gray-200 rounded" />
      <div className="h-40 w-full bg-gray-200 rounded-xl" />
    </div>
  );
}

export default function CommunityPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [rawSearchQuery, setRawSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ContentCategory>("All");
  const [posts, setPosts] = useState<Post[]>([]);

  const [selectedPostForModal, setSelectedPostForModal] =
    useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const observerTargetRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(true);

  // RTK Query Mutation for Like
  const [likePostApi] = useLikeCommunityPostMutation();

  // Search Debounce Effect (with timer cleanup)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(rawSearchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [rawSearchQuery]);

  // Reset page and accumulated posts when search or category changes
  useEffect(() => {
    setPage(1);
    setPosts([]);
  }, [debouncedSearchQuery, selectedCategory]);

  // Query Params for API
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit,
    };
    if (selectedCategory && selectedCategory !== "All") {
      params.category = selectedCategory;
    }
    if (debouncedSearchQuery.trim()) {
      params.searchTerm = debouncedSearchQuery.trim();
    }
    return params;
  }, [page, limit, selectedCategory, debouncedSearchQuery]);

  // Fetch API query
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllCommunityPostsQuery(queryParams) as {
    data?: CommunityPostApiResponse;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
  };

  const meta = apiResponse?.data?.meta;
  const rawResults = apiResponse?.data?.result;
  const hasMorePages = Boolean(meta && page < meta.totalPage);

  // Sync API result into accumulated posts
  useEffect(() => {
    isMountedRef.current = true;
    if (rawResults && Array.isArray(rawResults)) {
      const transformedNewPosts = rawResults.map(mapBackendItemToPost);

      setPosts((prev) => {
        if (page === 1) {
          return transformedNewPosts;
        }
        // Deduplicate posts by ID
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = transformedNewPosts.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...uniqueNew];
      });
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [rawResults, page]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMorePages &&
          !isFetching &&
          !isLoading
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.2, rootMargin: "200px" }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMorePages, isFetching, isLoading]);

  // Category Handler with Memoization
  const handleSelectCategory = useCallback((category: ContentCategory) => {
    setSelectedCategory(category);
  }, []);

  // Search Handler with Memoization
  const handleSearchChange = useCallback((query: string) => {
    setRawSearchQuery(query);
  }, []);

  // Handle Like Optimistically and via API Mutation
  const handleLike = useCallback(
    async (postId: string) => {
      // Optimistic UI Update
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const updatedPost = {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked
                ? Math.max(0, post.likes - 1)
                : post.likes + 1,
            };
            if (selectedPostForModal?.id === postId) {
              setSelectedPostForModal(updatedPost);
            }
            return updatedPost;
          }
          return post;
        })
      );

      // Trigger API
      try {
        await likePostApi(postId).unwrap();
      } catch (err) {
        console.error("Failed to like post:", err);
      }
    },
    [likePostApi, selectedPostForModal]
  );

  // Comment Handlers inside Modal
  const handleAddComment = useCallback(
    (postId: string, content: string, parentId?: string) => {
      const newComment: Comment = {
        id: Date.now().toString(),
        user: {
          id: "curr_user",
          name: "You",
          avatar:
            "http://dsuotz3idqy4q.cloudfront.net/uploads/images/og_images/1787317787613-logo.bacbe230.png",
          level: "Gold",
          xp: 100,
          badges: [],
        },
        content,
        timestamp: "Just now",
        likes: 0,
        parentId,
      };

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const currentList = post.commentsList || [];
            let updatedList: Comment[];

            if (parentId) {
              updatedList = currentList.map((cmt) => {
                if (cmt.id === parentId) {
                  return {
                    ...cmt,
                    replies: [...(cmt.replies || []), newComment],
                  };
                }
                return cmt;
              });
            } else {
              updatedList = [newComment, ...currentList];
            }

            const updatedPost = {
              ...post,
              comments: post.comments + 1,
              commentsList: updatedList,
            };

            if (selectedPostForModal?.id === postId) {
              setSelectedPostForModal(updatedPost);
            }
            return updatedPost;
          }
          return post;
        })
      );
    },
    [selectedPostForModal]
  );

  // Comment Reaction Handler
  const handleCommentReaction = useCallback(
    (postId: string, commentId: string, emoji: string) => {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const updatedComments = (post.commentsList || []).map((cmt) => {
              if (cmt.id === commentId) {
                const currentReactions = cmt.reactions || [];
                const existingIdx = currentReactions.findIndex(
                  (r) => r.emoji === emoji
                );
                let newReactions = [...currentReactions];

                if (existingIdx >= 0) {
                  const item = newReactions[existingIdx];
                  if (item.isReacted) {
                    if (item.count <= 1) {
                      newReactions = newReactions.filter(
                        (_, idx) => idx !== existingIdx
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
                  newReactions.push({ emoji, count: 1, isReacted: true });
                }

                return { ...cmt, reactions: newReactions };
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
        })
      );
    },
    [selectedPostForModal]
  );

  // Modal Handlers
  const handleOpenModal = useCallback((post: Post) => {
    setSelectedPostForModal(post);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPostForModal(null);
  }, []);

  const handleResetFilters = useCallback(() => {
    setRawSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedCategory("All");
  }, []);

  return (
    <div className="min-h-screen pb-12">
      {/* Header Section */}
      <CommunityHeader />

      {/* Search & Category Filter Navigation Bar */}
      <CommunitySearchBar
        searchQuery={rawSearchQuery}
        setSearchQuery={handleSearchChange}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Content Layout */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Error State Banner */}
            {isError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between text-red-800 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Failed to load community posts. Please try again.</span>
                </div>
                <button
                  onClick={refetch}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {isLoading && page === 1 ? (
                <>
                  <FeedCardSkeleton />
                  <FeedCardSkeleton />
                  <FeedCardSkeleton />
                </>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onCommentClick={handleOpenModal}
                  />
                ))
              ) : !isLoading && !isFetching ? (
                <div className="p-10 text-center rounded-2xl bg-white border border-[#233A6C1A] shadow-sm">
                  <p className="text-base font-bold text-[#233A6C]">
                    No content found
                  </p>
                  <p className="text-xs text-[#233A6C70] mt-1">
                    No articles, releases, or posts match your current search
                    &amp; category filter.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-sm cursor-pointer"
                    style={{ backgroundColor: "#308D6F" }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : null}
            </div>

            {/* Infinite Scroll Loader & Sentinel Element */}
            <div
              ref={observerTargetRef}
              className="py-4 flex justify-center items-center min-h-[50px]"
            >
              {isFetching && page > 1 && (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#308D6F]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#308D6F]" />
                  <span>Loading more posts...</span>
                </div>
              )}
            </div>
          </div>

          {/* Dedicated Media & Publishing Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1">
            <MediaSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={handleSelectCategory}
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
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl z-40 transition-transform active:scale-95 cursor-pointer"
        style={{ backgroundColor: "#308D6F" }}
        title="Scroll to Top"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
