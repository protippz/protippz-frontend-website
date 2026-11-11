import { baseApi } from '../BaseUrl';
const withdrawApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        myWithdraws: builder.query({
            query: ({ page, limit }) => ({
                url: `/withdraw/my`,
                method: 'GET',
                params: { page, limit },
            })
        }),

    }),
});

export const {
    useMyWithdrawsQuery
} = withdrawApis;
