'use client'

import { useGetAllBlogsQuery } from '@/redux/services/blogsApi'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/features/auth/authSlice'
import { FileText, Eye, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data, isLoading } = useGetAllBlogsQuery()
  const user = useSelector(selectCurrentUser)
  const blogs = data?.blogs || []

  const stats = [
    {
      title: 'Total Blogs',
      value: blogs.length,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Views',
      value: '12.4K',
      icon: Eye,
      color: 'bg-green-500',
      change: '+18%'
    },
    {
      title: 'Published',
      value: blogs.filter(b => b.status === 'published').length,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Readers',
      value: '3.2K',
      icon: Users,
      color: 'bg-orange-500',
      change: '+25%'
    },
  ]

  const recentBlogs = blogs.slice(0, 5)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your blog today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/blogs/create" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">Create New Blog</h3>
          <p className="text-blue-100">Start writing a new article</p>
        </Link>

        <Link href="/admin/blogs" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">Manage Blogs</h3>
          <p className="text-purple-100">Edit or delete your articles</p>
        </Link>

        <Link href="/" className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">View Website</h3>
          <p className="text-green-100">See your live blog</p>
        </Link>
      </div>

      {/* Recent Blogs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Blogs</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : recentBlogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No blogs yet. Create your first blog!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBlogs.map((blog) => (
              <div key={blog._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{blog.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    blog.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {blog.status || 'published'}
                  </span>
                  <Link 
                    href={`/admin/blogs/edit/${blog._id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
