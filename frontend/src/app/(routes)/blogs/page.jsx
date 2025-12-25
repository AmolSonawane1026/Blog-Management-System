'use client'

import Link from 'next/link'
import { Search, Calendar, User, ArrowRight, Sparkles, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllBlogsQuery } from '@/redux/services/blogsApi'
import { setBlogs, setSearchQuery, selectFilteredBlogs, selectSearchQuery } from '@/redux/features/blogs/blogsSlice'
import { format } from 'date-fns'
import { BLOG_CATEGORIES } from '@/lib/constants'

export default function BlogsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const dispatch = useDispatch()
  const { data, isLoading, error } = useGetAllBlogsQuery()
  const filteredBlogs = useSelector(selectFilteredBlogs)

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
    return html.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/50 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-100/50 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm">
              <Sparkles size={14} className="text-indigo-600" />
              <span>Knowledge Hub</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              Our <span className="gradient-text">Latest Stories</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Dive into our curated collection of insights, tutorials, and success stories from the tech world.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles, topics, or authors..."
                className="w-full px-8 py-5 pr-14 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-xl outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-xl transition-all shadow-lg"
              >
                <Search size={22} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="sticky top-20 z-40 bg-[#f8fafc]/80 backdrop-blur-md border-y border-slate-200/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex-shrink-0 flex items-center gap-2 text-slate-400 font-bold px-4 border-r border-slate-200 mr-2 uppercase text-xs tracking-widest">
              <Filter size={14} />
              <span>Filter</span>
            </div>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`flex-shrink-0 px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-xl'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              All Articles
            </button>
            {BLOG_CATEGORIES.filter(cat => cat !== 'Other').map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent shadow-sm"></div>
              <p className="mt-4 text-slate-500 font-bold">Summoning the stories...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20 bg-rose-50 rounded-3xl border border-rose-100">
              <div className="text-rose-600 font-black text-xl mb-2">Oops! Something went wrong</div>
              <p className="text-rose-500">We couldn't load the blogs. Please try again later.</p>
            </div>
          )}

          {!isLoading && !error && filteredBlogs.length === 0 && (
            <div className="text-center py-32">
              <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-900 text-2xl font-black mb-2">No matches found</p>
              <p className="text-slate-500 font-medium italic">Try checking your spelling or use more general terms.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs
              .filter(blog => selectedCategory === 'All' || blog.category === selectedCategory)
              .map((blog) => (
                <article key={blog._id} className="premium-card group overflow-hidden flex flex-col h-[460px] bg-white shadow-xl rounded-2xl">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                    <img
                      src={blog.image || '/images/placeholder.jpg'}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {blog.category && (
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg z-30 ring-1 ring-slate-900/5">
                        {blog.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-indigo-500" />
                        {format(new Date(blog.createdAt), 'MMM dd')}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="flex items-center gap-1.5">
                        <User size={12} className="text-indigo-500" />
                        {blog.author?.name?.split(' ')[0] || 'By Team'}
                      </span>
                    </div>

                    <Link href={`/blogs/${blog.slug}`}>
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>

                    <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-3 leading-relaxed">
                      {stripHtml(blog.content)}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-1.5 text-indigo-600 text-[10px] font-black hover:gap-3 transition-all group/link uppercase tracking-wider"
                      >
                        <span>Read More</span>
                        <ArrowRight size={14} />
                      </Link>
                      <div className="flex items-center -space-x-1.5">
                        {[1, 2].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400 shadow-sm">
                            {i}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
