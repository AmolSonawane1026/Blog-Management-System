'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuthenticated, selectCurrentUser, logout } from '@/redux/features/auth/authSlice'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, PlusCircle, LogOut, Menu, X, Users, User, ChevronRight, Bell, Search } from 'lucide-react'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const pathname = usePathname()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  if (!isAuthenticated) {
    return null
  }

  const navLinks = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/admin/blogs', icon: FileText, label: 'My Articles' },
    { href: '/admin/blogs/create', icon: PlusCircle, label: 'Write New' },
    ...(user?.role === 'admin' ? [{ href: '/admin/users', icon: Users, label: 'Community' }] : []),
    { href: '/admin/profile', icon: User, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 transition-all duration-500 ease-in-out z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl lg:shadow-none
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-3 mb-12 px-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">ModernBlog</span>
          </Link>

          {/* User Profile Summary */}
          <div className="mb-10 px-2 py-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-bold truncate leading-tight">{user?.name || 'Creator'}</p>
              <p className="text-xs text-slate-500 truncate mt-1 lowercase">{user?.role || 'Author'}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Main Menu</p>
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group
                    ${isActive
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 font-bold'
                      : 'hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              )
            })}
          </nav>

          {/* Footer Actions */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-rose-600/10 hover:text-rose-500 transition-all w-full font-bold"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 glass-effect sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between border-b border-slate-200/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl w-64 lg:w-96 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search data..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700" />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-1">Global Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-500">
                  {user?.name?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 lg:p-10 flex-1">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
        />
      )}
    </div>
  )
}
