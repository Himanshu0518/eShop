import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  Product,
  ProductListResponse,
  ProductDetailResponse,
  ProductViewResponse
} from '@/types/product.types';


export const productApi = createApi({
  reducerPath: 'productApi',

  tagTypes: ["Product", "ProductView"],

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

    // ---------------- PRODUCTS ----------------
    getProducts: builder.query<ProductListResponse, void>({
      query: () => '/products/getAll',
      providesTags: ["Product"]
    }),

    getProduct: builder.query<ProductDetailResponse, number>({
      query: (id) => `/products/get/${id}`,
      providesTags: (_, __, id) => [{ type: "Product", id }],
    }),

    // Get recommended products by product ID
    getRecommendedByProduct: builder.query<ProductListResponse, number>({
      query: (id) => `/products/getrecommendations/${id}`,
      providesTags: ["Product"]
    }),

    // ADMIN: Create product
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/products/add",
        method: "POST",
        body
      }),
      invalidatesTags: ["Product"]
    }),

    // ADMIN: Update product
    updateProduct: builder.mutation<Product, { id: number; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/products/update/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (_, __, { id }) => [
        "Product",
        { type: "Product", id }
      ],
    }),

    // Add product view
    addView: builder.mutation<ProductViewResponse, number>({
      query: (id) => ({
        url: `/products/addView/${id}`,
        method: "POST"
      }),
      invalidatesTags: ["ProductView"]
    }),

    // Get all views
    getViews: builder.query<ProductViewResponse, void>({
      query: () => "/products/getViews",
      providesTags: ["ProductView"]
    }),

    getRecommendationByquery: builder.query<ProductListResponse, string>({
      query: (query) => `/products/getrecommendations?query=${query}`,
      providesTags: ["Product"]
    }),
  
    getRecommendationByUser: builder.query<ProductListResponse, void>({
      query: () => `/products/getuserrecommendations`,
      providesTags: ["Product"]
    })
  }),
});


export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetRecommendedByProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useAddViewMutation,
  useGetViewsQuery,
  useGetRecommendationByqueryQuery,
  useGetRecommendationByUserQuery
} = productApi;