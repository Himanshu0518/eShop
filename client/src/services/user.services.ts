import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  SignupPayload,
  LoginPayload,
  AuthResponse
} from '@/types/user.types';
import type {
  Product,
  ProductListResponse,
  ProductDetailResponse
} from '@/types/product.types';
import type {
  AddToCartPayload,
  CartResponse
} from '@/types/cart.types';
import type {
  CreateOrderPayload,
  OrderResponse
} from '@/types/order.types';

export const userApi = createApi({
  reducerPath: 'userApi',

  tagTypes: ["User", "Product", "Cart", "Order"],

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

    // ---------------- AUTH ----------------
    signUp: builder.mutation<AuthResponse, SignupPayload>({
      query: (body) => ({
        url: '/users/signup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["User"]
    }),

    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["User"]
    }),

    currentUser: builder.query<AuthResponse, void>({
      query: () => '/users/current-user',
      providesTags: ["User"]
    }),

    // ---------------- PRODUCTS ----------------
    getProducts: builder.query<ProductListResponse, void>({
      query: () => '/products',
      providesTags: ["Product"]
    }),

    getProduct: builder.query<ProductDetailResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_, __, id) => [{ type: "Product", id }],
    }),

    // ADMIN: Create or update product
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body
      }),
      invalidatesTags: ["Product"]
    }),

    updateProduct: builder.mutation<Product, { id: number; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (_, __, { id }) => [
        "Product",
        { type: "Product", id }
      ],
    }),


    // ---------------- CART ----------------
    getCart: builder.query<CartResponse, void>({
      query: () => '/cart',
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
  useSignUpMutation,
  useLoginMutation,
  useCurrentUserQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useAddToCartMutation,
  useGetCartQuery,
  useCreateOrderMutation,
  useGetOrdersQuery,
} = userApi;
