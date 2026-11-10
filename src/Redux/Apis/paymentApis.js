import { baseApi } from "../BaseUrl";

const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        creatTipps: builder.mutation({
            query: (data) => ({
                url: "/tip/create",
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['tipps', "profile"],
        }),
    })
})

export const { useCreatTippsMutation } = paymentApi