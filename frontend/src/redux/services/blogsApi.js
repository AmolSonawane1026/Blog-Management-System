import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: (params) => ({
        url: '/blogs',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getMyBlogs: builder.query({
      query: (params) => ({
        url: '/blogs/me/all',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: '/blogs',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation({
      query: ({ id, ...blogData }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: blogData,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
    getCloudinaryImages: builder.query({
      query: (next_cursor) => ({
        url: '/blogs/images',
        params: { next_cursor },
      }),
    }),
    deleteCloudinaryImage: builder.mutation({
      query: (public_id) => ({
        url: `/blogs/images/${encodeURIComponent(public_id)}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetAllBlogsQuery,
  useGetMyBlogsQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetCloudinaryImagesQuery,
  useDeleteCloudinaryImageMutation,
} = blogsApi
