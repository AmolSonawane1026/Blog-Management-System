import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  blogs: [],
  currentBlog: null,
  filteredBlogs: [],
  searchQuery: '',
  selectedCategory: 'All',
  loading: false,
  error: null,
}

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload
      state.filteredBlogs = action.payload
    },
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload
    },
    addBlog: (state, action) => {
      state.blogs.unshift(action.payload)
      state.filteredBlogs.unshift(action.payload)
    },
    updateBlog: (state, action) => {
      const index = state.blogs.findIndex(blog => blog._id === action.payload._id)
      if (index !== -1) {
        state.blogs[index] = action.payload
        state.filteredBlogs = state.blogs.filter(blog => 
          state.selectedCategory === 'All' || blog.category === state.selectedCategory
        )
      }
    },
    deleteBlog: (state, action) => {
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload)
      state.filteredBlogs = state.filteredBlogs.filter(blog => blog._id !== action.payload)
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      const query = action.payload.toLowerCase()
      state.filteredBlogs = state.blogs.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
      if (action.payload === 'All') {
        state.filteredBlogs = state.blogs
      } else {
        state.filteredBlogs = state.blogs.filter(blog => blog.category === action.payload)
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setBlogs,
  setCurrentBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  setSearchQuery,
  setSelectedCategory,
  setLoading,
  setError,
} = blogsSlice.actions

export default blogsSlice.reducer

export const selectAllBlogs = (state) => state.blogs.blogs
export const selectFilteredBlogs = (state) => state.blogs.filteredBlogs
export const selectCurrentBlog = (state) => state.blogs.currentBlog
export const selectSearchQuery = (state) => state.blogs.searchQuery
export const selectSelectedCategory = (state) => state.blogs.selectedCategory
