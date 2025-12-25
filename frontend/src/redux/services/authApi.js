import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => '/api/auth/me',
      providesTags: ['Auth'],
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/api/auth/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetCurrentUserQuery,
  useUpdateProfileMutation
} = authApi
