import type {
 //Favorite,
 FavoritePayload,
 FavoriteResponse
} from '@/types/favourite.types';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const favouriteApi = createApi({
  reducerPath: 'favouriteApi',

  tagTypes: ["Favorite"],

  baseQuery: fetchBaseQuery({
      baseUrl: "/api/favourites",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),

    endpoints: (builder) => ({
    // ---------------- CART ----------------
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