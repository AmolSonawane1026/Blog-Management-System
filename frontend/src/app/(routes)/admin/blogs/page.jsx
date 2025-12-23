'use client'

import { useState, useEffect } from 'react'
import { useGetMyBlogsQuery, useDeleteBlogMutation } from '@/redux/services/blogsApi'
import { useGetCurrentUserQuery } from '@/redux/services/authApi'
import { Edit, Trash2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/features/auth/authSlice'

export default function ManageBlogsPage() {
  const [mounted, setMounted] = useState(false)
  const user = useSelector(selectCurrentUser)
  const { data: userData } = useGetCurrentUserQuery(undefined, { skip: !mounted })
  const currentUser = userData?.user || user
  const { data, isLoading, refetch } = useGetMyBlogsQuery(
    { email: currentUser?.email },
    { skip: !mounted || !currentUser?.email }
  )
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()
  const blogs = data?.blogs || []

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBlog(id).unwrap()
        toast.success('Blog deleted successfully!')
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete blog')
      }
    }
  }

  if (!mounted) return null

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Blogs</h1>
          <p className="text-gray-600">Edit or delete your blog posts</p>
        </div>
        <Link href="/admin/blogs/create">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Blog</span>
          </button>
        </Link>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No blogs found</p>
            <Link href="/admin/blogs/create">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all">
                Create Your First Blog
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {blog.image && (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-12 h-12 rounded-lg object-cover mr-3"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{blog.title}</p>
                          <p className="text-sm text-gray-500">{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {blog.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${blog.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {blog.status || 'published'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Blog"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/blogs/edit/${blog._id}`}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Blog"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={isDeleting}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Blog"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
