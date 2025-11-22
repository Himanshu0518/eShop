import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  Product,
  ProductListResponse,
  ProductDetailResponse
} from '@/types/product.types';


export const productApi = createApi({
  reducerPath: 'productApi',

  tagTypes: [ "Product"],

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

    // ADMIN: Create or update product
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/products/add",
        method: "POST",
        body
      }),
      invalidatesTags: ["Product"]
    }),

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

  }),
});


export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation
} = productApi;
