'use client'

import Link from 'next/link'
import { BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()

    // Don't show navbar on login page or admin routes if desired (User didn't specify, but usually "global" means everywhere. 
    // However, Admin dashboard usually has its own layout. 
    // User said "make the navbar and footer global", so I will put it in root layout.
    // If needed, I can conditionally render it. 
    // Let's assume it should appear everywhere for now, as is typical for a "global" request unless specified otherwise.
    // But wait, the admin dashboard usually has a sidebar.
    // Let's check if there is an admin layout.
    // I'll stick to the user request: "make the navbar and footer global". 
    // If it conflicts with admin layout, we might need a check. 
    // But for now, simple extraction.)

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
                    </div>
                )}
            </div>
        </nav>
    )
}
