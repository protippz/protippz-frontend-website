import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.protippz.com',
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
