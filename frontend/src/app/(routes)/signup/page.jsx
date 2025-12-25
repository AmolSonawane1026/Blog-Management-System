'use client'

import Link from 'next/link'
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useRegisterMutation } from '@/redux/services/authApi'
import { setCredentials } from '@/redux/features/auth/authSlice'
import toast from 'react-hot-toast'

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const router = useRouter()
    const dispatch = useDispatch()
    const [register, { isLoading }] = useRegisterMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match')
        }

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            }).unwrap()

            dispatch(setCredentials({
                token: result.token,
                user: result.user
            }))

            toast.success('Welcome to the community!')
            router.push('/admin/dashboard')
        } catch (error) {
            toast.error(error?.data?.message || 'Registration failed. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 pt-40 pb-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-200/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-purple-200/20 blur-[100px] rounded-full" />
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Join Us Today</h1>
                    <p className="text-slate-500 font-medium text-lg">Create your account and start sharing stories</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                        </div>

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

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <CheckCircle2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-slate-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-10 space-y-4 text-center">
                        <p className="text-sm font-bold text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-600 border-b-2 border-indigo-100 hover:border-indigo-600 transition-all ml-1">
                                Sign In
                            </Link>
                        </p>
                        <div className="pt-4 border-t border-slate-50">
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
