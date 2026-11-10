import { baseApi } from '../BaseUrl';
const redeemApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        redeemRequeste: builder.mutation({
            query: (data) => ({
                url: `/redeem-request/create`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['profile'],
        }),

    }),
});

export const {
    useRedeemRequesteMutation
} = redeemApis;
