'use client'

import Link from 'next/link'
import { BookOpen, Menu, X, Search, Calendar, User, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllBlogsQuery } from '@/redux/services/blogsApi'
import { setBlogs, setSearchQuery, selectFilteredBlogs, selectSearchQuery } from '@/redux/features/blogs/blogsSlice'
import { format } from 'date-fns'

export default function BlogsPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  
  const dispatch = useDispatch()
  const { data, isLoading, error } = useGetAllBlogsQuery()
  const filteredBlogs = useSelector(selectFilteredBlogs)
  const searchQuery = useSelector(selectSearchQuery)

  useEffect(() => {
    if (data?.blogs) {
      dispatch(setBlogs(data.blogs))
    }
  }, [data, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setSearchQuery(searchInput))
  }

  const stripHtml = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
  }

  return (
    <div className="min-h-screen bg-white">
     
      

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center mb-6">Explore Our Blogs</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Discover insightful articles on technology, lifestyle, business, and more.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search blogs..."
                className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-600">Error loading blogs. Please try again later.</p>
            </div>
          )}

          {!isLoading && !error && filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No blogs found. Try a different search term.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article key={blog._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-100">
                {/* Image */}
                {blog.image && (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    {blog.category && (
                      <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {blog.category}
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center">
                      <User size={16} className="mr-1" />
                      {blog.author?.name || 'Admin'}
                    </span>
                  </div>

                  <Link href={`/blogs/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {stripHtml(blog.content)}
                  </p>

                  <Link 
                    href={`/blogs/${blog.slug}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Read More
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 ModernBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
