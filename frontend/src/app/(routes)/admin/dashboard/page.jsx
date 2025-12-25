'use client'

import { useState, useEffect } from 'react'
import { useGetMyBlogsQuery } from '@/redux/services/blogsApi'
import { useGetCurrentUserQuery } from '@/redux/services/authApi'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/features/auth/authSlice'
import { FileText, Eye, TrendingUp, Users, Plus, ArrowUpRight, Clock, MoreVertical } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const user = useSelector(selectCurrentUser)
  const { data: userData } = useGetCurrentUserQuery(undefined, { skip: !mounted })
  const currentUser = userData?.user || user

  const { data, isLoading } = useGetMyBlogsQuery(
    { email: currentUser?.email },
    { skip: !mounted || !currentUser?.email }
  )

  const blogs = data?.blogs || []

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const stats = [
    {
      title: 'Total Articles',
      value: blogs.length,
      icon: FileText,
      color: 'bg-indigo-600',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Avg. Read Time',
      value: '4.2m',
      icon: Clock,
      color: 'bg-emerald-600',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Total Reach',
      value: '12.4K',
      icon: Eye,
      color: 'bg-violet-600',
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Active Readers',
      value: '3.2K',
      icon: Users,
      color: 'bg-amber-600',
      change: '-2%',
      trend: 'down'
    },
  ]

  const recentBlogs = blogs.slice(0, 5)

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Hey, {currentUser?.name || 'Creator'}! 👋
          </h1>
          <p className="text-slate-500 font-medium">Your creative corner is looking great today.</p>
        </div>
        <Link href="/admin/blogs/create">
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1">
            <Plus size={20} />
            <span>New Article</span>
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="premium-card p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-2xl shadow-lg ring-4 ring-white`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={12} /> : null}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>

              {/* Decorative background element */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${stat.color}`} />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
        <Link href="/admin/blogs/create" className="col-span-1 gradient-bg rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-indigo-200 group transition-all hover:scale-[1.02]">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2">Create Masterpiece</h3>
            <p className="text-indigo-100/80 mb-6 font-medium">Start writing your next viral article with our rich editor.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 font-black rounded-xl group-hover:gap-4 transition-all">
              Go to Editor <Plus size={18} />
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </Link>

        {/* Activity / Recent Blogs */}
        <div className="lg:col-span-2 premium-card p-0 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Activity</h2>
              <p className="text-slate-500 text-sm font-medium">Tracking your latest publication performance.</p>
            </div>
            <Link href="/admin/blogs" className="text-indigo-600 font-bold text-sm hover:underline underline-offset-4">
              View All
            </Link>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : recentBlogs.length === 0 ? (
              <div className="text-center py-20 px-8">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-slate-300" />
                </div>
                <h4 className="text-slate-900 font-bold mb-2">No Articles Yet</h4>
                <p className="text-slate-500 mb-8">Ready to share your insights with the world?</p>
                <Link href="/admin/blogs/create" className="text-indigo-600 font-bold">Create your first blog &rarr;</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentBlogs.map((blog) => (
                  <div key={blog._id} className="p-5 hover:bg-slate-50/80 transition-all flex items-center gap-4 group cursor-pointer border-b last:border-0 border-slate-50">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                      <FileText className="text-slate-400 group-hover:text-white transition-colors" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate mb-1 group-hover:text-indigo-600 transition-colors">{blog.title}</h3>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className={`px-2 py-0.5 rounded-md ${blog.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                          {blog.status || 'published'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/blogs/edit/${blog._id}`}
                        className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                      >
                        Edit
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
