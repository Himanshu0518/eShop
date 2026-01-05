import type {
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
  OrderResponse,
  PaymentKeyResponse
} from '@/types/order.types';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/api-config';


export const orderApi = createApi({
  reducerPath: 'orderApi',

  tagTypes: ["Order"],

  baseQuery: fetchBaseQuery({
      baseUrl: `${API_BASE_URL}/orders`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),

  

    endpoints: (builder) => ({
    // ---------------- ORDERS ----------------
  

   createOrder: builder.mutation<CreateOrderResponse, CreateOrderPayload>({
  query: (body) => ({
    url: "/create-order",
    method: "POST",
    body,
  }),
  invalidatesTags: ["Order"],
}),

 // ---------------- VERIFY PAYMENT ----------------
    verifyPayment: builder.mutation<
      VerifyPaymentResponse,
      VerifyPaymentPayload
    >({
      query: (body) => ({
        url: '/verify-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

      getOrders: builder.query<OrderResponse, void>({
      query: () => '/getAll',
      providesTags: ["Order"]
    }),
    
    getKey: builder.query<PaymentKeyResponse, void>({
      query: () => '/getKey',    
    }),

  }),    
});


export const {
   useCreateOrderMutation,
   useVerifyPaymentMutation,
   useGetOrdersQuery,
   useGetKeyQuery
} = orderApi ;