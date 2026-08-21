import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://57n8wl91-8000.inc1.devtunnels.ms',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (token) {
          headers.set('authorization', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['player', 'team', 'communityPost', 'comment', 'user'],
  endpoints: () => ({}),
});
