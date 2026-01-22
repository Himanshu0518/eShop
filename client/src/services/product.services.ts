import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/api-config';

import type {
  Product,
  ProductListResponse,
  ProductDetailResponse,
  ProductViewResponse,
  WordEmbeddingResponse,
  BulkEmbeddingResponse
} from '@/types/product.types';


export const productApi = createApi({
  reducerPath: 'productApi',

  tagTypes: ["Product", "ProductView"],

  baseQuery: fetchBaseQuery({
      baseUrl: API_BASE_URL,
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
    }),
  

    //  now here our only admin routes will be there
    // ADMIN: Create product with FormData (multipart/form-data)
    createProduct: builder.mutation<Product, FormData>({
      query: (body) => ({
        url: "/products/add",
        method: "POST",
        body,
        formData: true,
      }),
      invalidatesTags: ["Product"]
    }),

    // ADMIN: Update product with FormData (multipart/form-data)
    updateProduct: builder.mutation<Product, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/products/update/${id}`,
        method: "PUT",
        body: data,
        formData: true,
      }),
      invalidatesTags: (_, __, { id }) => [
        "Product",
        { type: "Product", id }
      ],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/delete/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Product"]
    }),

    // this is optional if we have add manually some data to db then we can also add word embedding of that 
    addProductWordEmbedding: builder.mutation<WordEmbeddingResponse, number>({
      query: (productId) => ({
        url: '/products/addEmbedding',
        method: 'POST',
        body: {productId},
      }),

    }),
    // if we seeded too much data manually then we can run this to generate word-embedding for all products which embedding does not exist
    addbulkAddWordEmbeddings: builder.mutation<BulkEmbeddingResponse, void>({
      query: (body) => ({
        url: '/products/embeddings/bulk',
        method: 'POST',
        body,
      }),
    }),

  }),
});


export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetRecommendedByProductQuery,
  useAddViewMutation,
  useGetViewsQuery,
  useGetRecommendationByqueryQuery,
  useGetRecommendationByUserQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
