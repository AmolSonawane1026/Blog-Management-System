'use client'

import Link from 'next/link'
import { BookOpen, Menu, X, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const isAdmin = pathname?.startsWith('/admin')

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (isAdmin) return null

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`glass-effect rounded-2xl px-6 py-3 flex justify-between items-center transition-all ${scrolled ? 'shadow-lg' : 'shadow-sm'
                    }`}>
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl group-hover:rotate-6 transition-transform">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black gradient-text tracking-tighter">ModernBlog</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-slate-100 ${pathname === item.href ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="h-6 w-px bg-slate-200 mx-2" />

                        {mounted && (
                            isAuthenticated ? (
                                <Link
                                    href="/admin/dashboard"
                                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 group"
                                >
                                    <span>Dashboard</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-indigo-200 shadow-lg flex items-center gap-2 group"
                                >
                                    <span>Sign In</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-3 glass-effect rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col space-y-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-lg font-bold transition-all ${pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-200">
                                {mounted && (
                                    isAuthenticated ? (
                                        <Link
                                            href="/admin/dashboard"
                                            onClick={() => setMenuOpen(false)}
                                            className="block w-full text-center bg-slate-900 text-white px-5 py-4 rounded-xl font-bold"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setMenuOpen(false)}
                                            className="block w-full text-center bg-indigo-600 text-white px-5 py-4 rounded-xl font-bold shadow-lg"
                                        >
                                            Sign In
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
