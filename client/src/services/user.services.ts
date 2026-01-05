import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/api-config';
import type {
  SignupPayload,
  LoginPayload,
  AuthResponse
} from '@/types/user.types';

export const userApi = createApi({
  reducerPath: 'userApi',

  tagTypes: ["User", "Product", "Cart", "Order"],

  baseQuery: fetchBaseQuery({
     baseUrl: API_BASE_URL,
    credentials: "include", // IMPORTANT for cookies
  }),

  endpoints: (builder) => ({

    // ---------------- SIGNUP ----------------
    signUp: builder.mutation<AuthResponse, SignupPayload>({
      query: (body) => ({
        url: '/users/signup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // ---------------- LOGIN ----------------
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
      // cookie is set automatically by browser → nothing to store manually
      invalidatesTags: ["User"],
    }),

    // ---------------- CURRENT USER ----------------
    currentUser: builder.query<AuthResponse, void>({
      query: () => '/users/current-user',
      providesTags: ["User"],
    }),

    // ---------------- LOGOUT ----------------
    logOut: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/users/logout',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Clear client cache because cookie removed
          dispatch(userApi.util.resetApiState());

        } catch (error) {
          console.error("Logout error:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useCurrentUserQuery,
  useLogOutMutation
} = userApi;
