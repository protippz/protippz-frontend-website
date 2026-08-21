import { baseApi } from "../BaseUrl";

const commentApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (body) => {
        let formData;
        if (body instanceof FormData) {
          formData = body;
        } else {
          formData = new FormData();
          const commentData = body.data || {
            communityPost: body.communityPost,
            text: body.text,
            parent: body.parent || null,
            rootId: body.rootId || null,
          };
          formData.append(
            'data',
            typeof commentData === 'string' ? commentData : JSON.stringify(commentData)
          );
          if (body.image) {
            formData.append('image', body.image);
          }
        }
        return {
          url: `comment/create`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['comment', 'communityPost'],
    }),

    getCommentsByPost: builder.query({
      query: (arg) => {
        const postId = typeof arg === 'object' && arg.postId ? arg.postId : arg;
        const params = typeof arg === 'object' && arg.params ? arg.params : undefined;
        return {
          url: `comment/post/${postId}`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['comment'],
    }),

    getCommentReplies: builder.query({
      query: (arg) => {
        const commentId = typeof arg === 'object' && arg.commentId ? arg.commentId : arg;
        const params = typeof arg === 'object' && arg.params ? arg.params : undefined;
        return {
          url: `comment/replies/${commentId}`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['comment'],
    }),

    likeComment: builder.mutation({
      query: (id) => ({
        url: `comment/like/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['comment'],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({
        url: `comment/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['comment', 'communityPost'],
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
} = commentApis;
