import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, QueryParams } from "@/types/api";
import type { BackendCommentItem, MetaPagination } from "@/types/community";

export interface CreateCommentInput {
  communityPost?: string;
  text?: string;
  parent?: string | null;
  rootId?: string | null;
  image?: File | Blob | null;
  /** Pre-serialised payload; takes precedence over the individual fields. */
  data?: string | Record<string, unknown>;
}

export interface CommentsData {
  meta?: MetaPagination;
  result: BackendCommentItem[];
}

/** Accepts either a bare id or `{ id, params }`. */
type IdWithParams<K extends string> = string | ({ [P in K]: string } & { params?: QueryParams });

const resolveIdArg = <K extends string>(arg: IdWithParams<K>, key: K) =>
  typeof arg === "string"
    ? { id: arg, params: undefined }
    : { id: (arg as Record<K, string>)[key], params: arg.params };

const toCommentFormData = (body: CreateCommentInput | FormData): FormData => {
  if (body instanceof FormData) return body;
  const formData = new FormData();
  const payload = body.data ?? {
    communityPost: body.communityPost,
    text: body.text,
    parent: body.parent ?? null,
    rootId: body.rootId ?? null,
  };
  formData.append("data", typeof payload === "string" ? payload : JSON.stringify(payload));
  if (body.image) formData.append("image", body.image);
  return formData;
};

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<ApiResponse<BackendCommentItem>, CreateCommentInput | FormData>({
      query: (body) => ({ url: "/comment/create", method: "POST", body: toCommentFormData(body) }),
      invalidatesTags: ["Comment", { type: "CommunityPost", id: "LIST" }],
    }),
    getCommentsByPost: builder.query<ApiResponse<CommentsData>, IdWithParams<"postId">>({
      query: (arg) => {
        const { id, params } = resolveIdArg(arg, "postId");
        return { url: `/comment/post/${encodeURIComponent(id)}`, params };
      },
      providesTags: ["Comment"],
    }),
    getCommentReplies: builder.query<ApiResponse<CommentsData>, IdWithParams<"commentId">>({
      query: (arg) => {
        const { id, params } = resolveIdArg(arg, "commentId");
        return { url: `/comment/replies/${encodeURIComponent(id)}`, params };
      },
      providesTags: ["Comment"],
    }),
    likeComment: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/comment/like/${encodeURIComponent(id)}`, method: "POST" }),
      invalidatesTags: ["Comment"],
    }),
    deleteComment: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/comment/delete/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: ["Comment", { type: "CommunityPost", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsByPostQuery,
  useLazyGetCommentsByPostQuery,
  useGetCommentRepliesQuery,
  useLazyGetCommentRepliesQuery,
  useLikeCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
