import type {
 //Favorite,
 FavoritePayload,
 FavoriteResponse
} from '@/types/favourite.types';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/api-config';


export const favouriteApi = createApi({
  reducerPath: 'favouriteApi',

  tagTypes: ["Favorite"],

  baseQuery: fetchBaseQuery({
      baseUrl: `${API_BASE_URL}/favourites`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),

    endpoints: (builder) => ({
    // ---------------- FAVOURITES ----------------
  getFavorites: builder.query<FavoriteResponse, void>({
      query: () => '/getAll',
      providesTags: ["Favorite"]
    }),

    addToFavorite: builder.mutation<FavoriteResponse, FavoritePayload>({
      query: (body) => ({
        url: '/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Favorite"]
    }),

    removeFromFavorite: builder.mutation<null, number>({
      query: (favId) => ({
        url: `/remove/${favId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Favorite"]
    }),

    toggleFavourite: builder.mutation<FavoriteResponse, { productId: number }>({
        query: ({ productId }) => ({
          url: `/toggle/${productId}`,
          method: "PUT"
        }),

        // Optimistic update: flip the heart instantly, roll back if API fails
        async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            favouriteApi.util.updateQueryData('getFavorites', undefined, (draft) => {
              const index = draft.data.findIndex((f) => f.productId === productId);
              if (index !== -1) {
                // Already liked → remove it
                draft.data.splice(index, 1);
              } else {
                // Not liked → add a placeholder entry
                draft.data.push({
                  id: -1, // temporary id, will be replaced on next refetch
                  userId: -1,
                  productId,
                  createdAt: new Date().toISOString(),
                  product: {} as any,
                });
              }
            })
          );

          try {
            await queryFulfilled;
          } catch {
            // API failed → undo the optimistic change
            patchResult.undo();
          }
        },

        invalidatesTags: ["Favorite"]
      }),
    
    }),
});


export const {
  useAddToFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFromFavoriteMutation,
  useToggleFavouriteMutation
} = favouriteApi ;