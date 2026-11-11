import { baseApi } from '../BaseUrl';
const tippzApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        myTipse: builder.query({
            query: ({ page, limit }) => ({
                url: `/tip/my-tips`,
                method: 'GET',
                params: { page, limit},
            })
        }),

    }),
});

export const {
    useMyTipseQuery
} = tippzApis;
