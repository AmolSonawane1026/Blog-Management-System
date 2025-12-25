'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGetAllBlogsQuery, useUpdateBlogMutation } from '@/redux/services/blogsApi'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '@/redux/features/auth/authSlice'
import { BLOG_CATEGORIES } from '@/lib/constants'
import TiptapEditor from '@/components/TiptapEditor'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Image as ImageIcon, Upload, Loader2, X } from 'lucide-react'
import Link from 'next/link'

export default function EditBlogPage({ params }) {
  const router = useRouter()
  const token = useSelector(selectCurrentToken)
  const { data, isLoading: loadingBlogs } = useGetAllBlogsQuery()
  const [updateBlog, { isLoading }] = useUpdateBlogMutation()
  const featuredImageInputRef = useRef(null)
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    image: '',
    status: 'published'
  })

  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    if (data?.blogs) {
      const blog = data.blogs.find(b => b._id === params.id)
      if (blog) {
        setFormData({
          title: blog.title || '',
          slug: blog.slug || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          category: blog.category || '',
          tags: blog.tags ? blog.tags.join(', ') : '',
          image: blog.image || '',
          status: blog.status || 'published'
        })
        setIsDataLoaded(true)
      }
    }
  }, [data, params.id])

  // Upload Featured Image to Cloudinary
  const uploadFeaturedImage = async (file) => {
    if (!file) return

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed')
      return
    }

    setUploadingFeaturedImage(true)
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      })

      const data = await response.json()

      if (data.success) {
        setFormData({ ...formData, image: data.url })
        toast.success('Featured image uploaded successfully!')
      } else {
        toast.error(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingFeaturedImage(false)
    }
  }

  const handleFeaturedImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFeaturedImage(file)
    }
  }

  const removeFeaturedImage = () => {
    setFormData({ ...formData, image: '' })
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required')
      return
    }

    const blogData = {
      id: params.id,
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    }

    try {
      await updateBlog(blogData).unwrap()
      toast.success('Blog updated successfully!')
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Update error:', error)
      toast.error(error?.data?.message || 'Failed to update blog')
    }
  }

  if (loadingBlogs || !isDataLoaded) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading blog...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Blogs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Blog</h1>
        <p className="text-gray-600">Update your blog post</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-semibold"
                placeholder="Enter your blog title"
                required
              />
            </div>

            {/* Slug */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your-blog-url-slug"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                URL: /blogs/{formData.slug || 'your-slug'}
              </p>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Content *
              </label>
              <TiptapEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Short description of your blog"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Update</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading || uploadingFeaturedImage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>{isLoading ? 'Updating...' : 'Update Blog'}</span>
              </button>
            </div>

            {/* Featured Image with Upload */}
            <div className="bg-white rounded-xl shadow-md p-6 relative">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon size={18} className="mr-2" />
                Featured Image
              </h3>

              {/* Hidden File Input */}
              <input
                ref={featuredImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageSelect}
                className="hidden"
              />

              {/* Upload Button or Image Preview */}
              {!formData.image ? (
                <div>
                  <button
                    type="button"
                    onClick={() => featuredImageInputRef.current?.click()}
                    disabled={uploadingFeaturedImage}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingFeaturedImage ? (
                      <>
                        <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <span className="text-sm text-gray-600 mb-1">Click to upload image</span>
                        <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</span>
                      </>
                    )}
                  </button>

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Or enter image URL:</p>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error'
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeFeaturedImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors shadow-lg"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => featuredImageInputRef.current?.click()}
                    disabled={uploadingFeaturedImage}
                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Change Image
                  </button>
                </div>
              )}

              {uploadingFeaturedImage && (
                <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={32} />
                    <p className="text-sm text-gray-600">Uploading to Cloudinary...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="" disabled>Select a category</option>
                {BLOG_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate tags with commas
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
