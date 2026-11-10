import { baseApi } from '../BaseUrl';
const profileApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    myProfile: builder.query({
      query: () => ({
        url: `/user/get-my-profile`,
        method: 'GET',
      }),
      providesTags: ['profile'],
    }),

  }),
});

export const {
  useMyProfileQuery
} = profileApis;
