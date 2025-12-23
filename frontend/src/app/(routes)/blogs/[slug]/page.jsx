'use client'

import Link from 'next/link'
import { BookOpen, Menu, X, Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { useState, use } from 'react'
import { useGetBlogBySlugQuery } from '@/redux/services/blogsApi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function BlogDetailPage({ params }) {
  const unwrappedParams = use(params)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data, isLoading, error } = useGetBlogBySlugQuery(unwrappedParams.slug)
  const blog = data?.blog

  const handleShare = (platform) => {
    const url = window.location.href
    const text = blog?.title || ''

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-white">
     

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Blogs
        </Link>

        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading blog...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-600 text-xl">Blog not found or error loading.</p>
            <Link href="/blogs" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              View all blogs
            </Link>
          </div>
        )}

        {blog && (
          <article className="bg-white">
            {/* Category Badge */}
            {blog.category && (
              <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {blog.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center text-gray-600 mb-8 space-x-6">
              <span className="flex items-center">
                <User size={18} className="mr-2" />
                {blog.author?.name || 'Admin'}
              </span>
              <span className="flex items-center">
                <Calendar size={18} className="mr-2" />
                {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
              </span>
            </div>

            {/* Featured Image */}
            {blog.image && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b">
              <span className="text-gray-600 font-medium">Share:</span>
              <button
                onClick={() => handleShare('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
                aria-label="Share on Facebook"
              >
                <Facebook size={20} />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg transition-all"
                aria-label="Share on Twitter"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg transition-all"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={20} />
              </button>
              <button
                onClick={copyLink}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-all"
                aria-label="Copy Link"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Blog Content */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 ModernBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
