'use client'

import Link from 'next/link'
import { BookOpen, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const isAuthenticated = useSelector(selectIsAuthenticated)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">ModernBlog</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
                        <Link href="/blogs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blogs</Link>
                        <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
                        <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</Link>
                        {mounted && (
                            isAuthenticated ? (
                                <Link href="/admin/dashboard" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md">Dashboard</Link>
                            ) : (
                                <Link href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md">Login</Link>
                            )
                        )}
                    </div>

                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden py-4 space-y-4 border-t">
                        <Link href="/" className="block text-gray-700 hover:text-blue-600 font-medium py-2">Home</Link>
                        <Link href="/blogs" className="block text-gray-700 hover:text-blue-600 font-medium py-2">Blogs</Link>
                        <Link href="/about" className="block text-gray-700 hover:text-blue-600 font-medium py-2">About</Link>
                        <Link href="/contact" className="block text-gray-700 hover:text-blue-600 font-medium py-2">Contact</Link>
                        {mounted && (
                            isAuthenticated ? (
                                <Link href="/admin/dashboard" className="block w-full text-center bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold mt-4">Dashboard</Link>
                            ) : (
                                <Link href="/login" className="block w-full text-center bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold mt-4">Login</Link>
                            )
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
