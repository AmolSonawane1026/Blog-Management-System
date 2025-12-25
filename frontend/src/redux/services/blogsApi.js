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
        url: '/api/blogs',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getMyBlogs: builder.query({
      query: (params) => ({
        url: '/api/blogs/me/all',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `/api/blogs/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: '/api/blogs',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation({
      query: ({ id, ...blogData }) => ({
        url: `/api/blogs/${id}`,
        method: 'PUT',
        body: blogData,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
    getCloudinaryImages: builder.query({
      query: (next_cursor) => ({
        url: '/api/blogs/images',
        params: { next_cursor },
      }),
    }),
    deleteCloudinaryImage: builder.mutation({
      query: (public_id) => ({
        url: `/api/blogs/images/${encodeURIComponent(public_id)}`,
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
