"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/provider/ContextProvider";
import { Plus, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
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
  useLazyGetSingleCommunityPostQuery,
} from "@/Redux/Apis/communityApis";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from "@/Redux/Apis/commentApis";

// Feed Skeleton Loader component
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
  const router = useRouter();
  const { userData } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [rawSearchQuery, setRawSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ContentCategory>("All");
  const [posts, setPosts] = useState<Post[]>([]);

  const [selectedPostForModal, setSelectedPostForModal] = useState<Post | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  // RTK Query API Mutations
  const [likePostApi] = useLikeCommunityPostMutation();
  const [createCommentApi, { isLoading: isPostingComment }] =
    useCreateCommentMutation();
  const [deleteCommentApi, { isLoading: isDeleting }] =
    useDeleteCommentMutation();
  const [likeCommentApi, { isLoading: isLiking }] = useLikeCommentMutation();

  // Search Debounce Effect
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
    error,
    refetch,
  } = useGetAllCommunityPostsQuery(queryParams) as {
    data?: CommunityPostApiResponse;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: any;
    refetch: () => void;
  };
  console.log(error);
  const meta = apiResponse?.data?.meta;
  const rawResults = apiResponse?.data?.result;
  const hasMorePages = Boolean(meta && page < meta.totalPage);

  // Sync API result into accumulated posts
  useEffect(() => {
    if (rawResults && Array.isArray(rawResults)) {
      const transformedNewPosts = rawResults.map(mapBackendItemToPost);

      setPosts((prev) => {
        if (page === 1) {
          return transformedNewPosts;
        }
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = transformedNewPosts.filter(
          (p) => !existingIds.has(p.id),
        );
        return [...prev, ...uniqueNew];
      });
    }
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
      { threshold: 0.2, rootMargin: "200px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMorePages, isFetching, isLoading]);

  // Handlers
  const handleSelectCategory = useCallback((category: ContentCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setRawSearchQuery(query);
  }, []);

  // Post Like Handler (Optimistic + Background API + Rollback)
  const handleLikePost = useCallback(
    async (postId: string) => {
      if (!userData?._id) {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.pathname + window.location.search;
          router.push(`/sign-in?redirect=${encodeURIComponent(currentUrl)}`);
        }
        return;
      }

      // 1. Instantly update UI
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
        }),
      );

      // 2. Perform API Mutation in background
      try {
        await likePostApi(postId).unwrap();
      } catch (err) {
        console.error("Failed to like post API:", err);
        toast.error("Failed to update post like");

        // 3. Rollback on API Failure
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              const revertedPost = {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked
                  ? Math.max(0, post.likes - 1)
                  : post.likes + 1,
              };
              if (selectedPostForModal?.id === postId) {
                setSelectedPostForModal(revertedPost);
              }
              return revertedPost;
            }
            return post;
          }),
        );
      }
    },
    [likePostApi, selectedPostForModal, userData?._id, router],
  );

  // Optimistic Add Comment with Background Sync & Rollback
  const handleAddComment = useCallback(
    async (
      postId: string,
      content: string,
      parentId?: string,
      imageFile?: File,
    ) => {
      const tempCommentId = "temp_" + Date.now();

      const newComment: Comment = {
        id: tempCommentId,
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
        isLiked: false,
        parentId,
      };

      // 1. Immediately update UI (Optimistic response)
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const currentList = p.commentsList || [];
            let updatedList: Comment[];

            if (parentId) {
              updatedList = currentList.map((c) =>
                c.id === parentId
                  ? { ...c, replies: [...(c.replies || []), newComment] }
                  : c,
              );
            } else {
              updatedList = [newComment, ...currentList];
            }

            const updatedPost = {
              ...p,
              comments: (p.comments || 0) + 1,
              commentsList: updatedList,
            };

            if (selectedPostForModal?.id === postId) {
              setSelectedPostForModal(updatedPost);
            }

            return updatedPost;
          }
          return p;
        }),
      );

      // 2. Perform API Mutation in background
      try {
        const formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            communityPost: postId,
            text: content,
            parent: parentId || null,
            rootId: null,
          }),
        );
        if (imageFile) {
          formData.append("image", imageFile);
        }

        const res = await createCommentApi(formData).unwrap();
        const realId =
          res?.data?._id ||
          res?.data?.result?._id ||
          res?.result?._id ||
          res?._id;

        // Replace tempCommentId with realId in state on success
        if (realId) {
          setPosts((prev) =>
            prev.map((p) => {
              if (p.id === postId) {
                const replaceIdInList = (list: Comment[]): Comment[] =>
                  list.map((c) => {
                    if (c.id === tempCommentId) return { ...c, id: realId };
                    if (c.replies)
                      return { ...c, replies: replaceIdInList(c.replies) };
                    return c;
                  });

                const updatedPost = {
                  ...p,
                  commentsList: replaceIdInList(p.commentsList || []),
                };

                if (selectedPostForModal?.id === postId) {
                  setSelectedPostForModal(updatedPost);
                }

                return updatedPost;
              }
              return p;
            }),
          );
        }
      } catch (err) {
        console.error("Failed to post comment API:", err);
        toast.error("Failed to post comment. Reverting...");

        // 3. Rollback on API failure (remove tempCommentId)
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              const removeIdFromList = (list: Comment[]): Comment[] =>
                list
                  .filter((c) => c.id !== tempCommentId)
                  .map((c) => ({
                    ...c,
                    replies: c.replies
                      ? removeIdFromList(c.replies)
                      : undefined,
                  }));

              const updatedPost = {
                ...p,
                comments: Math.max(0, (p.comments || 1) - 1),
                commentsList: removeIdFromList(p.commentsList || []),
              };

              if (selectedPostForModal?.id === postId) {
                setSelectedPostForModal(updatedPost);
              }

              return updatedPost;
            }
            return p;
          }),
        );
      }
    },
    [createCommentApi, selectedPostForModal],
  );

  // Optimistic Delete Comment with Background Sync & Rollback
  const handleDeleteComment = useCallback(
    async (postId: string, commentId: string) => {
      let deletedBackup: Comment | null = null;
      let parentCommentId: string | undefined = undefined;

      // 1. Immediately update UI & backup item
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const currentList = p.commentsList || [];

            // Find item to backup
            const topMatch = currentList.find((c) => c.id === commentId);
            if (topMatch) {
              deletedBackup = topMatch;
            } else {
              currentList.forEach((c) => {
                const replyMatch = c.replies?.find((r) => r.id === commentId);
                if (replyMatch) {
                  deletedBackup = replyMatch;
                  parentCommentId = c.id;
                }
              });
            }

            const removeFromList = (list: Comment[]): Comment[] =>
              list
                .filter((c) => c.id !== commentId)
                .map((c) => ({
                  ...c,
                  replies: c.replies ? removeFromList(c.replies) : undefined,
                }));

            const updatedPost = {
              ...p,
              comments: Math.max(0, (p.comments || 1) - 1),
              commentsList: removeFromList(currentList),
            };

            if (selectedPostForModal?.id === postId) {
              setSelectedPostForModal(updatedPost);
            }

            return updatedPost;
          }
          return p;
        }),
      );

      // 2. Perform API Mutation in background
      try {
        await deleteCommentApi(commentId).unwrap();
      } catch (err) {
        // 3. Rollback on API failure (restore deleted item)
        if (deletedBackup) {
          const restoredItem = deletedBackup;
          setPosts((prev) =>
            prev.map((p) => {
              if (p.id === postId) {
                const currentList = p.commentsList || [];
                let restoredList: Comment[];

                if (parentCommentId) {
                  restoredList = currentList.map((c) =>
                    c.id === parentCommentId
                      ? { ...c, replies: [...(c.replies || []), restoredItem] }
                      : c,
                  );
                } else {
                  restoredList = [restoredItem, ...currentList];
                }

                const updatedPost = {
                  ...p,
                  comments: (p.comments || 0) + 1,
                  commentsList: restoredList,
                };

                if (selectedPostForModal?.id === postId) {
                  setSelectedPostForModal(updatedPost);
                }

                return updatedPost;
              }
              return p;
            }),
          );
        }
      }
    },
    [deleteCommentApi, selectedPostForModal],
  );

  // Like Comment Handler (Mutation + Re-throw for modal rollback)
  const handleLikeComment = useCallback(
    async (postId: string, commentId: string) => {
      try {
        await likeCommentApi(commentId).unwrap();
      } catch (err) {
        console.error("Failed to like comment API:", err);
        toast.error("Failed to update comment like");
        throw err;
      }
    },
    [likeCommentApi],
  );

  const [triggerGetSinglePost] = useLazyGetSingleCommunityPostQuery();
  const [hasDeepLinkChecked, setHasDeepLinkChecked] = useState(false);

  // Check for direct deep-link ?post=slug query param on load
  useEffect(() => {
    if (typeof window === "undefined" || hasDeepLinkChecked) return;

    const searchParams = new URLSearchParams(window.location.search);
    const postParam = searchParams.get("post");

    if (postParam) {
      setHasDeepLinkChecked(true);
      const existing = posts.find(
        (p) => p.slug === postParam || p.id === postParam,
      );

      if (existing) {
        setSelectedPostForModal(existing);
        setIsModalOpen(true);
      } else {
        triggerGetSinglePost(postParam)
          .unwrap()
          .then((res) => {
            const raw = res?.data?.result || res?.data || res?.result;
            if (raw) {
              const mapped = mapBackendItemToPost(raw);
              setSelectedPostForModal(mapped);
              setIsModalOpen(true);
            }
          })
          .catch((err) => {
            console.error("Failed to load post by slug:", err);
          });
      }
    }
  }, [posts, triggerGetSinglePost, hasDeepLinkChecked]);

  // Modal Handlers with URL Sync
  const handleOpenModal = useCallback((post: Post) => {
    setSelectedPostForModal(post);
    setIsModalOpen(true);

    if (typeof window !== "undefined") {
      const postSlug = post.slug || post.id;
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("post", postSlug);
      window.history.pushState({ postSlug }, "", currentUrl.toString());
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPostForModal(null);

    if (typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("post");
      window.history.pushState({}, "", currentUrl.toString());
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setRawSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedCategory("All");
  }, []);

  return (
    <div className="min-h-screen pb-12 px-2">
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
      <div className="max-w-355 mx-auto px-3 sm:px-4 py-4 sm:py-6">
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
                    onLike={handleLikePost}
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

          {/* Dedicated Media & Publishing Sidebar */}
          <div className="w-full lg:col-span-1">
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
        onLike={handleLikePost}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleLikeComment}
        isPostingComment={isPostingComment}
      />
    </div>
  );
}
