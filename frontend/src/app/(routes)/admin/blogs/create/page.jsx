'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateBlogMutation, useGetCloudinaryImagesQuery, useDeleteCloudinaryImageMutation } from '@/redux/services/blogsApi'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '@/redux/features/auth/authSlice'
import { BLOG_CATEGORIES } from '@/lib/constants'
import TiptapEditor from '@/components/TiptapEditor'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Image as ImageIcon, Upload, Loader2, X, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function CreateBlogPage() {
  const router = useRouter()
  const token = useSelector(selectCurrentToken)
  const [createBlog, { isLoading }] = useCreateBlogMutation()
  const [deleteCloudinaryImage] = useDeleteCloudinaryImageMutation()

  const featuredImageInputRef = useRef(null)
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false)
  const [showImageGallery, setShowImageGallery] = useState(false)

  // Category management
  const [selectedCategory, setSelectedCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')

  // Image Gallery state
  const [cursor, setCursor] = useState(null)
  const [allImages, setAllImages] = useState([])

  const { data: galleryImages, isLoading: isLoadingImages, isFetching: isFetchingImages, refetch: refetchImages } = useGetCloudinaryImagesQuery(cursor, {
    skip: !showImageGallery
  })

  // Append new images when fetched
  useEffect(() => {
    if (galleryImages?.images) {
      setAllImages(prev => {
        const newImages = galleryImages.images.filter(
          newImg => !prev.some(existingImg => existingImg.public_id === newImg.public_id)
        )
        return [...prev, ...newImages]
      })
    }
  }, [galleryImages])

  // Reset gallery when opened
  useEffect(() => {
    if (showImageGallery) {
      setCursor(null)
      setAllImages([])
      refetchImages()
    }
  }, [showImageGallery, refetchImages])

  const loadMoreImages = () => {
    if (galleryImages?.next_cursor) {
      setCursor(galleryImages.next_cursor)
    }
  }

  const handleDeleteImage = async (e, publicId) => {
    e.stopPropagation() // Prevent selecting the image when clicking delete

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteCloudinaryImage(publicId).unwrap()
        if (deleteResult.success) {
          Swal.fire(
            'Deleted!',
            'Your image has been deleted.',
            'success'
          )
          // Remove from local state immediately
          setAllImages(prev => prev.filter(img => img.public_id !== publicId))
          // Also check if the deleted image was selected for the form
          setFormData(prev => {
            if (prev.image && prev.image.includes(publicId)) {
              return { ...prev, image: '' }
            }
            return prev
          })
        }
      } catch (error) {
        console.error('Delete image error:', error)
        toast.error(error?.data?.message || 'Failed to delete image')
      }
    }
  }

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

  // Sync category selection with formData
  const handleCategoryChange = (e) => {
    const value = e.target.value
    setSelectedCategory(value)
    if (value !== 'Other') {
      setFormData(prev => ({ ...prev, category: value }))
    } else {
      setFormData(prev => ({ ...prev, category: customCategory }))
    }
  }

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value
    setCustomCategory(value)
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    setFormData({ ...formData, title, slug })
  }

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
        setShowImageGallery(false)
        if (showImageGallery) refetchImages() // Refresh gallery if open
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

  const selectImageFromGallery = (url) => {
    setFormData({ ...formData, image: url })
    setShowImageGallery(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required')
      return
    }

    const blogData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    }

    try {
      const result = await createBlog(blogData).unwrap()
      toast.success('Blog created successfully!')
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Create blog error:', error)
      toast.error(error?.data?.message || 'Failed to create blog')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Blogs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Blog</h1>
        <p className="text-gray-600">Write and publish your new blog post</p>
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
                onChange={handleTitleChange}
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
                placeholder="Short description of your blog (will be auto-generated if left empty)"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>

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
                <span>{isLoading ? 'Creating...' : 'Publish Blog'}</span>
              </button>
            </div>

            {/* Featured Image with Upload */}
            <div className="bg-white rounded-xl shadow-md p-6 relative">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <ImageIcon size={18} className="mr-2" />
                  Featured Image
                </span>
                <button
                  type="button"
                  onClick={() => setShowImageGallery(true)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Browse Gallery
                </button>
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

                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">or select from</p>
                    <button
                      type="button"
                      onClick={() => setShowImageGallery(true)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline mt-1"
                    >
                      Cloudinary Gallery
                    </button>
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

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => featuredImageInputRef.current?.click()}
                      disabled={uploadingFeaturedImage}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-2 rounded-lg transition-colors text-sm"
                    >
                      Upload New
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImageGallery(true)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-2 rounded-lg transition-colors text-sm"
                    >
                      Gallery
                    </button>
                  </div>
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
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-3"
              >
                <option value="" disabled>Select a category</option>
                {BLOG_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {selectedCategory === 'Other' && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={handleCustomCategoryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter custom category"
                    required={selectedCategory === 'Other'}
                  />
                </div>
              )}
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

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Image Gallery</h3>
              <button onClick={() => setShowImageGallery(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingImages && allImages.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
              ) : allImages.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Upload New Card */}
                    <button
                      onClick={() => featuredImageInputRef.current?.click()}
                      className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Upload size={24} className="text-blue-500 mb-2" />
                      <span className="text-sm font-medium text-blue-600">Upload New</span>
                    </button>

                    {allImages.map((img) => (
                      <div
                        key={img.public_id}
                        className="group relative rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                        onClick={() => selectImageFromGallery(img.url)}
                      >
                        <img
                          src={img.url}
                          alt="Gallery item"
                          className="w-full h-full object-cover aspect-video"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow-sm">Select</span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDeleteImage(e, img.public_id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                          title="Delete image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {galleryImages?.next_cursor && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={loadMoreImages}
                        disabled={isFetchingImages}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-full transition-colors inline-flex items-center"
                      >
                        {isFetchingImages ? (
                          <>
                            <Loader2 size={16} className="animate-spin mr-2" />
                            Loading...
                          </>
                        ) : (
                          'Load More Images'
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No images found in gallery.</p>
                  <button
                    onClick={() => featuredImageInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Upload First Image
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 text-right">
              <button
                onClick={() => setShowImageGallery(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
