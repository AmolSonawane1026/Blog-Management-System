'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Instagram, Mail, Phone, BookOpen } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Footer() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    if (isAdmin) return null

    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6 group">
                            <div className="bg-indigo-600 p-2 rounded-xl">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter">ModernBlog</span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Empowering voices and sharing knowledge through a modern blogging experience. Join our community of creators today.
                        </p>
                        <div className="flex items-center space-x-4">
                            {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Quick Explore</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'All Blogs', href: '/blogs' },
                                { name: 'About Us', href: '/about' },
                                { name: 'Contact', href: '/contact' },
                                { name: 'Author Login', href: '/login' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-indigo-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-4 transition-all duration-300 h-px bg-indigo-400 mr-0 group-hover:mr-2" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Popular Categories</h4>
                        <ul className="space-y-4">
                            {['Technology', 'Lifestyle', 'Business', 'Design', 'Development'].map((cat) => (
                                <li key={cat}>
                                    <Link href={`/blogs?category=${cat.toLowerCase()}`} className="hover:text-indigo-400 transition-colors">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <Mail size={20} className="text-indigo-400 mt-1" />
                                <span>pro.amolsonawane@gmail.com</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Phone size={20} className="text-indigo-400 mt-1" />
                                <span>+91 7558379918</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} ModernBlog. All rights reserved.</p>
                    <div className="flex items-center space-x-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
