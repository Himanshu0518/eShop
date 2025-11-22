import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  SignupPayload,
  LoginPayload,
  AuthResponse
} from '@/types/user.types';




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

   
  
  }),
});


export const {
  useSignUpMutation,
  useLoginMutation,
  useCurrentUserQuery,

} = userApi;
