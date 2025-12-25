'use client'

import Link from 'next/link'
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/redux/services/authApi'
import { setCredentials } from '@/redux/features/auth/authSlice'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const router = useRouter()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const result = await login(formData).unwrap()

      dispatch(setCredentials({
        token: result.token,
        user: result.user
      }))

      toast.success('Welcome back to ModernBlog!')
      router.push('/admin/dashboard')
    } catch (error) {
      toast.error(error?.data?.message || 'Authentication failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 pt-40 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 font-medium text-lg">Continue your creative journey</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-indigo-600 border-slate-300 rounded-lg focus:ring-indigo-500 cursor-pointer"
                />
                <span className="ml-3 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Keep me signed in</span>
              </label>
              <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Forgot?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-slate-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-10 space-y-4 text-center">
            <p className="text-sm font-bold text-slate-500">
              New to ModernBlog?{' '}
              <Link href="/signup" className="text-indigo-600 border-b-2 border-indigo-100 hover:border-indigo-600 transition-all ml-1">
                Create an account
              </Link>
            </p>
            <div className="pt-4">
              <Link href="/" className="text-sm font-bold text-slate-400 hover:text-slate-900 flex items-center justify-center gap-2 group transition-colors">
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
