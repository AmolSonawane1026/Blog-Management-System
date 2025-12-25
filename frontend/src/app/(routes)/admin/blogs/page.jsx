'use client'

import { useState, useEffect } from 'react'
import { useGetMyBlogsQuery, useDeleteBlogMutation } from '@/redux/services/blogsApi'
import { useGetCurrentUserQuery } from '@/redux/services/authApi'
import { Edit, Trash2, Eye, Plus, Search, Filter, MoreHorizontal, Calendar } from 'lucide-react'
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
        toast.success('Article removed successfully')
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete article')
      }
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Articles</h1>
          <p className="text-slate-500 font-medium">Draft, manage, and optimize your publications.</p>
        </div>
        <Link href="/admin/blogs/create">
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 flex items-center gap-2">
            <Plus size={20} />
            <span>New Article</span>
          </button>
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl w-full sm:w-80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search your articles..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 font-medium" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100">
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="premium-card overflow-hidden bg-white">
        {isLoading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-500 font-bold">Fetching your stories...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-32 px-6">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Articles Found</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Your creative journey starts with a single word. Let's draft your first masterpiece.</p>
            <Link href="/admin/blogs/create">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-100">
                Create First Blog
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Article Info
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Category
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Published
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <FileText size={20} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors leading-tight mb-1">{blog.title}</p>
                          <p className="text-xs text-slate-400 font-medium truncate">/{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-wider">
                        {blog.category || 'Other'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${blog.status === 'published'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${blog.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {blog.status || 'published'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-bold">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-300" />
                        {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/blogs/edit/${blog._id}`}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={isDeleting}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
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
