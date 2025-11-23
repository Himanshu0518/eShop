import type {
  AddToCartPayload,
  CartResponse
} from '@/types/cart.types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CreateOrderPayload,
  OrderResponse
} from '@/types/order.types';

export const cartApi = createApi({
  reducerPath: 'cartApi',

  tagTypes: [ "Cart","Order"],

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_CLIENT_BASE_URL}/api`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),

    endpoints: (builder) => ({
    // ---------------- CART ----------------
  getCart: builder.query<CartResponse, void>({
      query: () => '/cart/getAll',
      providesTags: ["Cart"]
    }),

    addToCart: builder.mutation<CartResponse, AddToCartPayload>({
      query: (body) => ({
        url: '/cart/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Cart"]
    }),

    removeFromCart: builder.mutation<null, number>({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Cart"]
    }),

    updateQuantity: builder.mutation<CartResponse, { cartItemId: number; quantity: number }>({
        query: ({ cartItemId, quantity }) => ({
          url: `/cart/update_qty/${cartItemId}`,
          method: "PUT",
          body: { quantity }
        }),
        invalidatesTags: ["Cart"]
    }),

        // ---------------- ORDERS ----------------
        createOrder: builder.mutation<OrderResponse, CreateOrderPayload>({
          query: (body) => ({
            url: '/orders/create',
            method: 'POST',
            body,
          }),
          invalidatesTags: ["Order", "Cart"]
        }),
    
        getOrders: builder.query<OrderResponse[], void>({
          query: () => `/orders`,
          providesTags: ["Order"]
        }),
    
    }),
});


export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateQuantityMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
} = cartApi;